// 실제 브라우저에서 요소의 computed style·DOM 속성·스크린샷을 잰다.
import { chromium } from 'playwright';

// mediaQuery.ts가 max-width 기준이라 구간마다 한 폭씩: desktop·laptop·tablet·mobile·mini_mobile
export const WIDTHS = [1440, 1280, 700, 500, 375];

export const STYLE_PROPS = [
  'display',
  'width',
  'height',
  'min-height',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'background-color',
  'background-image',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-align',
  'gap',
  'justify-content',
  'align-items',
  'box-shadow',
  'opacity',
  'cursor',
  // 레이아웃: 이전 뒤 부모 셀렉터(`Wrapper > button`)가 안 걸리면 여기서 드러난다 (스펙 실패 모드 ②)
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'align-self',
  'order',
];

// hover 직후 전환 중간값이 잡히지 않게 양쪽 모두 끈다
export const FREEZE_CSS =
  '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}';

const FIND_TIMEOUT_MS = 5_000;

export const launchBrowser = () => chromium.launch();

const locate = (page, spec) =>
  spec.css
    ? page.locator(spec.css)
    : page.getByRole(spec.role ?? 'button', { name: spec.name, exact: true });

const IGNORED_RESOURCE_TYPES = new Set(['websocket', 'eventsource']);

// load는 끝났지만 그 뒤 fetch가 DOM을 늦게 고치는 경우를 잡는다. 네비게이션 전에 호출해
// 리스너를 먼저 걸고, goto 뒤에 await해야 로드 중 쏜 요청도 추적된다.
//
// requestGraceMs: 관리자 인증 체크(/auth/user/find/club, /auth/user/refresh)를 dev 서버의
// server.proxy로 중계할 때는, 응답(상태코드·본문 길이)이 이미 다 왔는데도 Chromium이 이 요청을
// 40초가 지나도 끝난 걸로 보지 않는 경우가 실측으로 확인됐다(response.text()도 멈춤 — 프록시가
// HTTP/2 업스트림을 HTTP/1.1로 중계하며 종료 신호를 안 보내는 것으로 보임). 이런 요청을 idle
// 판정에서 빼지 않으면 모든 관리자 페이지에서 영원히 timeoutMs에 걸려 던진다.
// 앱이 이 요청을 포기해 주지는 않는다. fetchWithTimeout(src/apis/utils/fetchWithTimeout.ts, 10초)은
// `await fetch()`가 풀리는 순간(헤더 도착) 타이머를 지우고, 그 뒤 본문 읽기(handleResponse →
// response.json/text)에는 시한이 없다. 그래서 본문이 멈춘 요청에 기대는 화면은 로딩 상태로 남고,
// before·after가 같은 요청을 포기했다면 두 쪽 다 로딩 화면을 재서 비교한 것일 수 있다. 포기한
// 요청은 writtenOff로 돌려줘서 호출자가 리포트에 남기고, 그런 PASS는 verified로 올리지 않는다.
// 남은 위험 한 줄: 그레이스로 포기한 요청이 그 뒤에도 계속 스트리밍되다가 한참 늦게 DOM을
// 고치면 그 변경은 못 잡는다.
//
// timeoutMs는 함수 시작부터의 고정 예산이 아니라 "함수 시작으로부터의 절대 상한"이다. 실제
// 마감(deadline)은 가장 최근에 시작한 요청 기준으로 requestGraceMs + idleMs + 2_000ms보다
// 항상 늦게 잡히도록 매 요청마다 뒤로 늘어난다(앞으로는 안 당긴다). t≈4s에 시작한 요청은
// t≈4s+11s=15s에야 그레이스로 풀리는데 고정 예산이 15s면 그 순간 딱 걸려 던진다 — 실측으로
// 재현된 버그다. timeoutMs(기본 60s)는 이 늘어나는 마감의 절대 캡이라, 요청을 끝없이 쏘는
// 페이지는 그래도 60초 뒤 소리 내며 실패한다.
export function waitForQuiet(
  page,
  { idleMs = 500, timeoutMs = 60_000, requestGraceMs = 11_000, signal } = {},
) {
  const startedAt = new Map(); // request -> 시작 시각(ms)
  const writtenOff = new Set(); // 그레이스로 포기한 요청의 path(쿼리 제거, 중복 제거)
  const start = Date.now();
  const absoluteDeadline = start + timeoutMs;
  let idleTimer = null;
  let sweepTimer = null;
  let timeoutTimer = null;
  let settled = false;

  return new Promise((resolve, reject) => {
    // 요청이 하나도 없어도 쓸 초기값 — t=0에 요청이 왔다고 가정한 마감.
    let deadline = Math.min(
      absoluteDeadline,
      start + requestGraceMs + idleMs + 2_000,
    );

    const clearIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = null;
    };

    const detach = () => {
      page.off('request', onRequest);
      page.off('requestfinished', onSettledRequest);
      page.off('requestfailed', onSettledRequest);
      clearIdleTimer();
      clearInterval(sweepTimer);
      clearTimeout(timeoutTimer);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      detach();
      resolve({ writtenOff: [...writtenOff] });
    };

    const scheduleIdleCheck = () => {
      clearIdleTimer();
      if (startedAt.size === 0) idleTimer = setTimeout(finish, idleMs);
    };

    const scheduleTimeoutTimer = () => {
      clearTimeout(timeoutTimer);
      timeoutTimer = setTimeout(onTimeout, Math.max(0, deadline - Date.now()));
    };

    // 새 요청이 시작하면, 그 요청이 그레이스+idle로 풀릴 시점(+2초 여유)보다는
    // 마감이 늦어지게 늘린다. 절대 캡(absoluteDeadline)은 넘지 않는다.
    const extendDeadline = (requestStartedAt) => {
      const candidate = Math.min(
        absoluteDeadline,
        requestStartedAt + requestGraceMs + idleMs + 2_000,
      );
      if (candidate > deadline) {
        deadline = candidate;
        scheduleTimeoutTimer();
      }
    };

    const onRequest = (req) => {
      if (IGNORED_RESOURCE_TYPES.has(req.resourceType())) return;
      const now = Date.now();
      startedAt.set(req, now);
      clearIdleTimer();
      extendDeadline(now);
    };

    const onSettledRequest = (req) => {
      startedAt.delete(req);
      scheduleIdleCheck();
    };

    page.on('request', onRequest);
    page.on('requestfinished', onSettledRequest);
    page.on('requestfailed', onSettledRequest);

    // requestfinished/failed가 영원히 안 오는 요청을 주기적으로 걸러낸다.
    sweepTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [req, ts] of startedAt) {
        if (now - ts > requestGraceMs) {
          startedAt.delete(req);
          try {
            writtenOff.add(new URL(req.url()).pathname);
          } catch {
            writtenOff.add(req.url());
          }
          changed = true;
        }
      }
      if (changed) scheduleIdleCheck();
    }, 250);

    function onTimeout() {
      if (settled) return;
      settled = true;
      detach();
      const urls = [...startedAt.keys()].map((r) => r.url());
      reject(
        new Error(
          `waitForQuiet: ${timeoutMs}ms 절대 상한 안에 조용해지지 않음 (in-flight ${urls.length}개: ${urls.join(', ')})`,
        ),
      );
    }

    // 네비게이션이 먼저 실패하면 아무도 이 promise를 기다리지 않는다. 그대로 두면 리스너·타이머가
    // 남아 있다가 절대 상한에서 reject되고, 핸들러가 없어 프로세스가 죽는다.
    signal?.addEventListener(
      'abort',
      () => {
        if (settled) return;
        settled = true;
        detach();
        reject(signal.reason);
      },
      { once: true },
    );

    scheduleTimeoutTimer();
    scheduleIdleCheck();
  });
}

// action(네비게이션)보다 먼저 waitForQuiet을 걸고, action이 던지면 대기를 거둔 뒤 그 오류를 던진다.
export async function withQuiet(page, action, options) {
  const controller = new AbortController();
  const quiet = waitForQuiet(page, { ...options, signal: controller.signal });
  try {
    await action();
  } catch (e) {
    quiet.catch(() => {});
    controller.abort(e);
    throw e;
  }
  return quiet;
}

export async function resolveTarget(page, spec) {
  const all = locate(page, spec);
  try {
    await all.first().waitFor({ state: 'attached', timeout: FIND_TIMEOUT_MS });
  } catch {
    return null;
  }
  const count = await all.count();
  if (spec.nth == null && count > 1)
    throw new Error(
      `locator가 ${count}개에 걸린다. nth를 지정할 것: ${JSON.stringify(spec)}`,
    );
  const target = spec.nth == null ? all.first() : all.nth(spec.nth);
  return (await target.isVisible()) ? target : null;
}

async function snapshot(target) {
  const style = await target.evaluate((el, props) => {
    const cs = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
  }, STYLE_PROPS);
  const dom = await target.evaluate((el) => ({
    tag: el.tagName.toLowerCase(),
    // 속성값이 아니라 실효값. 폼 안 type 없는 버튼은 'submit'이다.
    type: typeof el.type === 'string' ? el.type : null,
    role: el.getAttribute('role'),
    disabled: el.disabled === true,
    aria: Object.fromEntries(
      [...el.attributes]
        .filter((a) => a.name.startsWith('aria-'))
        .map((a) => [a.name, a.value])
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  }));
  dom.ariaSnapshot = await target.ariaSnapshot();
  // 스크린샷은 요소 상자만 자르므로 자리 이동은 안 보인다. 문서 기준 좌표라 스크롤 위치와 무관하다.
  const box = await target.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + window.scrollX,
      y: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    };
  });
  return { style, dom, box, png: await target.screenshot() };
}

export async function measureStates(page, spec) {
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  const target = await resolveTarget(page, spec);
  if (!target) return { hidden: true };
  await target.scrollIntoViewIfNeeded();
  const normal = await snapshot(target);
  await target.hover();
  const hover = await snapshot(target);
  await page.mouse.move(0, 0);
  return { default: normal, hover };
}

export async function measureSite(page, baseUrl, site) {
  const out = {};
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    // 폭마다 다시 연다. 마운트 시점 폭으로 분기하는 컴포넌트가 있다.
    // Vite HMR이 띄우는 WebSocket이 계속 열려 있어 networkidle은 dev 서버에서 절대 안 끝난다.
    // load로 멈추고, load 뒤에도 이어지는 fetch(데이터 로딩)는 waitForQuiet으로 따로 기다린다.
    const { writtenOff } = await withQuiet(page, () =>
      page.goto(new URL(site.route, baseUrl).href, { waitUntil: 'load' }),
    );
    out[width] = { ...(await measureStates(page, site.locator)), writtenOff };
  }
  return out;
}
