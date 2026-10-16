import assert from 'node:assert/strict';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { needsAdmin, portInUse, startVite } from './app.mjs';

test('로그인 화면은 비로그인 세션으로 연다', () => {
  assert.equal(needsAdmin('/admin/login'), false);
  assert.equal(needsAdmin('/admin/club-info'), true);
  assert.equal(needsAdmin('/admin'), true);
  assert.equal(needsAdmin('/clubDetail/@abc'), false);
});

// node_modules/.bin/vite 자리에 가짜 실행 파일을 둔다. 뜨면 spawned 파일을 남겨 "띄웠는지"를 본다.
function fakeViteDir({ ready = true, serve = true } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'fake-vite-'));
  mkdirSync(path.join(dir, 'node_modules/.bin'), { recursive: true });
  const bin = path.join(dir, 'node_modules/.bin/vite');
  writeFileSync(
    bin,
    `#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
fs.writeFileSync(${JSON.stringify(path.join(dir, 'spawned'))}, String(process.pid));
const port = Number(process.argv[process.argv.indexOf('--port') + 1]);
if (!${serve}) process.exit(1);
const server = http.createServer((_q, s) => s.end('fake'));
server.on('error', () => process.exit(1));
server.listen(port, 'localhost', () => {
  if (${ready}) console.log('\\x1b[32m  ➜  \\x1b[39m\\x1b[1mLocal\\x1b[22m:   \\x1b[36mhttp://localhost:' + port + '/\\x1b[39m');
});
process.on('SIGTERM', () => setTimeout(() => process.exit(0), 300));
`,
  );
  chmodSync(bin, 0o755);
  return dir;
}

const PORT = 3197;

const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

test('포트에 이미 다른 서버가 있으면 띄우지 않고 실패한다 (남의 서버를 재지 않는다)', async () => {
  const foreign = createServer((_q, s) => s.end('foreign'));
  await new Promise((r) => foreign.listen(PORT, 'localhost', r));
  const dir = fakeViteDir();
  try {
    await assert.rejects(startVite(dir, PORT), /이미 다른 프로세스/);
    assert.equal(existsSync(path.join(dir, 'spawned')), false);
  } finally {
    await new Promise((r) => foreign.close(r));
  }
});

test('준비 줄을 내기 전에 죽은 vite는 실패다', async () => {
  const dir = fakeViteDir({ serve: false });
  await assert.rejects(startVite(dir, PORT), /vite가 종료됨/);
});

test('stop()은 프로세스가 끝나고 포트가 풀린 뒤에 돌아온다', async () => {
  const dir = fakeViteDir();
  const server = await startVite(dir, PORT);
  assert.equal(server.url, `http://localhost:${PORT}`);
  assert.equal(await (await fetch(server.url)).text(), 'fake');
  const pid = server.pid;
  await server.stop();
  assert.equal(alive(pid), false);
  assert.equal(await portInUse(PORT), false);
});
