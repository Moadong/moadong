// before/after·시안 대조가 쓰는 Vite 서버, 기준 커밋 worktree, 관리자 로그인.
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { waitForQuiet } from './measure.mjs';

export const FRONTEND = path.resolve(import.meta.dirname, '../..');
const REPO = path.resolve(FRONTEND, '..');
const WORKTREE = path.join(REPO, '.context/button-before');

const git = (...args) =>
  execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).trim();

// 기본 기준은 develop-fe 끝이 아니라 갈라진 지점이다. 끝을 쓰면 그 사이 남이 머지한 변경이 내 diff로 잡힌다.
export const defaultBase = () => git('merge-base', 'HEAD', 'origin/develop-fe');

// 기준 커밋 대비 작업 트리에서 달라진 src 파일 (frontend 기준 경로). 새 파일도 넣는다.
export function changedSrcFiles(base) {
  const lines = [
    ...git('diff', '--name-only', base, '--', 'frontend/src').split('\n'),
    ...git(
      'ls-files',
      '--others',
      '--exclude-standard',
      '--',
      'frontend/src',
    ).split('\n'),
  ];
  return new Set(
    lines.filter(Boolean).map((p) => p.replace(/^frontend\//, '')),
  );
}

export const needsAdmin = (route) =>
  route.startsWith('/admin') && !route.startsWith('/admin/login');

export async function loginAdmin(page, baseUrl) {
  const id = process.env.DEV_ADMIN_ID;
  const pw = process.env.DEV_ADMIN_PASSWORD;
  if (!id || !pw)
    throw new Error('DEV_ADMIN_ID·DEV_ADMIN_PASSWORD가 frontend/.env에 없다');
  // Vite HMR 클라이언트가 페이지 로드 즉시 ws://.../?token=...을 열어 계속 붙들고 있어서
  // networkidle은 이 WebSocket을 활성 네트워크로 보고 영원히 안 끝난다. load로 대체하고,
  // 콜드 서버의 첫 모듈 트랜스폼에 대비해 타임아웃만 넉넉히 둔다.
  // load 뒤에도 인증 상태 확인용 fetch가 이어지면 라벨은 같아도 로딩 중 화면일 수 있어
  // waitForQuiet으로 그 fetch들이 끝나길 기다린다. 네비게이션 전에 걸어야 로드 중 요청도 잡힌다.
  const loginPageQuiet = waitForQuiet(page);
  await page.goto(new URL('/admin/login', baseUrl).href, {
    waitUntil: 'load',
    timeout: 60_000,
  });
  await loginPageQuiet;
  await page.getByPlaceholder('아이디').fill(id);
  await page.getByPlaceholder('비밀번호').fill(pw);
  const postLoginQuiet = waitForQuiet(page);
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await page.waitForURL(
    (url) =>
      url.pathname.startsWith('/admin') &&
      !url.pathname.startsWith('/admin/login'),
    { timeout: 20_000 },
  );
  await postLoginQuiet;
}

// 로그인 화면은 로그인한 세션으로 열면 /admin으로 튕긴다. 세션을 둘로 나눈다.
export async function openPages(browser, baseUrl, sites, contextOptions = {}) {
  const anon = await (await browser.newContext(contextOptions)).newPage();
  let admin = null;
  if (sites.some((s) => needsAdmin(s.route))) {
    admin = await (await browser.newContext(contextOptions)).newPage();
    await loginAdmin(admin, baseUrl);
  }
  return (route) => (needsAdmin(route) ? admin : anon);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// localhost가 IPv4·IPv6 어느 쪽으로 풀리든 잡히게 둘 다 본다
function probe(host, port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host, port });
    const done = (v) => {
      sock.destroy();
      resolve(v);
    };
    sock.once('connect', () => done(true));
    sock.once('error', () => done(false));
    sock.setTimeout(1_000, () => done(false));
  });
}

export async function portInUse(port) {
  const hits = await Promise.all(
    ['127.0.0.1', '::1'].map((h) => probe(h, port)),
  );
  return hits.some(Boolean);
}

// detached로 띄운 vite는 터미널 Ctrl-C를 못 받는다. 부모가 어떻게 끝나든 프로세스 그룹째 정리한다.
const live = new Set();
const killGroup = (child, signal) => {
  try {
    process.kill(-child.pid, signal);
  } catch {
    // 이미 종료됨
  }
};
let exitHooked = false;
function hookExit() {
  if (exitHooked) return;
  exitHooked = true;
  process.on('exit', () => {
    for (const c of live) killGroup(c, 'SIGKILL');
  });
  for (const [signal, code] of [
    ['SIGINT', 130],
    ['SIGTERM', 143],
  ])
    process.once(signal, () => {
      for (const c of live) killGroup(c, 'SIGTERM');
      process.exit(code);
    });
}

const ANSI = /\x1b\[[0-9;]*m/g;
const READY = /Local:\s+http:\/\/\S+?:(\d+)/;

export async function startVite(cwd, port, { timeoutMs = 120_000 } = {}) {
  // 남의 서버(고아 vite 포함)가 응답하면 --strictPort인 새 vite는 조용히 죽고, before·after가
  // 같은 남의 서버를 재서 전부 PASS가 된다. 띄우기 전에 막는다.
  if (await portInUse(port))
    throw new Error(
      `포트 ${port}에 이미 다른 프로세스가 떠 있다. 그 서버를 재면 before/after가 같은 서버를 비교한다. 끄고 다시 돌릴 것 (lsof -i :${port})`,
    );
  const child = spawn(
    path.join(cwd, 'node_modules/.bin/vite'),
    [
      '--config',
      './config/vite.config.ts',
      '--port',
      String(port),
      '--strictPort',
    ],
    { cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true },
  );
  live.add(child);
  hookExit();
  let stdout = '';
  let log = '';
  let spawnError = null;
  child.on('error', (e) => {
    spawnError = e;
  });
  child.stdout.on('data', (d) => {
    stdout += d;
    log += d;
  });
  child.stderr.on('data', (d) => {
    log += d;
  });
  const exited = new Promise((r) => child.once('exit', r));
  const isDead = () => child.exitCode !== null || child.signalCode !== null;

  let stopping = null;
  // 프로세스가 끝나고 포트가 풀릴 때까지 기다린다. 안 기다리면 다음 vite가 같은 포트에서 실패한다.
  const stop = () =>
    (stopping ??= (async () => {
      if (child.pid && !isDead()) {
        killGroup(child, 'SIGTERM');
        const force = setTimeout(() => killGroup(child, 'SIGKILL'), 10_000);
        await exited;
        clearTimeout(force);
      }
      // 그룹에 남은 자식(esbuild 등)까지 정리
      if (child.pid) killGroup(child, 'SIGKILL');
      live.delete(child);
      const until = Date.now() + 10_000;
      while (await portInUse(port)) {
        if (Date.now() > until)
          throw new Error(`vite를 멈췄는데 포트 ${port}가 안 풀린다`);
        await sleep(200);
      }
    })());

  const url = `http://localhost:${port}`;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (spawnError) {
      live.delete(child);
      throw new Error(`vite를 못 띄웠다 (${cwd}): ${spawnError.message}`);
    }
    if (isDead()) {
      live.delete(child);
      throw new Error(`vite가 종료됨 (${cwd}):\n${log}`);
    }
    // 이 자식이 살아 있고 자기 준비 줄을 냈을 때만 준비된 것이다. fetch 응답만으로는 누구의 서버인지 모른다.
    const ready = stdout.replace(ANSI, '').match(READY);
    if (ready) {
      if (Number(ready[1]) !== port) {
        await stop();
        throw new Error(`vite가 다른 포트(${ready[1]})에 떴다:\n${log}`);
      }
      return { url, pid: child.pid, stop };
    }
    await sleep(200);
  }
  await stop();
  throw new Error(
    `vite가 ${url}에서 ${timeoutMs / 1000}초 안에 안 떴다:\n${log}`,
  );
}

// node_modules를 심볼릭 링크로 공유하면 Vite가 worktree 밖 파일 서빙을 막는다. 기준 커밋 lockfile로 따로 설치한다.
export function prepareBaseWorktree(ref) {
  const sha = git('rev-parse', ref);
  const fe = path.join(WORKTREE, 'frontend');
  const reusable =
    existsSync(WORKTREE) &&
    git('-C', WORKTREE, 'rev-parse', 'HEAD') === sha &&
    existsSync(path.join(fe, 'node_modules'));
  if (!reusable) {
    if (existsSync(WORKTREE)) git('worktree', 'remove', '--force', WORKTREE);
    git('worktree', 'add', '--detach', WORKTREE, sha);
    execFileSync('npm', ['ci', '--prefer-offline', '--no-audit', '--no-fund'], {
      cwd: fe,
      stdio: 'inherit',
    });
  }
  copyFileSync(path.join(FRONTEND, '.env'), path.join(fe, '.env'));
  return fe;
}

export function removeBaseWorktree() {
  if (existsSync(WORKTREE)) git('worktree', 'remove', '--force', WORKTREE);
}
