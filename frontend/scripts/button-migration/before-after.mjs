// 단계 ④: 기준 커밋과 현재 작업 트리를 같은 dev API로 차례로 띄워 자리마다 렌더 결과를 비교한다.
import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  changedSrcFiles,
  defaultBase,
  FRONTEND,
  openPages,
  prepareBaseWorktree,
  removeBaseWorktree,
  startVite,
} from './app.mjs';
import { compareRuns } from './compare.mjs';
import { launchBrowser, measureSite } from './measure.mjs';
import {
  loadSites,
  pickByIds,
  promoteVerified,
  saveSites,
  SITES_FILE,
  staleSites,
} from './sites.mjs';

// 두 서버를 같은 포트로 차례로 띄운다. 동시에 띄우면 node_modules/.vite 캐시를 서로 덮어쓴다.
const PORT = 3101;
const OUT = path.join(FRONTEND, 'visual-diff/button-migration');

const { values: args } = parseArgs({
  options: {
    base: { type: 'string' },
    ids: { type: 'string' },
    status: { type: 'string', default: 'migrated' },
    targets: { type: 'string' },
    clean: { type: 'boolean', default: false },
  },
});
const base = args.base ?? defaultBase();

const fromLedger = !args.targets;
const all = fromLedger
  ? loadSites(SITES_FILE)
  : JSON.parse(readFileSync(path.resolve(FRONTEND, args.targets), 'utf8'));
let targets;
if (args.ids) {
  const { picked, unknown } = pickByIds(all, args.ids.split(','));
  if (unknown.length) {
    console.error(`대장에 없는 id:\n${unknown.join('\n')}`);
    process.exit(2);
  }
  targets = picked;
} else {
  targets = all.filter((s) => !fromLedger || s.status === args.status);
}
// 대장 모드에서만 본다. --targets(스모크)는 같은 코드끼리 비교하는 게 목적이다.
// 대상이 0개여도 먼저 알린다 — 이전해 놓고 migrated로 안 바꾼 게 대상 0개의 흔한 원인이다.
const changed = fromLedger ? changedSrcFiles(base) : null;
if (fromLedger) {
  for (const s of staleSites(all, changed))
    console.log(
      `WARN  ${s.id}  기준(${base})과 파일이 다른데 status가 ${s.status}다. 이전했다면 migrated로 바꿀 것`,
    );
  if (!changed.size)
    console.log(
      `WARN  src가 기준(${base})과 같다. 같은 코드끼리 비교라 verified로 올리지 않는다`,
    );
}

if (!targets.length) {
  console.error('대상 자리가 없다');
  process.exit(2);
}
const incomplete = targets.filter((s) => !s.route || !s.locator);
if (incomplete.length) {
  console.error(
    `route·locator가 비어 있는 자리:\n${incomplete.map((s) => s.id).join('\n')}`,
  );
  process.exit(2);
}

async function measureAll(cwd) {
  const server = await startVite(cwd, PORT);
  // launchBrowser가 던지면 browser가 없어도 server는 반드시 멈춰야 포트가 안 묶인다.
  let browser;
  try {
    browser = await launchBrowser();
    const pageFor = await openPages(browser, server.url, targets);
    const out = new Map();
    for (const site of targets) {
      try {
        out.set(
          site.id,
          await measureSite(pageFor(site.route), server.url, site),
        );
      } catch (e) {
        out.set(site.id, { error: e.message });
      }
    }
    return out;
  } finally {
    if (browser) await browser.close();
    // 포트가 풀린 뒤에 돌아온다. 안 기다리면 다음 쪽 vite가 아직 살아 있는 서버와 부딪힌다.
    await server.stop();
  }
}

// 위드마다 waitForQuiet이 포기한 요청을 모아 폭 구분 없이 하나로 합친다. 리포트는
// "이 자리를 잴 때 뭔가 끝까지 기다리지 못했다"만 알려주면 되고, 어느 폭인지는 중요치 않다.
const unionWrittenOff = (measured) => [
  ...new Set(Object.values(measured).flatMap((w) => w?.writtenOff ?? [])),
];

function renderReport(site, r, writtenOff) {
  const rows = r.rows.map(
    (row) =>
      `| ${row.width} | ${row.state} | ${row.diffs.length ? 'FAIL' : 'PASS'} | ${row.pixel == null ? '–' : `${row.pixel.toFixed(3)}%`} | ${row.diffs.map((d) => `${d.key}: ${d.before} → ${d.after}`).join('<br>') || '–'} |`,
  );
  const fmt = (urls) => (urls.length ? urls.join(', ') : '없음');
  return `# ${site.id} — ${r.pass ? 'PASS' : 'FAIL'}

- 기준: \`${base}\` · 비교: 현재 작업 트리
- 경로: \`${site.route}\` · locator: \`${JSON.stringify(site.locator)}\`
- 요청 포기(before, ${base}): ${fmt(writtenOff.before)}
- 요청 포기(after, 현재 작업 트리): ${fmt(writtenOff.after)}

| 폭 | 상태 | 판정 | 픽셀 차이 | 다른 값 |
|---|---|---|---|---|
${rows.join('\n')}
`;
}

const beforeDir = prepareBaseWorktree(base);
const before = await measureAll(beforeDir);
const after = await measureAll(FRONTEND);

const results = [];
for (const site of targets) {
  const b = before.get(site.id);
  const a = after.get(site.id);
  const dir = path.join(OUT, site.id.replace(/[^\w.-]+/g, '_'));
  await mkdir(dir, { recursive: true });
  if (b.error || a.error) {
    await writeFile(
      path.join(dir, 'report.md'),
      `# ${site.id} — ERROR\n\n- before: ${b.error ?? 'ok'}\n- after: ${a.error ?? 'ok'}\n`,
    );
    results.push({ site, pass: false, note: b.error ?? a.error });
    continue;
  }
  const r = compareRuns(b, a);
  for (const row of r.rows) {
    if (!row.pixel) continue;
    const stem = path.join(dir, `${row.width}-${row.state}`);
    await writeFile(`${stem}-before.png`, b[row.width][row.state].png);
    await writeFile(`${stem}-after.png`, a[row.width][row.state].png);
    await writeFile(`${stem}-diff.png`, row.diffPng);
  }
  const writtenOff = { before: unionWrittenOff(b), after: unionWrittenOff(a) };
  await writeFile(
    path.join(dir, 'report.md'),
    renderReport(site, r, writtenOff),
  );
  const writtenOffAll = [
    ...new Set([...writtenOff.before, ...writtenOff.after]),
  ].sort();
  results.push({
    site,
    pass: r.pass,
    note: `${path.relative(FRONTEND, dir)}/report.md`,
    writtenOff: writtenOffAll,
  });
}

if (fromLedger)
  saveSites(
    SITES_FILE,
    promoteVerified(all, results, { srcChanged: changed.size > 0 }),
  );
if (args.clean) removeBaseWorktree();
for (const x of results) {
  console.log(`${x.pass ? 'PASS' : 'FAIL'}  ${x.site.id}  ${x.note}`);
  if (x.writtenOff?.length)
    console.log(
      `NOTE  ${x.site.id}  요청 포기: ${x.writtenOff.length}건 (리포트 참고)`,
    );
}
process.exit(results.every((x) => x.pass) ? 0 : 1);
