// styled-components 템플릿을 펼친 CSS 텍스트를 선언·중첩 블록으로 나누고 버튼 시그니처를 만든다.
import { createHash } from 'node:crypto';

// 정적으로 값을 알 수 없는 보간 자리. extract.mjs가 넣는다.
export const DYNAMIC = '__DYNAMIC__';

// 묶음 판정에 쓰는 속성. margin·width 같은 레이아웃은 자리마다 달라도 같은 버튼이라 뺀다.
export const SIGNATURE_PROPS = [
  'height',
  'min-height',
  'padding',
  'border-radius',
  'background-color',
  'color',
  'font-size',
  'font-weight',
  'line-height',
  'border',
];

// 이전한 자리의 styled(Button)에 허용하는 속성 (스펙 6절)
export const LAYOUT_PROPS = new Set([
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'flex',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'align-self',
  'width',
  'order',
]);

// 줄 시작·공백·`;{}` 뒤의 //만 주석이다. `https://`, `url("//cdn…")`, `content: "a//b"`의 //는
// 남긴다. 문자열 안이라도 앞이 공백이면(`"a // b"`) 주석으로 보고, 반대로 `color:#fff//주석`처럼
// 앞에 공백·`;{}`가 없는 주석은 지우지 못한다 — 문자열을 해석하지 않는 한계.
const stripComments = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;{}])\/\/[^\n]*/g, '$1');

export function parseCss(css) {
  const text = stripComments(css);
  const root = { decls: {}, blocks: {}, mixins: [] };
  let i = 0;
  const flush = (target, raw) => {
    const s = raw.trim();
    if (!s) return;
    if (s === DYNAMIC) {
      root.mixins.push(s);
      return;
    }
    const idx = s.indexOf(':');
    if (idx === -1) return;
    target[s.slice(0, idx).trim().toLowerCase()] = s
      .slice(idx + 1)
      .trim()
      .replace(/\s+/g, ' ');
  };
  const parseBlock = (target, prefix) => {
    let buf = '';
    while (i < text.length) {
      const ch = text[i++];
      if (ch === '{') {
        const selector = buf.trim().replace(/\s+/g, ' ');
        buf = '';
        const full = prefix ? `${prefix} ${selector}` : selector;
        root.blocks[full] ??= {};
        parseBlock(root.blocks[full], full);
      } else if (ch === '}') {
        flush(target, buf);
        return;
      } else if (ch === ';') {
        flush(target, buf);
        buf = '';
      } else {
        buf += ch;
      }
    }
    flush(target, buf);
  };
  parseBlock(root.decls, '');
  return root;
}

const COLOR_NAMES = { white: '#FFFFFF', black: '#000000' };

const normToken = (t) => {
  if (/^0(px|rem|em|%)?$/.test(t)) return '0';
  if (/^#[0-9a-f]{3}$/i.test(t))
    return `#${[...t.slice(1)].map((c) => c + c).join('')}`.toUpperCase();
  if (/^#[0-9a-f]{6}$/i.test(t)) return t.toUpperCase();
  return COLOR_NAMES[t.toLowerCase()] ?? t;
};

const normValue = (v) => v.split(' ').map(normToken).join(' ');

const SIDES = ['top', 'right', 'bottom', 'left'];

const expandBox = (v) => {
  const [t, r = t, b = t, l = r] = v.split(' ');
  return [t, r, b, l];
};

export function signatureProps(decls) {
  const d = Object.fromEntries(
    Object.entries(decls).map(([k, v]) => [k, normValue(v)]),
  );
  let pad = d.padding ? expandBox(d.padding) : null;
  SIDES.forEach((side, idx) => {
    const v = d[`padding-${side}`];
    if (!v) return;
    pad ??= ['0', '0', '0', '0'];
    pad[idx] = v;
  });
  const values = {
    height: d.height,
    'min-height': d['min-height'],
    padding: pad?.join(' '),
    'border-radius': d['border-radius'],
    'background-color': d['background-color'] ?? d.background,
    color: d.color,
    'font-size': d['font-size'],
    'font-weight': d['font-weight'],
    'line-height': d['line-height'],
    border: d.border === '0' ? 'none' : d.border,
  };
  return Object.fromEntries(
    SIGNATURE_PROPS.filter((k) => values[k] !== undefined).map((k) => [
      k,
      values[k],
    ]),
  );
}

export function buttonSignature(parsed) {
  const base = signatureProps(parsed.decls);
  const nested = Object.fromEntries(
    Object.entries(parsed.blocks)
      .map(([selector, decls]) => [selector, signatureProps(decls)])
      .filter(([, props]) => Object.keys(props).length > 0)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  const dynamicIn = (props, prefix = '') =>
    Object.entries(props)
      .filter(([, v]) => v.includes(DYNAMIC))
      .map(([k]) => `${prefix}${k}`);
  const dynamic = [
    ...dynamicIn(base),
    ...Object.entries(nested).flatMap(([sel, props]) =>
      dynamicIn(props, `${sel} `),
    ),
    ...(parsed.mixins.length ? ['mixin'] : []),
  ];
  // hover·반응형이 다르면 같은 variant가 될 수 없어 키에 함께 넣는다 (스펙 5.2)
  const key = createHash('sha1')
    .update(JSON.stringify([base, nested]))
    .digest('hex')
    .slice(0, 8);
  return { base, nested, dynamic, key };
}

export const overridesAppearance = (parsed) =>
  Object.keys(parsed.decls).some((k) => !LAYOUT_PROPS.has(k)) ||
  Object.keys(parsed.blocks).length > 0 ||
  parsed.mixins.length > 0;
