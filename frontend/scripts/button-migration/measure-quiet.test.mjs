import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { launchBrowser, waitForQuiet, withQuiet } from './measure.mjs';

// load는 끝났지만 그 뒤 fetch가 DOM을 늦게 고치는 상황을 재현한다.
const HTML = `<!doctype html>
<button style="padding-left:10px">버튼</button>
<script>
  fetch('/slow').then(() => {
    document.querySelector('button').style.paddingLeft = '30px';
  });
</script>`;

let browser;
before(async () => {
  browser = await launchBrowser();
});
after(async () => {
  await browser.close();
});

async function withPage(run) {
  const page = await browser.newPage();
  await page.route('http://quiet.test/**', async (route) => {
    if (route.request().url().endsWith('/slow')) {
      await new Promise((r) => setTimeout(r, 800));
      return route.fulfill({ status: 200, body: 'ok' });
    }
    return route.fulfill({ status: 200, contentType: 'text/html', body: HTML });
  });
  try {
    await run(page);
  } finally {
    await page.close();
  }
}

const paddingLeft = (page) =>
  page.locator('button').evaluate((el) => getComputedStyle(el).paddingLeft);

test('waitForQuiet은 load 뒤에도 이어지는 fetch가 끝난 상태를 본다', async () => {
  await withPage(async (page) => {
    // 네비게이션 전에 걸어야 로드 중 쏜 /slow 요청도 추적된다.
    const quiet = waitForQuiet(page);
    await page.goto('http://quiet.test/', { waitUntil: 'load' });
    await quiet;
    assert.equal(await paddingLeft(page), '30px');
  });
});

test('waitForQuiet 없이 load 직후면 아직 이전 값이다 (대기가 실제로 의미 있다는 대조군)', async () => {
  await withPage(async (page) => {
    await page.goto('http://quiet.test/', { waitUntil: 'load' });
    assert.equal(await paddingLeft(page), '10px');
  });
});

// 끝까지 안 끝나는 요청(이 앱의 dev 프록시 인증 체크 실측과 같은 모양)을 그레이스가
// writtenOff로 걸러내는지 본다. requestGraceMs를 짧게 줘서 테스트가 빨리 끝나게 한다.
const HANG_HTML = `<!doctype html>
<button style="padding-left:10px">버튼</button>
<script>
  fetch('/hang?token=secret');
</script>`;

test('그레이스를 넘긴 요청은 writtenOff에 쿼리 없는 path로 남는다', async () => {
  const page = await browser.newPage();
  try {
    await page.route('http://quiet.test/**', async (route) => {
      if (route.request().url().includes('/hang')) {
        await new Promise(() => {}); // 절대 fulfill하지 않는다 — 그레이스 스윕 대상.
        return;
      }
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: HANG_HTML,
      });
    });
    const quiet = waitForQuiet(page, {
      idleMs: 100,
      timeoutMs: 5_000,
      requestGraceMs: 300,
    });
    await page.goto('http://quiet.test/', { waitUntil: 'load' });
    const { writtenOff } = await quiet;
    assert.deepEqual(writtenOff, ['/hang']);
  } finally {
    await page.close();
  }
});

// 실제 사고 재현: 함수 시작 기준 초기 마감(requestGraceMs+idleMs+2초 = 2400ms) 근처에서
// 시작한 요청은 그 마감 뒤에야 그레이스로 풀린다. 마감이 요청 시작 기준으로 안 늘어나면
// 2400ms에 던지므로, 이 테스트는 늘어나는 마감이 없으면 실패한다.
// 필러는 그레이스(300ms)보다 짧게 끊어 이어 붙인다 — 하나로 길게 잡으면 필러 자체가
// 그레이스로 버려져 idle로 먼저 끝나고, late-hang은 시작도 못 한 채 테스트가 거짓으로 통과한다.
const FILLER_MS = 200;
const FILLER_COUNT = 11; // 약 2200ms 동안 in-flight를 0으로 안 만든다.
const LATE_HANG_HTML = `<!doctype html>
<button style="padding-left:10px">버튼</button>
<script>
  (async () => {
    for (let i = 0; i < ${FILLER_COUNT}; i++) await fetch('/filler');
    fetch('/late-hang?token=secret');
  })();
</script>`;

test('초기 마감 뒤에야 풀리는 늦은 요청도 마감이 늘어나 writtenOff로 남고 던지지 않는다', async () => {
  const page = await browser.newPage();
  try {
    await page.route('http://quiet.test/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/late-hang')) {
        await new Promise(() => {}); // 절대 fulfill하지 않는다.
        return;
      }
      if (url.includes('/filler')) {
        await new Promise((r) => setTimeout(r, FILLER_MS));
        return route.fulfill({ status: 200, body: 'ok' });
      }
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: LATE_HANG_HTML,
      });
    });
    const t0 = Date.now();
    const quiet = waitForQuiet(page, {
      idleMs: 100,
      requestGraceMs: 300,
      timeoutMs: 6_000,
    });
    await page.goto('http://quiet.test/', { waitUntil: 'load' });
    const { writtenOff } = await quiet;
    assert.deepEqual(writtenOff, ['/late-hang']);
    // 초기 마감(2400ms)을 실제로 넘겨서 끝났는지 — 넘기지 않았다면 연장을 검증한 게 아니다.
    assert.ok(
      Date.now() - t0 > 2_400,
      `초기 마감 전에 끝남: ${Date.now() - t0}ms`,
    );
  } finally {
    await page.close();
  }
});

// goto가 던진 뒤 남은 대기가 절대 상한에서 reject되면 핸들러가 없어 프로세스가 죽는다.
// 문서 요청 자체를 붙잡아 goto를 타임아웃시키고, 대기의 상한(600ms)을 넘겨 기다려 본다.
test('withQuiet은 네비게이션이 실패하면 그 오류를 던지고 대기를 거둔다', async () => {
  const page = await browser.newPage();
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  process.on('unhandledRejection', onUnhandled);
  try {
    await page.route('http://quiet.test/**', () => new Promise(() => {}));
    await assert.rejects(
      withQuiet(page, () => page.goto('http://quiet.test/', { timeout: 300 }), {
        timeoutMs: 600,
        requestGraceMs: 10_000,
      }),
      /Timeout/,
    );
    assert.equal(page.listenerCount('request'), 0);
    await new Promise((r) => setTimeout(r, 900));
    assert.deepEqual(unhandled, []);
  } finally {
    process.off('unhandledRejection', onUnhandled);
    await page.close();
  }
});
