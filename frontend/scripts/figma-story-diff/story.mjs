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
  if (!m || (m[4] !== undefined && parseFloat(m[4]) === 0)) return null;
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
          borderColor:
            parseFloat(cs.borderTopWidth) > 0 ? cs.borderTopColor : null,
          fill: node instanceof SVGElement ? cs.fill : null,
          stroke: node instanceof SVGElement ? cs.stroke : null,
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
        s.borderColor,
        s.fill,
        s.stroke,
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
