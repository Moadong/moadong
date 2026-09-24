// Storybook iframe을 Figma 프레임 크기·2배 스케일로 캡처하고 DOM computed style에서 색/타이포를 뽑는다.
import { chromium } from 'playwright';
import { typoKey } from './theme.mjs';

const BASE = process.env.STORYBOOK_URL ?? 'http://localhost:6006';

// Storybook URL args 문법: 불리언은 !true/!false, 나머지는 문자열 그대로.
function encodeArgs(args = {}) {
  return Object.entries(args)
    .map(([k, v]) => {
      if (typeof v === 'object')
        throw new Error(
          `args.${k}: 객체/배열 args는 스토리 export로 고정할 것`,
        );
      return `${k}:${typeof v === 'boolean' ? `!${v}` : String(v)}`;
    })
    .join(';');
}

// 반투명은 겹쳐 쓰는 값이라 토큰이 아니다. Figma 쪽 opacity 처리와 같은 기준으로 판정에서
// 빼되 버리지는 않는다 - 시안이 불투명인데 구현만 반투명이면 구현 쪽 집합이 비어 보여서
// 리포트만으로는 "구현에 없는 색"인지 "반투명이라 안 세어진 것"인지 구분할 수 없다.
// alpha 0은 기본 transparent라 실제로 칠해지지 않으므로 뺀다.
// 반올림하면 0.801과 0.804가 같은 키로 합쳐지고, 0.004가 0%로 표시돼 alpha 0을
// 제외한다는 규칙과 리포트가 모순된다. 그렇다고 반올림을 빼면 0.801이
// 80.10000000000001%로 나온다. 한 자리까지만 남기고 뒤의 0은 떼어 낸다.
const alphaPercent = (alpha) => +(alpha * 100).toFixed(1);

const parseColor = (rgb) => {
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!m) return null;
  const alpha = m[4] === undefined ? 1 : parseFloat(m[4]);
  if (alpha === 0) return null;
  const hex =
    '#' +
    [m[1], m[2], m[3]]
      .map((n) => Number(n).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  return { hex, alpha };
};

export async function captureStory({ story, args, viewport, scale = 2 }) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: scale });
  const url = `${BASE}/iframe.html?id=${story}&viewMode=story&args=${encodeURIComponent(encodeArgs(args))}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const root = page.locator('#storybook-root');
    await root.waitFor();
    await page.evaluate(() => document.fonts.ready);
    const target = root.locator('> *').first();
    const png = await target.screenshot();
    const dom = await target.evaluate((el) => {
      // svg·g 같은 래퍼는 paint를 그리지 않는데 fill이 상속되고 초기값이 검정이라, 걷으면 #000000이 딸려 온다.
      const PAINTED_SVG = new Set([
        'path',
        'rect',
        'circle',
        'ellipse',
        'line',
        'polyline',
        'polygon',
        'text',
        'tspan',
        'textpath',
        'use',
      ]);
      const SIDES = ['Top', 'Right', 'Bottom', 'Left'];
      const rect = el.getBoundingClientRect();
      const styles = [];
      for (const node of [el, ...el.querySelectorAll('*')]) {
        // 접힌 목록처럼 화면에 없는 요소는 시안과 대조할 대상이 아니다.
        if (
          !node.checkVisibility() ||
          node.getBoundingClientRect().height === 0
        )
          continue;
        const cs = getComputedStyle(node);
        const tag =
          node.tagName.toLowerCase() +
          (node.className && typeof node.className === 'string'
            ? `.${node.className.split(' ')[0]}`
            : '');
        styles.push({
          tag,
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderColors: SIDES.filter(
            (side) => parseFloat(cs[`border${side}Width`]) > 0,
          ).map((side) => cs[`border${side}Color`]),
          paints: PAINTED_SVG.has(node.tagName.toLowerCase())
            ? [cs.fill, cs.stroke]
            : [],
          // Figma의 INSIDE stroke는 레이아웃에 안 더해져서 구현이 inset 그림자로 그리기도 한다.
          // 그러면 border-color에 안 잡히므로 여기서 같이 걷는다.
          boxShadow: cs.boxShadow === 'none' ? null : cs.boxShadow,
          text:
            node.childNodes.length &&
            [...node.childNodes].some(
              (n) => n.nodeType === 3 && n.textContent.trim(),
            )
              ? {
                  fontSize: cs.fontSize,
                  fontWeight: cs.fontWeight,
                  lineHeight: cs.lineHeight,
                }
              : null,
        });
      }
      // 스토리 데코레이터 래퍼는 자식과 박스가 똑같다. 시안 프레임에 대응하는 건 그 안쪽이라 내려간다.
      let layoutRoot = el;
      while (layoutRoot.children.length === 1) {
        const child = layoutRoot.children[0];
        const a = layoutRoot.getBoundingClientRect();
        const b = child.getBoundingClientRect();
        if (
          a.x !== b.x ||
          a.y !== b.y ||
          a.width !== b.width ||
          a.height !== b.height
        )
          break;
        layoutRoot = child;
      }
      const lr = layoutRoot.getBoundingClientRect();
      const layout = {
        box: { width: lr.width, height: lr.height },
        children: [...layoutRoot.children]
          .filter(
            (c) => c.checkVisibility() && c.getBoundingClientRect().height > 0,
          )
          .map((c) => {
            const r = c.getBoundingClientRect();
            return {
              name: c.tagName.toLowerCase(),
              x: r.x - lr.x,
              y: r.y - lr.y,
              width: r.width,
              height: r.height,
            };
          }),
      };
      return {
        bbox: { width: rect.width, height: rect.height },
        styles,
        layout,
      };
    });
    const colors = new Map();
    const typography = new Map();
    const translucent = new Map();
    for (const s of dom.styles) {
      for (const c of [
        s.text ? s.color : null,
        s.backgroundColor,
        ...s.borderColors,
        ...s.paints,
        ...(s.boxShadow?.match(/rgba?\([^)]*\)/g) ?? []),
      ]) {
        const parsed = c && parseColor(c);
        if (!parsed) continue;
        if (parsed.alpha < 1) {
          const key = `${parsed.hex}@${alphaPercent(parsed.alpha)}%`;
          if (!translucent.has(key)) translucent.set(key, s.tag);
        } else if (!colors.has(parsed.hex)) {
          colors.set(parsed.hex, s.tag);
        }
      }
      if (s.text) {
        const size = parseFloat(s.text.fontSize);
        const lh =
          s.text.lineHeight === 'normal'
            ? null
            : `${(parseFloat(s.text.lineHeight) / size) * 100}%`;
        const key = typoKey({
          size,
          weight: Number(s.text.fontWeight),
          lineHeight: lh,
        });
        if (!typography.has(key)) typography.set(key, s.tag);
      }
    }
    return {
      url,
      png,
      bbox: dom.bbox,
      layout: dom.layout,
      colors,
      typography,
      translucent,
    };
  } finally {
    await browser.close();
  }
}
