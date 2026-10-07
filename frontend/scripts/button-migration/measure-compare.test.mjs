import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { PNG } from 'pngjs';
import { compareRuns, exactPixelDiff } from './compare.mjs';
import { launchBrowser, measureStates } from './measure.mjs';

const CSS =
  'button{padding:8px 16px;background:#3A3A3A;color:#FFFFFF;border:0;border-radius:10px;font-size:16px;transition:background .3s} button:hover{background:#111111}';
const html = (css, body) => `<style>${css}</style><form>${body}</form>`;
const SAME = html(CSS, '<button>지원하기</button>');

let browser;
before(async () => {
  browser = await launchBrowser();
});
after(async () => {
  await browser.close();
});

async function run(content) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 400 });
  await page.setContent(content);
  const m = await measureStates(page, { role: 'button', name: '지원하기' });
  await page.close();
  return { 1440: m };
}

test('같은 마크업이면 통과하고 픽셀 차이가 0이다', async () => {
  const r = compareRuns(await run(SAME), await run(SAME));
  assert.equal(r.pass, true);
  assert.ok(r.rows.every((row) => row.pixel === 0));
});

test('패딩 1px 차이를 잡는다', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(
      html(CSS.replace('8px 16px', '8px 17px'), '<button>지원하기</button>'),
    ),
  );
  assert.equal(r.pass, false);
  assert.ok(
    r.rows.some((row) => row.diffs.some((d) => d.key === 'padding-right')),
  );
});

test('폼 안에서 실효 type이 submit→button으로 바뀌면 잡는다', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(html(CSS, '<button type="button">지원하기</button>')),
  );
  assert.equal(r.pass, false);
  assert.ok(r.rows.some((row) => row.diffs.some((d) => d.key === 'dom.type')));
});

test('type을 명시해도 실효 type이 같으면 통과', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(html(CSS, '<button type="submit">지원하기</button>')),
  );
  assert.equal(r.pass, true);
});

test('hover 배경색 차이를 hover 행에서만 잡는다 (트랜지션 중간값 아님)', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(
      html(CSS.replace('#111111', '#222222'), '<button>지원하기</button>'),
    ),
  );
  assert.equal(r.pass, false);
  assert.deepEqual(
    r.rows.filter((row) => row.diffs.length).map((row) => row.state),
    ['hover'],
  );
  const bg = r.rows
    .find((row) => row.state === 'hover')
    .diffs.find((d) => d.key === 'background-color');
  assert.deepEqual(
    [bg.before, bg.after],
    ['rgb(17, 17, 17)', 'rgb(34, 34, 34)'],
  );
});

test('한쪽에서만 숨으면 잡는다', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(html(`${CSS} button{display:none}`, '<button>지원하기</button>')),
  );
  assert.equal(r.pass, false);
});

test('양쪽 다 어디서도 안 보이면 실패', async () => {
  const gone = html(CSS, '<button>다른 버튼</button>');
  const r = compareRuns(await run(gone), await run(gone));
  assert.equal(r.pass, false);
  assert.equal(r.rows[0].diffs[0].key, 'not-found');
});

test('안쪽 요소만 바뀌어도 픽셀로 잡는다', async () => {
  const withSpan = (css) => html(css, '<button><span>지원하기</span></button>');
  const r = compareRuns(
    await run(withSpan(CSS)),
    await run(withSpan(`${CSS} button span{color:#FF0000}`)),
  );
  assert.equal(r.pass, false);
  assert.ok(r.rows.some((row) => row.diffs.some((d) => d.key === 'pixel')));
});

const patch = (hex, width = 20, height = 10) => {
  const png = new PNG({ width, height });
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (let o = 0; o < png.data.length; o += 4) png.data.set([r, g, b, 255], o);
  return PNG.sync.write(png);
};

test('픽셀 비교는 정확 일치다: 같은 PNG는 0, 미세한 색 차이·크기 차이는 0이 아니다', () => {
  assert.equal(
    exactPixelDiff(patch('#333333'), patch('#333333')).mismatchPercent,
    0,
  );
  for (const [x, y] of [
    ['#333333', '#3A3A3A'],
    ['#555555', '#666666'],
    ['#FF7543', '#FF6A33'],
  ])
    assert.equal(
      exactPixelDiff(patch(x), patch(y)).mismatchPercent,
      100,
      `${x}↔${y}`,
    );
  const sized = exactPixelDiff(patch('#333333'), patch('#333333', 21, 10));
  assert.equal(sized.sameSize, false);
  assert.ok(sized.mismatchPercent > 0);
});

// 기준 픽셀 diff(threshold 0.1)는 이 정도 차이를 0%로 본다. 판정은 정확히 같아야 한다.
test('안쪽 요소의 미세한 색 변화(#333333→#3A3A3A)도 픽셀로 잡는다', async () => {
  const withSpan = (css) => html(css, '<button><span>지원하기</span></button>');
  const r = compareRuns(
    await run(withSpan(`${CSS} button span{color:#333333}`)),
    await run(withSpan(`${CSS} button span{color:#3A3A3A}`)),
  );
  assert.equal(r.pass, false);
  assert.ok(r.rows.some((row) => row.diffs.some((d) => d.key === 'pixel')));
  assert.ok(r.rows.every((row) => row.pixel > 0));
});

// 스펙 실패 모드 ②: 부모 셀렉터가 안 걸려 자리가 바뀌어도 버튼 자신의 모습은 같다.
test('부모 규칙이 버튼 margin-top만 바꿔도 잡는다', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(
      html(`${CSS} form > button{margin-top:8px}`, '<button>지원하기</button>'),
    ),
  );
  assert.equal(r.pass, false);
  assert.ok(r.rows.every((row) => row.pixel === 0));
  assert.ok(
    r.rows.some((row) => row.diffs.some((d) => d.key === 'margin-top')),
  );
  assert.ok(r.rows.some((row) => row.diffs.some((d) => d.key === 'box.y')));
});

test('버튼 스타일은 그대로인데 부모가 자리를 옮기면 위치로 잡는다', async () => {
  const r = compareRuns(
    await run(SAME),
    await run(
      html(`${CSS} form{padding-left:12px}`, '<button>지원하기</button>'),
    ),
  );
  assert.equal(r.pass, false);
  assert.deepEqual(
    [...new Set(r.rows.flatMap((row) => row.diffs.map((d) => d.key)))],
    ['box.x'],
  );
});

test('한쪽에만 있는 폭은 실패', async () => {
  const m = (await run(SAME))[1440];
  const r = compareRuns({ 1440: m }, { 1440: m, 375: m });
  assert.equal(r.pass, false);
  assert.ok(
    r.rows.some(
      (row) =>
        row.width === '375' && row.diffs.some((d) => d.key === 'width-missing'),
    ),
  );
});
