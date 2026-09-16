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

const rgbToHex = (rgb) => {
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  // 반투명은 겹쳐 쓰는 값이라 토큰이 아니다. Figma 쪽 opacity 처리와 같은 기준으로 뺀다.
  if (!m || (m[4] !== undefined && parseFloat(m[4]) < 1)) return null;
  return (
    '#' +
    [m[1], m[2], m[3]]
      .map((n) => Number(n).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
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
      return { bbox: { width: rect.width, height: rect.height }, styles };
    });
    const colors = new Map();
    const typography = new Map();
    for (const s of dom.styles) {
      for (const c of [
        s.text ? s.color : null,
        s.backgroundColor,
        ...s.borderColors,
        ...s.paints,
      ]) {
        const hex = c && rgbToHex(c);
        if (hex && !colors.has(hex)) colors.set(hex, s.tag);
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
    return { url, png, bbox: dom.bbox, colors, typography };
  } finally {
    await browser.close();
  }
}
