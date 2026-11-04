# 버튼 이전 도구 (PR 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 버튼 153개를 인벤토리하고, 시안과 대조하고, 이전 전후 렌더 결과를 비교하는 도구 4단계를 만들고 기준선을 고정한다. 제품 코드(`src/`)는 바꾸지 않는다.

**Architecture:** `frontend/scripts/button-migration/`에 Node ESM 스크립트를 둔다. 순수 로직(CSS 파싱·시그니처·추출·대장·비교·시안 판정)과 부수효과(브라우저·Vite·git worktree·Figma REST)를 파일 단위로 나눠, 순수 로직은 `node:test` 단위 테스트로, 브라우저 측정은 `page.setContent` 통합 테스트로 검증한다. 모든 단계는 자리 대장 `sites.json` 하나에 상태를 쌓는다. 기존 `figma-story-diff`의 `theme.mjs`·`figma.mjs`·`story.mjs`·`diff.mjs`는 export만 늘려 재사용한다.

**Tech Stack:** Node 20.19+/22.12 ESM, `node:test`, TypeScript 컴파일러 API(`typescript`), Playwright(chromium), esbuild, pixelmatch/pngjs, dotenv-cli. 새 의존성 없음.

**Spec:** `docs/superpowers/specs/2026-10-06-button-design-system-design.md`

**범위:** 스펙 8절의 PR 1만이다. PR 2(Button API)와 PR 3~(묶음별 이전)은 이 계획으로 만든 기준선 리포트를 보고 따로 계획을 쓴다. 스펙 6절의 축 결정 규칙이 인벤토리 결과에 달려 있어서 지금 쓸 수 없다.

## Global Constraints

- `src/` 아래 제품 코드는 바꾸지 않는다. 바뀌는 것은 `frontend/scripts/`, `frontend/jest.config.js`, `frontend/package.json`(scripts만), 문서뿐이다.
- 새 npm 의존성을 추가하지 않는다. 쓰는 것은 이미 있는 `typescript`, `playwright`, `esbuild`, `pixelmatch`, `pngjs`, `dotenv-cli`다.
- Node 20.19(로컬)와 22.12(`.nvmrc`) 둘 다에서 돈다. `node:test`, `node:util` `parseArgs`, `import.meta.dirname`(20.11+)까지만 쓴다.
- `figma-story-diff`의 동작은 바뀌면 안 된다. export를 늘리고 함수를 꺼내는 리팩터만 허용한다.
- 테스트 계정은 `frontend/.env`의 `DEV_ADMIN_ID`·`DEV_ADMIN_PASSWORD`에만 있다. 커밋하는 파일, 리포트, 콘솔 출력에 값을 쓰지 않는다.
- `frontend/visual-diff/` 산출물은 커밋하지 않는다(gitignore). `sites.json`과 `smoke-targets.json`은 커밋한다.
- 코드 스타일: 작은따옴표, 세미콜론, 주석은 한국어로 "왜"만 짧게(`figma-story-diff`와 같은 밀도).
- 커밋은 사용자가 요청할 때만 한다. 메시지는 `feat:`·`test:`·`refactor:`·`docs:` + 한국어 설명이고, Co-Authored-By나 Generated 트레일러를 넣지 않는다.
- PR 전에 이슈와 Jira를 먼저 만들고 `feature/#번호-slug-MOA-키` 브랜치에서 올린다. base는 `develop-fe`, 본문은 짧은 산문이다.

## Review Focus

- 양쪽 모두 모든 폭에서 요소를 못 찾을 때(locator 오타, 라벨 변경): "차이 없음"으로 PASS가 나면 안 되고 FAIL이어야 한다 → Task 5 테스트 `양쪽 다 어디서도 안 보이면 실패`
- 시안 대조가 끝난 자리의 스타일을 누가 고친 뒤 인벤토리를 다시 돌릴 때: 예전 `figma-match` 판정이 남으면 안 되고 `inventoried`로 돌아가야 한다 → Task 3 테스트 `시그니처가 바뀌면 판정을 되돌린다`
- `.tsx` 안에서 정의하고 같은 파일에서 쓰는 `styled.button`(예: `AddItemButton.tsx`): 사용처를 놓치면 자리 수가 줄어든다 → Task 2 테스트 `같은 파일 안의 정의와 사용처를 잇는다`
- `url(https://…)`처럼 값 안에 `//`가 있는 선언: 주석으로 잘려 시그니처가 깨지면 안 된다 → Task 1 테스트 `url 안의 //는 주석이 아니다`
- `/admin/login` 자리: 로그인한 세션으로 열면 `/admin`으로 튕겨 요소가 사라진다. 로그인 없이 열어야 한다 → Task 6 테스트 `로그인 화면은 비로그인 세션으로 연다`

---

## 파일 구조

| 파일 | 책임 |
|---|---|
| `scripts/button-migration/signature.mjs` | CSS 텍스트를 선언·중첩 블록으로 파싱하고 시그니처·묶음 키를 만든다 (순수) |
| `scripts/button-migration/extract.mjs` | TS AST에서 `styled.button`·`styled(Button)` 정의와 JSX 사용처를 뽑는다 (순수) |
| `scripts/button-migration/sites.mjs` | 자리 대장: 도메인 판정, 자리 생성, 재인벤토리 병합, 묶음, 지표, 읽기·쓰기 |
| `scripts/button-migration/inventory.mjs` | 단계 ① CLI: `src` 전체를 돌아 `sites.json`과 리포트를 만든다 |
| `scripts/button-migration/measure.mjs` | 브라우저에서 요소의 computed style·DOM·스크린샷을 잰다 |
| `scripts/button-migration/compare.mjs` | before/after 측정 비교와 판정 (순수 + pixelmatch) |
| `scripts/button-migration/app.mjs` | Vite 띄우기, 기준 커밋 worktree, 관리자 로그인, 로그인 필요 판정 |
| `scripts/button-migration/before-after.mjs` | 단계 ④ CLI |
| `scripts/button-migration/figma-gate.mjs` | 단계 ② 판정 (순수) |
| `scripts/button-migration/figma-search.mjs` | "✳️ 페이지 최종"에서 라벨로 노드 후보를 찾는다 |
| `scripts/button-migration/figma-candidates.mjs` | 단계 ② 보조 CLI |
| `scripts/button-migration/figma-match.mjs` | 단계 ② CLI |
| `scripts/button-migration/sites.json` | 자리 대장 (생성물, 커밋) |
| `scripts/button-migration/smoke-targets.json` | 판정기 안정성 확인용 고정 대상 (커밋) |
| `scripts/button-migration/fixtures/*.txt` | 추출 테스트용 소스 (확장자 `.txt`라 tsc·eslint 대상 아님) |
| `scripts/button-migration/CLAUDE.md` | 스크립트를 고칠 때 알아야 할 것 |
| `scripts/figma-story-diff/theme.mjs` | `importTs` export 추가 |
| `scripts/figma-story-diff/figma.mjs` | `api` export 추가 |
| `scripts/figma-story-diff/story.mjs` | 요소 측정부를 `collectElement`로 꺼낸다 |

---

### Task 1: 시그니처 (CSS 파싱·정규화·묶음 키)

**Files:**
- Create: `frontend/scripts/button-migration/signature.mjs`
- Create: `frontend/scripts/button-migration/signature.test.mjs`
- Modify: `frontend/jest.config.js` (testPathIgnorePatterns 추가)
- Modify: `frontend/package.json` (`test:scripts` 스크립트)

**Interfaces:**
- Consumes: 없음
- Produces:
  - `DYNAMIC: '__DYNAMIC__'` — 정적으로 못 푼 보간 자리 표시
  - `SIGNATURE_PROPS: string[]`, `LAYOUT_PROPS: Set<string>`
  - `parseCss(css: string) → { decls: Record<string,string>, blocks: Record<selector, Record<string,string>>, mixins: string[] }`
  - `signatureProps(decls) → Record<string,string>` (SIGNATURE_PROPS 키만, 정규화)
  - `buttonSignature(parsed) → { base, nested: Record<selector, props>, dynamic: string[], key: string(8자 hex) }`
  - `overridesAppearance(parsed) → boolean`

- [ ] **Step 1: jest가 node:test 파일을 집어 가지 않게 막는다**

jest 29 기본 testMatch는 `*.test.mjs`도 잡는데 ts-jest가 ESM `.mjs`를 못 읽어 `npm test`가 깨진다. `frontend/jest.config.js`의 `moduleNameMapper` 블록 바로 아래에 추가:

```js
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/scripts/button-migration/'],
```

`frontend/package.json`의 `"scripts"`에 추가(`"test": "jest",` 다음 줄):

```json
    "test:scripts": "node --test scripts/button-migration/*.test.mjs",
```

- [ ] **Step 2: 실패하는 테스트 작성**

`frontend/scripts/button-migration/signature.test.mjs`:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DYNAMIC,
  buttonSignature,
  overridesAppearance,
  parseCss,
} from './signature.mjs';

test('선언과 중첩 블록을 나눈다', () => {
  const parsed = parseCss(`
    padding: 12px 16px;
    /* 주석 */
    &:hover { background: #000; }
    @media (max-width: 500px) { padding: 8px; }
  `);
  assert.deepEqual(parsed.decls, { padding: '12px 16px' });
  assert.deepEqual(parsed.blocks['&:hover'], { background: '#000' });
  assert.deepEqual(parsed.blocks['@media (max-width: 500px)'], {
    padding: '8px',
  });
});

test('url 안의 //는 주석이 아니다', () => {
  const parsed = parseCss(
    'background-image: url(https://a.com/x.png); color: #fff; // 끝 주석',
  );
  assert.equal(parsed.decls['background-image'], 'url(https://a.com/x.png)');
  assert.equal(parsed.decls.color, '#fff');
});

test('축약·색·0 표기가 달라도 같은 시그니처', () => {
  const a = buttonSignature(
    parseCss('padding: 8px 12px; background: #fff; border: 0; color: #111111;'),
  );
  const b = buttonSignature(
    parseCss(
      'color: #111111; background-color: #FFFFFF; padding: 8px 12px 8px 12px; border: 0px;',
    ),
  );
  assert.equal(a.key, b.key);
  assert.deepEqual(a.base, {
    padding: '8px 12px 8px 12px',
    'background-color': '#FFFFFF',
    color: '#111111',
    border: 'none',
  });
});

test('margin·width는 시그니처에 안 들어간다', () => {
  const a = buttonSignature(parseCss('height: 40px; margin: 0 auto; width: 100%;'));
  const b = buttonSignature(parseCss('height: 40px;'));
  assert.equal(a.key, b.key);
});

test('hover가 다르면 다른 묶음', () => {
  const a = buttonSignature(parseCss('height: 40px; &:hover { background: #000; }'));
  const b = buttonSignature(parseCss('height: 40px; &:hover { background: #111; }'));
  assert.notEqual(a.key, b.key);
});

test('동적 값과 동적 믹스인을 표시한다', () => {
  const sig = buttonSignature(
    parseCss(
      `color: ${DYNAMIC}; ${DYNAMIC}; &:hover { background: ${DYNAMIC}; }`,
    ),
  );
  assert.deepEqual(sig.dynamic, ['color', '&:hover background-color', 'mixin']);
});

test('레이아웃만 바꾸는 styled(Button)은 겉모습 덮어쓰기가 아니다', () => {
  assert.equal(overridesAppearance(parseCss('margin-top: 8px; width: 100%;')), false);
  assert.equal(
    overridesAppearance(parseCss('margin-top: 8px; background: #000;')),
    true,
  );
  assert.equal(overridesAppearance(parseCss('&:hover { opacity: 0.8; }')), true);
});
```

- [ ] **Step 3: 실패 확인**

Run: `cd frontend && npm run test:scripts`
Expected: FAIL — `Cannot find module '.../signature.mjs'`

- [ ] **Step 4: 구현**

`frontend/scripts/button-migration/signature.mjs`:

```js
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

// `https://`의 //는 남긴다. 앞 글자가 `:`면 주석이 아니다.
const stripComments = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

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
```

- [ ] **Step 5: 통과 확인**

Run: `cd frontend && npm run test:scripts`
Expected: PASS 7개

Run: `cd frontend && npx jest --listTests | grep -c button-migration`
Expected: `0`

- [ ] **Step 6: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/signature.mjs frontend/scripts/button-migration/signature.test.mjs frontend/jest.config.js frontend/package.json
git commit -m "feat: 버튼 스타일을 정규화한 시그니처로 묶는다"
```

---

### Task 2: 정의·사용처 추출 (TS AST)

**Files:**
- Create: `frontend/scripts/button-migration/extract.mjs`
- Create: `frontend/scripts/button-migration/extract.test.mjs`
- Create: `frontend/scripts/button-migration/fixtures/A.styles.ts.txt`
- Create: `frontend/scripts/button-migration/fixtures/A.tsx.txt`

**Interfaces:**
- Consumes: `DYNAMIC`, `parseCss`, `buttonSignature`, `overridesAppearance` (Task 1)
- Produces:
  - `COMMON_BUTTON = 'src/components/common/Button/Button.tsx'`
  - `analyzeFile({ file: string(frontend 기준 상대경로), text: string, values: { theme, media }, resolveModule: (fromFile, spec) => string|null }) → { definitions: Definition[], usages: Usage[], commonButtonUsages: number }`
  - `Definition = { file, name, kind: 'styled.button'|'styled(Button)', line, base, nested, dynamic, key, overridesAppearance }`
  - `Usage = { defFile, name, usageFile, line, typeAttr: string|null, label: string|null }` — `typeAttr`은 속성이 없으면 `null`, 리터럴이 아니면 `'{expr}'`

- [ ] **Step 1: 픽스처 작성**

`frontend/scripts/button-migration/fixtures/A.styles.ts.txt`:

```ts
import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Primary = styled.button`
  background: ${colors.gray[900]};
  color: ${({ theme }) => theme.colors.base.white};
  ${setTypography(typography.paragraph.p2)};
  padding: 0 16px;

  ${media.mobile} {
    padding: 0 8px;
  }
`;

export const Toggle = styled.button<{ $active: boolean }>`
  height: 32px;
  color: ${({ $active }) => ($active ? colors.gray[900] : colors.base.white)};
`;

export const Submit = styled.button.attrs({ type: 'submit' })`
  height: 40px;
`;

export const Wide = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;

export const Dark = styled(Button)`
  background: ${colors.gray[900]};
`;

export const Box = styled.div`
  height: 10px;
`;
```

`frontend/scripts/button-migration/fixtures/A.tsx.txt`:

```tsx
import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import * as Styled from './A.styles';

const Inline = styled.button`
  height: 24px;
`;

const A = ({ label }: { label: string }) => (
  <form>
    <Styled.Primary>지원하기</Styled.Primary>
    <Styled.Primary type='button'>지원하기</Styled.Primary>
    <Styled.Toggle $active type={label}>{label}</Styled.Toggle>
    <Styled.Box />
    <Inline>닫기</Inline>
    <Button>저장</Button>
    <div>무시</div>
  </form>
);

export default A;
```

- [ ] **Step 2: 실패하는 테스트 작성**

`frontend/scripts/button-migration/extract.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { analyzeFile } from './extract.mjs';

const values = {
  theme: {
    colors: { gray: { 900: '#3A3A3A' }, base: { white: '#FFFFFF' } },
    typography: {
      paragraph: { p2: { size: '16px', weight: 600, lineHeight: '140%' } },
    },
    transitions: {},
  },
  media: { mobile: '@media (max-width: 500px)' },
};

const resolveModule = (_from, spec) =>
  ({
    './A.styles': 'src/pages/X/A.styles.ts',
    '@/components/common/Button/Button': 'src/components/common/Button/Button.tsx',
    '@/styles/theme/colors': 'src/styles/theme/colors.ts',
    '@/styles/mediaQuery': 'src/styles/mediaQuery.ts',
    '@/styles/theme/typography': 'src/styles/theme/typography.ts',
  })[spec] ?? null;

const fixture = (name) =>
  readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

const styles = analyzeFile({
  file: 'src/pages/X/A.styles.ts',
  text: fixture('A.styles.ts.txt'),
  values,
  resolveModule,
});
const view = analyzeFile({
  file: 'src/pages/X/A.tsx',
  text: fixture('A.tsx.txt'),
  values,
  resolveModule,
});
const def = (name) => styles.definitions.find((d) => d.name === name);

test('버튼 정의만 뽑는다', () => {
  assert.deepEqual(
    styles.definitions.map((d) => [d.name, d.kind]),
    [
      ['Primary', 'styled.button'],
      ['Toggle', 'styled.button'],
      ['Submit', 'styled.button'],
      ['Wide', 'styled(Button)'],
      ['Dark', 'styled(Button)'],
    ],
  );
});

test('테마 참조·setTypography·media를 값으로 푼다', () => {
  const p = def('Primary');
  assert.deepEqual(p.base, {
    padding: '0 16px 0 16px',
    'background-color': '#3A3A3A',
    color: '#FFFFFF',
    'font-size': '16px',
    'font-weight': '600',
    'line-height': '140%',
  });
  assert.deepEqual(p.nested, {
    '@media (max-width: 500px)': { padding: '0 8px 0 8px' },
  });
  assert.deepEqual(p.dynamic, []);
});

test('props에 따라 바뀌는 값은 동적으로 표시한다', () => {
  assert.deepEqual(def('Toggle').dynamic, ['color']);
});

test('attrs를 붙인 styled.button도 정의다', () => {
  assert.deepEqual(def('Submit').base, { height: '40px' });
});

test('styled(Button)의 겉모습 덮어쓰기를 구분한다', () => {
  assert.equal(def('Wide').overridesAppearance, false);
  assert.equal(def('Dark').overridesAppearance, true);
});

test('네임스페이스 import 사용처와 라벨·type을 뽑는다', () => {
  const primary = view.usages.filter((u) => u.name === 'Primary');
  assert.deepEqual(
    primary.map((u) => [u.defFile, u.label, u.typeAttr]),
    [
      ['src/pages/X/A.styles.ts', '지원하기', null],
      ['src/pages/X/A.styles.ts', '지원하기', 'button'],
    ],
  );
  const toggle = view.usages.find((u) => u.name === 'Toggle');
  assert.equal(toggle.label, null);
  assert.equal(toggle.typeAttr, '{expr}');
});

test('같은 파일 안의 정의와 사용처를 잇는다', () => {
  assert.deepEqual(
    view.definitions.map((d) => d.name),
    ['Inline'],
  );
  const inline = view.usages.find((u) => u.name === 'Inline');
  assert.equal(inline.defFile, 'src/pages/X/A.tsx');
  assert.equal(inline.label, '닫기');
});

test('공용 Button JSX는 따로 센다', () => {
  assert.equal(view.commonButtonUsages, 1);
  assert.equal(
    view.usages.some((u) => u.name === 'Button'),
    false,
  );
});
```

- [ ] **Step 3: 실패 확인**

Run: `cd frontend && npm run test:scripts`
Expected: FAIL — `Cannot find module '.../extract.mjs'`

- [ ] **Step 4: 구현**

`frontend/scripts/button-migration/extract.mjs`:

```js
// TS 소스에서 styled.button·styled(Button) 정의와 그 JSX 사용처를 뽑는다.
import ts from 'typescript';
import {
  DYNAMIC,
  buttonSignature,
  overridesAppearance,
  parseCss,
} from './signature.mjs';

export const COMMON_BUTTON = 'src/components/common/Button/Button.tsx';
const COMMON = Symbol('common-button');

// colors.gray[900] → ['colors', 'gray', '900']. 다른 모양이면 null.
function pathOf(expr) {
  if (ts.isIdentifier(expr)) return [expr.text];
  if (ts.isPropertyAccessExpression(expr)) {
    const p = pathOf(expr.expression);
    return p && [...p, expr.name.text];
  }
  if (
    ts.isElementAccessExpression(expr) &&
    (ts.isNumericLiteral(expr.argumentExpression) ||
      ts.isStringLiteral(expr.argumentExpression))
  ) {
    const p = pathOf(expr.expression);
    return p && [...p, expr.argumentExpression.text];
  }
  return null;
}

function lookup(expr, values, themeInScope) {
  const p = pathOf(expr);
  if (!p) return undefined;
  const roots = {
    colors: values.theme.colors,
    typography: values.theme.typography,
    transitions: values.theme.transitions,
    media: values.media,
    ...(themeInScope ? { theme: values.theme } : {}),
  };
  let cur = roots[p[0]];
  for (const seg of p.slice(1)) {
    if (cur == null) return undefined;
    cur = cur[seg];
  }
  return cur;
}

// 풀면 CSS 문자열, 못 풀면 null
function resolveExpr(expr, values, themeInScope = false) {
  if (
    ts.isStringLiteral(expr) ||
    ts.isNoSubstitutionTemplateLiteral(expr) ||
    ts.isNumericLiteral(expr)
  )
    return expr.text;
  if (ts.isParenthesizedExpression(expr))
    return resolveExpr(expr.expression, values, themeInScope);
  if (
    ts.isCallExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === 'setTypography' &&
    expr.arguments.length === 1
  ) {
    const t = lookup(expr.arguments[0], values, themeInScope);
    return t && typeof t === 'object' && 'size' in t
      ? `font-size: ${t.size}; font-weight: ${t.weight}; line-height: ${t.lineHeight}`
      : null;
  }
  // ({ theme }) => theme.colors.x 만 푼다. 다른 props를 받으면 자리마다 값이 달라진다.
  if (
    ts.isArrowFunction(expr) &&
    expr.parameters.length === 1 &&
    !ts.isBlock(expr.body)
  ) {
    const param = expr.parameters[0].name;
    const onlyTheme =
      ts.isObjectBindingPattern(param) &&
      param.elements.length === 1 &&
      !param.elements[0].propertyName &&
      ts.isIdentifier(param.elements[0].name) &&
      param.elements[0].name.text === 'theme';
    return onlyTheme ? resolveExpr(expr.body, values, true) : null;
  }
  const v = lookup(expr, values, themeInScope);
  return typeof v === 'string' || typeof v === 'number' ? String(v) : null;
}

function expandTemplate(template, values) {
  if (ts.isNoSubstitutionTemplateLiteral(template)) return template.text;
  let css = template.head.text;
  for (const span of template.templateSpans) {
    const piece = resolveExpr(span.expression, values) ?? DYNAMIC;
    const before = css.trimEnd();
    // 문장 자리(`;`·`{`·`}` 뒤)의 믹스인은 `;`로 닫아야 다음 선언과 안 붙는다. `${media.x} {`는 예외.
    const statement = before === '' || /[;{}]$/.test(before);
    const opensBlock = span.literal.text.trimStart().startsWith('{');
    css += statement && !opensBlock ? `${piece};` : piece;
    css += span.literal.text;
  }
  return css;
}

function styledKind(tag, defaults) {
  let t = tag;
  if (
    ts.isCallExpression(t) &&
    ts.isPropertyAccessExpression(t.expression) &&
    t.expression.name.text === 'attrs'
  )
    t = t.expression.expression;
  if (
    ts.isPropertyAccessExpression(t) &&
    ts.isIdentifier(t.expression) &&
    t.expression.text === 'styled' &&
    t.name.text === 'button'
  )
    return 'styled.button';
  if (
    ts.isCallExpression(t) &&
    ts.isIdentifier(t.expression) &&
    t.expression.text === 'styled' &&
    t.arguments.length === 1 &&
    ts.isIdentifier(t.arguments[0]) &&
    defaults.get(t.arguments[0].text) === COMMON_BUTTON
  )
    return 'styled(Button)';
  return null;
}

function readImports(sf, file, resolveModule) {
  const namespaces = new Map();
  const named = new Map();
  const defaults = new Map();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !st.importClause) continue;
    const target = resolveModule(file, st.moduleSpecifier.text);
    if (!target) continue;
    const { name, namedBindings } = st.importClause;
    if (name) defaults.set(name.text, target);
    if (namedBindings && ts.isNamespaceImport(namedBindings))
      namespaces.set(namedBindings.name.text, target);
    if (namedBindings && ts.isNamedImports(namedBindings))
      for (const el of namedBindings.elements)
        named.set(el.name.text, {
          file: target,
          name: (el.propertyName ?? el.name).text,
        });
  }
  return { namespaces, named, defaults };
}

function tagTarget(tagName, imports, file) {
  if (
    ts.isPropertyAccessExpression(tagName) &&
    ts.isIdentifier(tagName.expression)
  ) {
    const ns = imports.namespaces.get(tagName.expression.text);
    return ns ? { file: ns, name: tagName.name.text } : null;
  }
  if (!ts.isIdentifier(tagName) || !/^[A-Z]/.test(tagName.text)) return null;
  const id = tagName.text;
  if (imports.defaults.get(id) === COMMON_BUTTON) return COMMON;
  return imports.named.get(id) ?? { file, name: id };
}

function attrLiteral(attributes, attrName) {
  for (const a of attributes.properties) {
    if (
      !ts.isJsxAttribute(a) ||
      !ts.isIdentifier(a.name) ||
      a.name.text !== attrName
    )
      continue;
    if (!a.initializer) return 'true';
    if (ts.isStringLiteral(a.initializer)) return a.initializer.text;
    if (
      ts.isJsxExpression(a.initializer) &&
      a.initializer.expression &&
      ts.isStringLiteral(a.initializer.expression)
    )
      return a.initializer.expression.text;
    return '{expr}';
  }
  return null;
}

// 자식이 글자뿐일 때만 라벨이다. 표현식이 섞이면 locator로 못 쓴다.
function labelOf(el) {
  const parts = [];
  for (const c of el.children) {
    if (ts.isJsxText(c)) {
      const t = c.text.trim();
      if (t) parts.push(t);
    } else if (
      ts.isJsxExpression(c) &&
      c.expression &&
      ts.isStringLiteral(c.expression)
    ) {
      parts.push(c.expression.text);
    } else {
      return null;
    }
  }
  return parts.length ? parts.join(' ') : null;
}

export function analyzeFile({ file, text, values, resolveModule }) {
  const sf = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const imports = readImports(sf, file, resolveModule);
  const lineOf = (node) =>
    sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const definitions = [];
  const usages = [];
  let commonButtonUsages = 0;

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isTaggedTemplateExpression(node.initializer)
    ) {
      const kind = styledKind(node.initializer.tag, imports.defaults);
      if (kind) {
        const parsed = parseCss(
          expandTemplate(node.initializer.template, values),
        );
        definitions.push({
          file,
          name: node.name.text,
          kind,
          line: lineOf(node),
          ...buttonSignature(parsed),
          overridesAppearance:
            kind === 'styled(Button)' && overridesAppearance(parsed),
        });
      }
    }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const target = tagTarget(opening.tagName, imports, file);
      if (target === COMMON) commonButtonUsages += 1;
      else if (target)
        usages.push({
          defFile: target.file,
          name: target.name,
          usageFile: file,
          line: lineOf(node),
          typeAttr: attrLiteral(opening.attributes, 'type'),
          label: ts.isJsxElement(node) ? labelOf(node) : null,
        });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return { definitions, usages, commonButtonUsages };
}
```

- [ ] **Step 5: 통과 확인**

Run: `cd frontend && npm run test:scripts`
Expected: PASS (Task 1의 7개 + 8개)

- [ ] **Step 6: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/extract.mjs frontend/scripts/button-migration/extract.test.mjs frontend/scripts/button-migration/fixtures
git commit -m "feat: TS 소스에서 버튼 정의와 사용처를 뽑는다"
```

---

### Task 3: 자리 대장

**Files:**
- Create: `frontend/scripts/button-migration/sites.mjs`
- Create: `frontend/scripts/button-migration/sites.test.mjs`

**Interfaces:**
- Consumes: `Definition`, `Usage` (Task 2)
- Produces:
  - `SITES_FILE: string` (절대경로 `.../button-migration/sites.json`)
  - `STATUSES: string[]`
  - `domainOf(file: string) → string`
  - `buildSites(definitions, usages) → Site[]`
  - `mergeSites(prev: Site[], next: Site[]) → Site[]`
  - `clusters(sites) → { key, signature, nested, dynamic, sites: Site[], domains: string[], candidate: boolean }[]` (자리 수 내림차순)
  - `summarize(sites, { commonButton: { files, jsx }, overrides }) → { sites, byStatus, signatures, candidateClusters, candidateSites, commonButton, overrides }`
  - `loadSites(file) → Site[]`, `saveSites(file, sites) → void`
  - `Site = { id, defFile, name, kind, usageFile, line, domain, signatureKey, signature, nested, dynamic, typeAttr, label, route, locator, figma, figmaViewport, status }`
  - `id` 형식: `${defFile}::${name}::${usageFile}::${n}` (n = 같은 파일 안 같은 정의의 몇 번째 사용인지, 0부터)

- [ ] **Step 1: 실패하는 테스트 작성**

`frontend/scripts/button-migration/sites.test.mjs`:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSites, clusters, domainOf, mergeSites } from './sites.mjs';

test('도메인은 페이지 단위, AdminPage만 탭 단위', () => {
  const cases = {
    'src/pages/ClubDetailPage/components/X/X.tsx': 'ClubDetailPage',
    'src/pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab.tsx':
      'AdminPage/tabs/RecruitEditTab',
    'src/pages/AdminPage/auth/LoginTab/LoginTab.tsx': 'AdminPage/auth',
    'src/pages/AdminPage/AdminPage.tsx': 'AdminPage',
    'src/components/common/Modal/Modal.tsx': 'common/Modal',
    'src/components/map/X/X.tsx': 'components/map',
  };
  for (const [file, domain] of Object.entries(cases))
    assert.equal(domainOf(file), domain, file);
});

const def = (name, key, extra = {}) => ({
  file: 'src/pages/A/A.styles.ts',
  name,
  kind: 'styled.button',
  line: 1,
  base: { height: '40px' },
  nested: {},
  dynamic: [],
  key,
  overridesAppearance: false,
  ...extra,
});
const use = (name, usageFile, label = '확인') => ({
  defFile: 'src/pages/A/A.styles.ts',
  name,
  usageFile,
  line: 3,
  typeAttr: null,
  label,
});

test('사용처마다 자리를 만들고 정의 없는 사용처는 버린다', () => {
  const sites = buildSites(
    [def('Ok', 'k1')],
    [
      use('Ok', 'src/pages/A/A.tsx'),
      use('Ok', 'src/pages/A/A.tsx', null),
      use('Container', 'src/pages/A/A.tsx'),
    ],
  );
  assert.deepEqual(
    sites.map((s) => [s.id, s.locator]),
    [
      [
        'src/pages/A/A.styles.ts::Ok::src/pages/A/A.tsx::0',
        { role: 'button', name: '확인' },
      ],
      ['src/pages/A/A.styles.ts::Ok::src/pages/A/A.tsx::1', null],
    ],
  );
  assert.equal(sites[0].status, 'inventoried');
});

test('다시 돌려도 사람이 채운 값과 판정을 보존한다', () => {
  const [fresh] = buildSites([def('Ok', 'k1')], [use('Ok', 'src/pages/A/A.tsx')]);
  const prev = [
    { ...fresh, route: '/a', figma: 'https://f', status: 'figma-match' },
  ];
  const [merged] = mergeSites(prev, [fresh]);
  assert.equal(merged.route, '/a');
  assert.equal(merged.figma, 'https://f');
  assert.equal(merged.status, 'figma-match');
});

test('시그니처가 바뀌면 판정을 되돌린다', () => {
  const [old] = buildSites([def('Ok', 'k1')], [use('Ok', 'src/pages/A/A.tsx')]);
  const [changed] = buildSites(
    [def('Ok', 'k2')],
    [use('Ok', 'src/pages/A/A.tsx')],
  );
  const [merged] = mergeSites(
    [{ ...old, route: '/a', status: 'figma-match' }],
    [changed],
  );
  assert.equal(merged.route, '/a');
  assert.equal(merged.status, 'inventoried');
});

test('이전이 끝나 사라진 자리는 남기고, 그냥 사라진 자리는 지운다', () => {
  const [a, b] = buildSites(
    [def('A', 'k1'), def('B', 'k1')],
    [use('A', 'src/pages/A/A.tsx'), use('B', 'src/pages/A/A.tsx')],
  );
  const merged = mergeSites([{ ...a, status: 'verified' }, b], []);
  assert.deepEqual(
    merged.map((s) => s.name),
    ['A'],
  );
});

test('후보 묶음은 도메인 2곳 이상이고 동적 값이 없어야 한다', () => {
  const sites = buildSites(
    [def('Ok', 'k1'), def('Dyn', 'k2', { dynamic: ['color'] })],
    [
      use('Ok', 'src/pages/A/A.tsx'),
      use('Ok', 'src/pages/B/B.tsx'),
      use('Dyn', 'src/pages/A/A.tsx'),
      use('Dyn', 'src/pages/B/B.tsx'),
    ],
  );
  const cs = clusters(sites);
  assert.deepEqual(
    cs.map((c) => [c.key, c.domains, c.candidate]),
    [
      ['k1', ['A', 'B'], true],
      ['k2', ['A', 'B'], false],
    ],
  );
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npm run test:scripts`
Expected: FAIL — `Cannot find module '.../sites.mjs'`

- [ ] **Step 3: 구현**

`frontend/scripts/button-migration/sites.mjs`:

```js
// 자리 대장(sites.json): 버튼이 쓰이는 자리 하나가 레코드 하나. 모든 단계가 여기에 상태를 쌓는다.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const SITES_FILE = path.join(import.meta.dirname, 'sites.json');

export const STATUSES = [
  'inventoried',
  'figma-match',
  'figma-violation',
  'no-design',
  'migrated',
  'verified',
  'deferred',
];

// styled.button이 사라져도 대장에서 지우면 안 되는 상태 (이전이 끝난 자리)
const DONE = new Set(['migrated', 'verified']);
// 사람이 채우거나 뒤 단계가 쓴 값. 인벤토리를 다시 돌려도 보존한다.
const CARRIED = ['route', 'locator', 'figma', 'figmaViewport', 'status'];

export function domainOf(file) {
  const p = file.split('/');
  if (p[1] === 'pages') {
    if (p[2] !== 'AdminPage' || p.length <= 4) return p[2];
    return p[3] === 'tabs' && p.length > 5
      ? `AdminPage/tabs/${p[4]}`
      : `AdminPage/${p[3]}`;
  }
  if (p[1] === 'components')
    return p[2] === 'common' ? `common/${p[3]}` : `components/${p[2]}`;
  return p.slice(1, -1).join('/') || p[0];
}

const byId = (a, b) => a.id.localeCompare(b.id);

export function buildSites(definitions, usages) {
  const defs = new Map(definitions.map((d) => [`${d.file}::${d.name}`, d]));
  const seen = new Map();
  const sites = [];
  for (const u of usages) {
    const def = defs.get(`${u.defFile}::${u.name}`);
    if (!def) continue;
    const base = `${u.defFile}::${u.name}::${u.usageFile}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    sites.push({
      id: `${base}::${n}`,
      defFile: u.defFile,
      name: u.name,
      kind: def.kind,
      usageFile: u.usageFile,
      line: u.line,
      domain: domainOf(u.usageFile),
      signatureKey: def.key,
      signature: def.base,
      nested: def.nested,
      dynamic: def.dynamic,
      typeAttr: u.typeAttr,
      label: u.label,
      route: null,
      locator: u.label ? { role: 'button', name: u.label } : null,
      figma: null,
      figmaViewport: null,
      status: 'inventoried',
    });
  }
  return sites.sort(byId);
}

export function mergeSites(prev, next) {
  const old = new Map(prev.map((s) => [s.id, s]));
  const merged = next.map((s) => {
    const o = old.get(s.id);
    if (!o) return s;
    const carried = Object.fromEntries(
      CARRIED.filter((k) => o[k] != null).map((k) => [k, o[k]]),
    );
    // 스타일이 바뀌었으면 예전 시안 판정은 더 이상 이 버튼에 대한 것이 아니다
    if (o.signatureKey !== s.signatureKey) delete carried.status;
    return { ...s, ...carried };
  });
  const ids = new Set(next.map((s) => s.id));
  const gone = prev.filter((s) => !ids.has(s.id) && DONE.has(s.status));
  return [...merged, ...gone].sort(byId);
}

export function clusters(sites) {
  const map = new Map();
  for (const s of sites) {
    if (DONE.has(s.status)) continue;
    const c = map.get(s.signatureKey) ?? {
      key: s.signatureKey,
      signature: s.signature,
      nested: s.nested,
      dynamic: s.dynamic,
      sites: [],
      domains: new Set(),
    };
    c.sites.push(s);
    c.domains.add(s.domain);
    map.set(s.signatureKey, c);
  }
  return [...map.values()]
    .map((c) => ({
      ...c,
      domains: [...c.domains].sort(),
      candidate: c.domains.size >= 2 && c.dynamic.length === 0,
    }))
    .sort((a, b) => b.sites.length - a.sites.length || a.key.localeCompare(b.key));
}

export function summarize(sites, { commonButton, overrides }) {
  const cs = clusters(sites);
  const candidates = cs.filter((c) => c.candidate);
  return {
    sites: sites.length,
    byStatus: Object.fromEntries(
      STATUSES.map((st) => [st, sites.filter((s) => s.status === st).length]),
    ),
    signatures: cs.length,
    candidateClusters: candidates.length,
    candidateSites: candidates.reduce((n, c) => n + c.sites.length, 0),
    commonButton,
    overrides,
  };
}

export const loadSites = (file) =>
  existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];

export const saveSites = (file, sites) =>
  writeFileSync(file, `${JSON.stringify(sites, null, 2)}\n`);
```

- [ ] **Step 4: 통과 확인**

Run: `cd frontend && npm run test:scripts`
Expected: PASS (누적 21개)

- [ ] **Step 5: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/sites.mjs frontend/scripts/button-migration/sites.test.mjs
git commit -m "feat: 버튼 자리 대장과 묶음·지표 계산을 만든다"
```

---

### Task 4: 인벤토리 CLI와 기준선

**Files:**
- Create: `frontend/scripts/button-migration/inventory.mjs`
- Modify: `frontend/scripts/figma-story-diff/theme.mjs:12` (`async function importTs` → `export async function importTs`)
- Modify: `frontend/package.json` (`button:inventory` 스크립트)
- Create (생성물): `frontend/scripts/button-migration/sites.json`

**Interfaces:**
- Consumes: `importTs(entry) → Promise<module>` (theme.mjs), `analyzeFile`, `COMMON_BUTTON` (Task 2), `SITES_FILE`, `buildSites`, `mergeSites`, `clusters`, `summarize`, `loadSites`, `saveSites` (Task 3)
- Produces: `sites.json`, `visual-diff/button-inventory/report.md`, `visual-diff/button-inventory/summary.json`

- [ ] **Step 1: `importTs`를 export한다**

`frontend/scripts/figma-story-diff/theme.mjs`에서 `async function importTs(entry) {`를 `export async function importTs(entry) {`로 바꾼다. 다른 줄은 건드리지 않는다.

- [ ] **Step 2: CLI 작성**

`frontend/package.json` `"scripts"`에 추가:

```json
    "button:inventory": "node scripts/button-migration/inventory.mjs",
```

`frontend/scripts/button-migration/inventory.mjs`:

```js
// 단계 ①: src 전체에서 버튼 정의·사용처를 모아 sites.json과 묶음 분포 리포트를 만든다.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { importTs } from '../figma-story-diff/theme.mjs';
import { COMMON_BUTTON, analyzeFile } from './extract.mjs';
import {
  SITES_FILE,
  buildSites,
  clusters,
  loadSites,
  mergeSites,
  saveSites,
  summarize,
} from './sites.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'visual-diff/button-inventory');
// 스토리·테스트는 제품 화면이 아니다
const SKIP = /\.(stories|test)\.tsx?$|\/styles\/theme\.test\//;
const EXTS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !SKIP.test(p))
      out.push(path.relative(ROOT, p));
  }
  return out;
}

function resolveModule(fromFile, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(ROOT, 'src', spec.slice(2));
  else if (spec.startsWith('.'))
    base = path.join(ROOT, path.dirname(fromFile), spec);
  else return null;
  for (const ext of EXTS) {
    const p = base + ext;
    if (existsSync(p) && statSync(p).isFile()) return path.relative(ROOT, p);
  }
  return null;
}

const fmt = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ') || '–';

function renderReport({ summary, clusters: cs, definitions, unused }) {
  const byKind = (kind) => definitions.filter((d) => d.kind === kind).length;
  const rows = cs.map(
    (c, i) =>
      `| ${i + 1} | \`${c.key}\` | ${c.sites.length} | ${c.domains.length} | ${c.dynamic.join(', ') || '–'} | ${c.candidate ? '✅' : ''} | ${fmt(c.signature)} | ${Object.keys(c.nested).join(', ') || '–'} | ${[...new Set(c.sites.map((s) => s.name))].slice(0, 3).join(', ')} |`,
  );
  return `# 버튼 인벤토리

생성: ${new Date().toISOString()}

| 지표 | 값 |
|---|---|
| 정의 | styled.button ${byKind('styled.button')} · styled(Button) ${byKind('styled(Button)')} (사용처 없음 ${unused.length}) |
| 자리 | ${summary.sites} |
| 서로 다른 시그니처 | ${summary.signatures} |
| 후보 묶음 (도메인 2곳 이상·동적 없음) | ${summary.candidateClusters}개 · 자리 ${summary.candidateSites}개 |
| 공용 Button JSX | 파일 ${summary.commonButton.files} · 사용 ${summary.commonButton.jsx} |
| 겉모습을 덮어쓰는 styled(Button) | ${summary.overrides} |
| 상태별 | ${fmt(summary.byStatus)} |

## 묶음

| # | 키 | 자리 | 도메인 | 동적 | 후보 | 시그니처 | 하위 블록 | 예시 |
|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## 사용처 없는 정의

${unused.map((d) => `- \`${d.file}:${d.line}\` ${d.name}`).join('\n') || '없음'}
`;
}

const { theme } = await importTs(path.join(ROOT, 'src/styles/theme/index.ts'));
const { media } = await importTs(path.join(ROOT, 'src/styles/mediaQuery.ts'));
const values = { theme, media };

const definitions = [];
const usages = [];
const commonButton = { files: 0, jsx: 0 };
for (const file of walk(path.join(ROOT, 'src'))) {
  const text = readFileSync(path.join(ROOT, file), 'utf8');
  const r = analyzeFile({ file, text, values, resolveModule });
  // 공용 Button 내부 구현은 이전 대상이 아니다
  if (file !== COMMON_BUTTON) definitions.push(...r.definitions);
  usages.push(...r.usages);
  if (r.commonButtonUsages) {
    commonButton.files += 1;
    commonButton.jsx += r.commonButtonUsages;
  }
}

const sites = mergeSites(loadSites(SITES_FILE), buildSites(definitions, usages));
saveSites(SITES_FILE, sites);

const used = new Set(usages.map((u) => `${u.defFile}::${u.name}`));
const unused = definitions.filter((d) => !used.has(`${d.file}::${d.name}`));
const overrides = definitions.filter((d) => d.overridesAppearance).length;
const summary = summarize(sites, { commonButton, overrides });

await mkdir(OUT, { recursive: true });
await writeFile(
  path.join(OUT, 'report.md'),
  renderReport({ summary, clusters: clusters(sites), definitions, unused }),
);
await writeFile(
  path.join(OUT, 'summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(
  `정의 ${definitions.length} · 자리 ${summary.sites} · 시그니처 ${summary.signatures} · 후보 묶음 ${summary.candidateClusters}(자리 ${summary.candidateSites}) → visual-diff/button-inventory/report.md`,
);
```

- [ ] **Step 3: 실행**

Run: `cd frontend && npm run button:inventory`
Expected: 한 줄 요약이 찍히고 `scripts/button-migration/sites.json`, `visual-diff/button-inventory/report.md`가 생긴다. 에러 없이 끝난다.

- [ ] **Step 4: 정의 수를 grep과 맞춰 본다**

Run:

```bash
cd frontend && grep -rhoE "styled\.button" src --include='*.ts' --include='*.tsx' --exclude='*.stories.tsx' --exclude='*.test.tsx' --exclude='*.test.ts' | wc -l
```

Expected: 리포트 "정의" 줄의 `styled.button` 수 + 1. +1은 `Button.tsx`의 `StyledButton`이다. 차이가 더 나면 원인을 찾아 리포트 아래에 적는다. 예를 들어 주석 안의 `styled.button`이나 `styled.button` 뒤에 템플릿이 아닌 호출이 붙은 경우다. 원인을 설명할 수 없으면 Task 2로 돌아가 픽스처를 추가하고 고친다.

- [ ] **Step 5: 한 번 더 돌려 결과가 안정적인지 본다**

Run: `cd frontend && cp scripts/button-migration/sites.json /tmp/sites.1.json && npm run button:inventory && diff /tmp/sites.1.json scripts/button-migration/sites.json && echo SAME`
Expected: `SAME`

- [ ] **Step 6: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/inventory.mjs frontend/scripts/button-migration/sites.json frontend/scripts/figma-story-diff/theme.mjs frontend/package.json
git commit -m "feat: 버튼 인벤토리를 돌려 자리 대장과 기준선 리포트를 만든다"
```

---

### Task 5: 렌더 측정과 before/after 비교

**Files:**
- Create: `frontend/scripts/button-migration/measure.mjs`
- Create: `frontend/scripts/button-migration/compare.mjs`
- Create: `frontend/scripts/button-migration/measure-compare.test.mjs`

**Interfaces:**
- Consumes: `diffPng(aBuf, bBuf) → { png: Buffer, mismatchPercent: number, sizes }` (figma-story-diff/diff.mjs)
- Produces:
  - `WIDTHS = [1440, 1280, 700, 500, 375]`, `STYLE_PROPS: string[]`, `FREEZE_CSS: string`
  - `launchBrowser() → Promise<Browser>`
  - `resolveTarget(page, locatorSpec) → Promise<Locator|null>` — `locatorSpec = { role?, name?, css?, nth? }`. 여러 개에 걸리는데 `nth`가 없으면 throw, 안 보이면 null
  - `measureStates(page, locatorSpec) → Promise<{ hidden: true } | { default: Snapshot, hover: Snapshot }>`
  - `measureSite(page, baseUrl, site) → Promise<Record<width, ReturnType<measureStates>>>`
  - `Snapshot = { style: Record<prop,string>, dom: { tag, type, role, disabled, aria, ariaSnapshot }, png: Buffer }`
  - `compareRuns(before, after) → { pass: boolean, rows: { width, state, diffs: {key,before,after}[], pixel: number|null, diffPng?: Buffer }[] }`

- [ ] **Step 1: 실패하는 테스트 작성**

크로미움이 없으면 먼저 `cd frontend && npx playwright install chromium`.

`frontend/scripts/button-migration/measure-compare.test.mjs`:

```js
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { compareRuns } from './compare.mjs';
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
    await run(html(CSS.replace('8px 16px', '8px 17px'), '<button>지원하기</button>')),
  );
  assert.equal(r.pass, false);
  assert.ok(r.rows.some((row) => row.diffs.some((d) => d.key === 'padding-right')));
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
    await run(html(CSS.replace('#111111', '#222222'), '<button>지원하기</button>')),
  );
  assert.equal(r.pass, false);
  assert.deepEqual(
    r.rows.filter((row) => row.diffs.length).map((row) => row.state),
    ['hover'],
  );
  const bg = r.rows
    .find((row) => row.state === 'hover')
    .diffs.find((d) => d.key === 'background-color');
  assert.deepEqual([bg.before, bg.after], ['rgb(17, 17, 17)', 'rgb(34, 34, 34)']);
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
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npm run test:scripts`
Expected: FAIL — `Cannot find module '.../compare.mjs'`

- [ ] **Step 3: measure.mjs 구현**

`frontend/scripts/button-migration/measure.mjs`:

```js
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
  const style = await target.evaluate(
    (el, props) => {
      const cs = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
    },
    STYLE_PROPS,
  );
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
  return { style, dom, png: await target.screenshot() };
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
    await page.goto(new URL(site.route, baseUrl).href, {
      waitUntil: 'networkidle',
    });
    out[width] = await measureStates(page, site.locator);
  }
  return out;
}
```

- [ ] **Step 4: compare.mjs 구현**

`frontend/scripts/button-migration/compare.mjs`:

```js
// before/after 측정을 비교한다. 스타일·DOM이 하나라도 다르면 실패, 픽셀은 참고값이다.
import { diffPng } from '../figma-story-diff/diff.mjs';

const DOM_KEYS = ['tag', 'type', 'role', 'disabled', 'ariaSnapshot'];

function compareSnapshot(before, after) {
  const diffs = [];
  for (const k of Object.keys(before.style))
    if (before.style[k] !== after.style[k])
      diffs.push({ key: k, before: before.style[k], after: after.style[k] });
  for (const k of DOM_KEYS)
    if (before.dom[k] !== after.dom[k])
      diffs.push({ key: `dom.${k}`, before: before.dom[k], after: after.dom[k] });
  const a = JSON.stringify(before.dom.aria);
  const b = JSON.stringify(after.dom.aria);
  if (a !== b) diffs.push({ key: 'dom.aria', before: a, after: b });
  return diffs;
}

export function compareRuns(before, after) {
  const widths = Object.keys(before);
  // 양쪽 다 못 찾으면 "차이 없음"이 아니라 locator가 틀린 것이다
  if (widths.every((w) => before[w].hidden && after[w].hidden))
    return {
      pass: false,
      rows: [
        {
          width: '*',
          state: '-',
          diffs: [
            {
              key: 'not-found',
              before: '모든 폭에서 안 보임',
              after: '모든 폭에서 안 보임',
            },
          ],
          pixel: null,
        },
      ],
    };
  const rows = [];
  for (const width of widths) {
    const b = before[width];
    const a = after[width];
    if (b.hidden || a.hidden) {
      rows.push({
        width,
        state: '-',
        diffs:
          b.hidden === a.hidden
            ? []
            : [{ key: 'visible', before: !b.hidden, after: !a.hidden }],
        pixel: null,
      });
      continue;
    }
    for (const state of ['default', 'hover']) {
      const pixel = diffPng(b[state].png, a[state].png);
      rows.push({
        width,
        state,
        diffs: compareSnapshot(b[state], a[state]),
        pixel: pixel.mismatchPercent,
        diffPng: pixel.png,
      });
    }
  }
  return { pass: rows.every((r) => r.diffs.length === 0), rows };
}
```

- [ ] **Step 5: 통과 확인**

Run: `cd frontend && npm run test:scripts`
Expected: PASS (누적 28개). "양쪽 다 어디서도 안 보이면 실패"는 찾기 타임아웃(5초) 때문에 느리다.

- [ ] **Step 6: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/measure.mjs frontend/scripts/button-migration/compare.mjs frontend/scripts/button-migration/measure-compare.test.mjs
git commit -m "feat: 버튼 렌더 결과를 재고 before/after를 판정한다"
```

---

### Task 6: before/after CLI (Vite·worktree·로그인)

**Files:**
- Create: `frontend/scripts/button-migration/app.mjs`
- Create: `frontend/scripts/button-migration/app.test.mjs`
- Create: `frontend/scripts/button-migration/before-after.mjs`
- Create: `frontend/scripts/button-migration/smoke-targets.json`
- Modify: `frontend/package.json` (`button:before-after` 스크립트)

**Interfaces:**
- Consumes: `launchBrowser`, `measureSite` (Task 5), `compareRuns` (Task 5), `SITES_FILE`, `loadSites`, `saveSites` (Task 3)
- Produces:
  - `FRONTEND: string`
  - `needsAdmin(route: string) → boolean`
  - `loginAdmin(page, baseUrl) → Promise<void>`
  - `openPages(browser, baseUrl, sites, contextOptions?) → Promise<(route) => Page>`
  - `startVite(cwd, port) → Promise<{ url, stop() }>`
  - `prepareBaseWorktree(ref) → string` (worktree의 frontend 절대경로), `removeBaseWorktree() → void`
  - CLI: `npm run button:before-after -- [--base <ref>] [--ids a,b] [--status migrated] [--targets <json>] [--clean]`

- [ ] **Step 1: 실패하는 테스트 작성**

`frontend/scripts/button-migration/app.test.mjs`:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { needsAdmin } from './app.mjs';

test('로그인 화면은 비로그인 세션으로 연다', () => {
  assert.equal(needsAdmin('/admin/login'), false);
  assert.equal(needsAdmin('/admin/club-info'), true);
  assert.equal(needsAdmin('/admin'), true);
  assert.equal(needsAdmin('/clubDetail/@abc'), false);
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npm run test:scripts`
Expected: FAIL — `Cannot find module '.../app.mjs'`

- [ ] **Step 3: app.mjs 구현**

`frontend/scripts/button-migration/app.mjs`:

```js
// before/after·시안 대조가 쓰는 Vite 서버, 기준 커밋 worktree, 관리자 로그인.
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export const FRONTEND = path.resolve(import.meta.dirname, '../..');
const REPO = path.resolve(FRONTEND, '..');
const WORKTREE = path.join(REPO, '.context/button-before');

const git = (...args) =>
  execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).trim();

export const needsAdmin = (route) =>
  route.startsWith('/admin') && !route.startsWith('/admin/login');

export async function loginAdmin(page, baseUrl) {
  const id = process.env.DEV_ADMIN_ID;
  const pw = process.env.DEV_ADMIN_PASSWORD;
  if (!id || !pw)
    throw new Error('DEV_ADMIN_ID·DEV_ADMIN_PASSWORD가 frontend/.env에 없다');
  await page.goto(new URL('/admin/login', baseUrl).href, {
    waitUntil: 'networkidle',
  });
  await page.getByPlaceholder('아이디').fill(id);
  await page.getByPlaceholder('비밀번호').fill(pw);
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await page.waitForURL(
    (url) =>
      url.pathname.startsWith('/admin') &&
      !url.pathname.startsWith('/admin/login'),
    { timeout: 20_000 },
  );
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

export async function startVite(cwd, port) {
  const child = spawn(
    path.join(cwd, 'node_modules/.bin/vite'),
    ['--config', './config/vite.config.ts', '--port', String(port), '--strictPort'],
    { cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true },
  );
  let log = '';
  child.stdout.on('data', (d) => {
    log += d;
  });
  child.stderr.on('data', (d) => {
    log += d;
  });
  const stop = () => {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      // 이미 종료됨
    }
  };
  const url = `http://localhost:${port}`;
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null)
      throw new Error(`vite가 종료됨 (${cwd}):\n${log}`);
    try {
      if ((await fetch(url)).ok) return { url, stop };
    } catch {
      // 아직 안 뜸
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  stop();
  throw new Error(`vite가 ${url}에서 120초 안에 안 떴다:\n${log}`);
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
```

- [ ] **Step 4: 통과 확인**

Run: `cd frontend && npm run test:scripts`
Expected: PASS (누적 29개)

- [ ] **Step 5: before-after.mjs 작성**

`frontend/package.json` `"scripts"`에 추가:

```json
    "button:before-after": "dotenv -- node scripts/button-migration/before-after.mjs",
```

`frontend/scripts/button-migration/before-after.mjs`:

```js
// 단계 ④: 기준 커밋과 현재 작업 트리를 같은 dev API로 차례로 띄워 자리마다 렌더 결과를 비교한다.
import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  FRONTEND,
  openPages,
  prepareBaseWorktree,
  removeBaseWorktree,
  startVite,
} from './app.mjs';
import { compareRuns } from './compare.mjs';
import { launchBrowser, measureSite } from './measure.mjs';
import { SITES_FILE, loadSites, saveSites } from './sites.mjs';

// 두 서버를 같은 포트로 차례로 띄운다. 동시에 띄우면 node_modules/.vite 캐시를 서로 덮어쓴다.
const PORT = 3101;
const OUT = path.join(FRONTEND, 'visual-diff/button-migration');

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'origin/develop-fe' },
    ids: { type: 'string' },
    status: { type: 'string', default: 'migrated' },
    targets: { type: 'string' },
    clean: { type: 'boolean', default: false },
  },
});

const fromLedger = !args.targets;
const all = fromLedger
  ? loadSites(SITES_FILE)
  : JSON.parse(readFileSync(path.resolve(FRONTEND, args.targets), 'utf8'));
const wanted = args.ids ? new Set(args.ids.split(',')) : null;
const targets = all.filter((s) =>
  wanted ? wanted.has(s.id) : !fromLedger || s.status === args.status,
);
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
  const browser = await launchBrowser();
  try {
    const pageFor = await openPages(browser, server.url, targets);
    const out = new Map();
    for (const site of targets) {
      try {
        out.set(site.id, await measureSite(pageFor(site.route), server.url, site));
      } catch (e) {
        out.set(site.id, { error: e.message });
      }
    }
    return out;
  } finally {
    await browser.close();
    server.stop();
  }
}

function renderReport(site, r) {
  const rows = r.rows.map(
    (row) =>
      `| ${row.width} | ${row.state} | ${row.diffs.length ? 'FAIL' : 'PASS'} | ${row.pixel == null ? '–' : `${row.pixel.toFixed(3)}%`} | ${row.diffs.map((d) => `${d.key}: ${d.before} → ${d.after}`).join('<br>') || '–'} |`,
  );
  return `# ${site.id} — ${r.pass ? 'PASS' : 'FAIL'}

- 기준: \`${args.base}\` · 비교: 현재 작업 트리
- 경로: \`${site.route}\` · locator: \`${JSON.stringify(site.locator)}\`

| 폭 | 상태 | 판정 | 픽셀 차이(참고) | 다른 값 |
|---|---|---|---|---|
${rows.join('\n')}
`;
}

const beforeDir = prepareBaseWorktree(args.base);
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
  await writeFile(path.join(dir, 'report.md'), renderReport(site, r));
  results.push({
    site,
    pass: r.pass,
    note: `${path.relative(FRONTEND, dir)}/report.md`,
  });
}

if (fromLedger) {
  // 이전한 자리만 verified로 올린다. 점검용으로 돌린 다른 상태는 건드리지 않는다.
  const passed = new Set(results.filter((x) => x.pass).map((x) => x.site.id));
  saveSites(
    SITES_FILE,
    all.map((s) =>
      passed.has(s.id) && s.status === 'migrated' ? { ...s, status: 'verified' } : s,
    ),
  );
}
if (args.clean) removeBaseWorktree();
for (const x of results)
  console.log(`${x.pass ? 'PASS' : 'FAIL'}  ${x.site.id}  ${x.note}`);
process.exit(results.every((x) => x.pass) ? 0 : 1);
```

- [ ] **Step 6: 판정기 안정성 대상 작성**

로그인 화면(비로그인 세션)과 관리자 화면(로그인 세션), 그리고 hover 애니메이션이 있는 공용 Button(`animated`)을 하나씩 고른다. 셋 다 기존 코드에 고정 라벨로 있다(`LoginTab.tsx`의 회원가입, `ClubInfoEditTab.tsx`의 저장하기).

`frontend/scripts/button-migration/smoke-targets.json`:

```json
[
  {
    "id": "smoke/admin-login-signup",
    "route": "/admin/login",
    "locator": { "role": "button", "name": "회원가입" }
  },
  {
    "id": "smoke/club-info-save",
    "route": "/admin/club-info",
    "locator": { "role": "button", "name": "저장하기" }
  }
]
```

- [ ] **Step 7: 같은 커밋끼리 두 번 돌려 PASS를 확인한다 (스펙 11절 되돌릴 조건 2)**

`frontend/.env`에 `DEV_ADMIN_ID`·`DEV_ADMIN_PASSWORD`가 있는지 먼저 확인한다(값은 출력하지 않는다): `grep -c '^DEV_ADMIN_' frontend/.env` → `2`.

Run (두 번):

```bash
cd frontend && npm run button:before-after -- --base HEAD --targets scripts/button-migration/smoke-targets.json
```

Expected (두 번 다):

```
PASS  smoke/admin-login-signup  visual-diff/button-migration/smoke_admin-login-signup/report.md
PASS  smoke/club-info-save  visual-diff/button-migration/smoke_club-info-save/report.md
```

두 리포트 모두 모든 행의 픽셀 차이가 `0.000%`여야 한다. FAIL이 나면 이전 PR로 넘어가지 않고 원인부터 고친다. 흔한 원인은 아래 셋이다. 원인과 해결을 `scripts/button-migration/CLAUDE.md`(Task 9)에 적는다.
- 폰트 로딩
- dev 데이터를 받는 타이밍(`networkidle` 뒤에도 늦게 그려지는 요소)
- `locator`가 여러 개에 걸림(에러 메시지에 `nth`를 지정하라고 나온다)

- [ ] **Step 8: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/app.mjs frontend/scripts/button-migration/app.test.mjs frontend/scripts/button-migration/before-after.mjs frontend/scripts/button-migration/smoke-targets.json frontend/package.json
git commit -m "feat: 기준 커밋과 작업 트리를 띄워 버튼 before/after를 비교한다"
```

---

### Task 7: figma-story-diff에서 요소 측정부 꺼내기

**Files:**
- Modify: `frontend/scripts/figma-story-diff/story.mjs` (`captureStory` 안의 측정부를 `collectElement`로)
- Modify: `frontend/scripts/figma-story-diff/figma.mjs:16` (`async function api` → `export async function api`)

**Interfaces:**
- Consumes: 없음
- Produces:
  - `collectElement(target: Locator) → Promise<{ png, bbox, layout, colors: Map, typography: Map, translucent: Map }>`
  - `api(pathname) → Promise<json>` (figma.mjs)
  - `captureStory`의 시그니처와 반환값은 그대로다.

- [ ] **Step 1: 리팩터 전 결과를 저장한다**

Storybook을 띄우고(`cd frontend && npm run storybook -- --ci --no-open`, 다른 터미널) `FIGMA_TOKEN`이 `.env`에 있는지 확인한다(`grep -c '^FIGMA_TOKEN=' frontend/.env` → `1`).

Run: `cd frontend && npm run visual:figma > /tmp/vf-before.txt; rm -rf /tmp/vf-before && cp -R visual-diff /tmp/vf-before`
Expected: PASS·FAIL 줄이 매핑 수만큼 찍힌다(현재 매핑은 `PerformanceCard`, `TimelineRow`, `ClubCard`).

- [ ] **Step 2: `api`를 export한다**

`frontend/scripts/figma-story-diff/figma.mjs`에서 `async function api(pathname) {`를 `export async function api(pathname) {`로 바꾼다.

- [ ] **Step 3: `collectElement`를 꺼낸다**

`frontend/scripts/figma-story-diff/story.mjs`에서 `captureStory`의 `try` 블록 안을 아래처럼 나눈다. `const png = await target.screenshot();`부터 `return { url, png, ... }` 직전까지의 코드(DOM 평가와 색·타이포 집계)를 그대로 새 함수로 옮기고, 옮긴 함수가 `{ png, bbox: dom.bbox, layout: dom.layout, colors, typography, translucent }`를 반환하게 한다.

```js
export async function collectElement(target) {
  const png = await target.screenshot();
  const dom = await target.evaluate((el) => {
    // ← 기존 captureStory의 evaluate 콜백 본문을 한 글자도 바꾸지 않고 옮긴다
  });
  const colors = new Map();
  const typography = new Map();
  const translucent = new Map();
  // ← 기존 for (const s of dom.styles) { ... } 집계 루프를 그대로 옮긴다
  return {
    png,
    bbox: dom.bbox,
    layout: dom.layout,
    colors,
    typography,
    translucent,
  };
}
```

`captureStory`의 `try` 블록은 이렇게 된다:

```js
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const root = page.locator('#storybook-root');
    await root.waitFor();
    await page.evaluate(() => document.fonts.ready);
    const target = root.locator('> *').first();
    return { url, ...(await collectElement(target)) };
  } finally {
    await browser.close();
  }
```

`parseColor`, `alphaPercent`, `typoKey` import는 모듈 최상위에 그대로 둔다. `collectElement`가 쓴다.

- [ ] **Step 4: 리팩터 후 결과가 같은지 본다**

Run:

```bash
cd frontend && npm run visual:figma > /tmp/vf-after.txt; diff /tmp/vf-before.txt /tmp/vf-after.txt && diff -r -x '*.png' /tmp/vf-before visual-diff && echo SAME
```

Expected: `SAME`. 콘솔 판정 줄과 모든 `report.md`가 같아야 한다. 픽셀 % 줄도 같은 브라우저·같은 스토리라 같아야 한다. 다르면 옮기다 바뀐 줄을 찾아 되돌린다.

- [ ] **Step 5: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/figma-story-diff/story.mjs frontend/scripts/figma-story-diff/figma.mjs
git commit -m "refactor: 시안 대조의 요소 측정부를 꺼내 실제 페이지에서도 쓴다"
```

---

### Task 8: 시안 대조 (후보 찾기·판정 CLI)

**Files:**
- Create: `frontend/scripts/button-migration/figma-gate.mjs`
- Create: `frontend/scripts/button-migration/figma-search.mjs`
- Create: `frontend/scripts/button-migration/figma.test.mjs`
- Create: `frontend/scripts/button-migration/figma-candidates.mjs`
- Create: `frontend/scripts/button-migration/figma-match.mjs`
- Modify: `frontend/package.json` (`button:figma-candidates`, `button:figma-match`)

**Interfaces:**
- Consumes: `api` (figma.mjs, Task 7), `fetchFigma(url, scale)` (figma.mjs), `collectElement` (story.mjs, Task 7), `loadTheme() → { colors: Set, typography: Map }` (theme.mjs), `FREEZE_CSS`, `launchBrowser`, `resolveTarget` (Task 5), `FRONTEND`, `openPages`, `startVite` (Task 6), `SITES_FILE`, `loadSites`, `saveSites`, `clusters` (Task 3)
- Produces:
  - `figmaGate({ figma, impl, theme }) → { pass, sizePass, parityIssues: string[], tokenIssues: string[], dw, dh }` — `pass = 토큰 일치 && 크기 ±2px`. theme에 없는 값(`tokenIssues`)은 판정에 넣지 않고 보고만 한다. 시안과 같게 생긴 자리를 "테마에 토큰이 없다"는 이유로 위반 처리하면 분류가 틀어진다. 그 토큰은 이전 PR에서 theme에 추가한다(Figma SSOT).
  - `findCandidates(pageNode, label) → { nodeId, name, screen, url }[]`
  - `nodeUrl(nodeId) → string`, `loadPage({ refresh }) → Promise<pageNode>`
  - CLI: `npm run button:figma-candidates -- [--ids a,b] [--refresh]`, `npm run button:figma-match -- [--ids a,b]`

- [ ] **Step 1: 실패하는 테스트 작성**

`frontend/scripts/button-migration/figma.test.mjs`:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { figmaGate } from './figma-gate.mjs';
import { findCandidates } from './figma-search.mjs';

const theme = {
  colors: new Set(['#3A3A3A', '#FFFFFF']),
  typography: new Map([['16/600/140', 'paragraph.p2']]),
};
const side = (colors, typo, width, height) => ({
  colors: new Map(colors.map((c) => [c, 'n'])),
  typography: new Map(typo.map((t) => [t, 'n'])),
  bbox: { width, height },
});

test('같은 토큰·±2px 안이면 일치', () => {
  const g = figmaGate({
    figma: side(['#3A3A3A', '#FFFFFF'], ['16/600/140'], 287, 44),
    impl: side(['#3A3A3A', '#FFFFFF'], ['16/600/140'], 288.5, 44),
    theme,
  });
  assert.equal(g.pass, true);
});

test('크기가 2px 넘게 다르면 위반', () => {
  const g = figmaGate({
    figma: side(['#3A3A3A'], [], 287, 44),
    impl: side(['#3A3A3A'], [], 287, 46.5),
    theme,
  });
  assert.equal(g.pass, false);
  assert.equal(g.sizePass, false);
});

test('구현에만 있는 색이 있으면 위반', () => {
  const g = figmaGate({
    figma: side(['#3A3A3A'], [], 10, 10),
    impl: side(['#3A3A3A', '#FFFFFF'], [], 10, 10),
    theme,
  });
  assert.equal(g.pass, false);
  assert.deepEqual(g.parityIssues, ['구현에만 색 #FFFFFF']);
});

test('양쪽이 같은 값이면 theme에 없어도 일치, 대신 보고한다', () => {
  const g = figmaGate({
    figma: side(['#123456'], [], 10, 10),
    impl: side(['#123456'], [], 10, 10),
    theme,
  });
  assert.equal(g.pass, true);
  assert.deepEqual(g.tokenIssues, ['시안 색 #123456', '구현 색 #123456']);
});

test('라벨 글자를 감싼, 칠해진 가장 가까운 프레임을 후보로 낸다', () => {
  const page = {
    id: '0:1',
    type: 'CANVAS',
    name: '✳️ 페이지 최종',
    children: [
      {
        id: '1:1',
        type: 'SECTION',
        name: '상세',
        children: [
          {
            id: '1:2',
            type: 'FRAME',
            name: '상세 데스크탑',
            fills: [{ type: 'SOLID', color: {} }],
            children: [
              {
                id: '1:3',
                type: 'FRAME',
                name: 'Frame 5',
                fills: [{ type: 'SOLID', color: {} }],
                cornerRadius: 10,
                children: [
                  { id: '1:4', type: 'TEXT', characters: '지원하기 ', name: 't' },
                ],
              },
              { id: '1:5', type: 'TEXT', characters: '다른 글자', name: 't' },
            ],
          },
        ],
      },
    ],
  };
  assert.deepEqual(findCandidates(page, '지원하기'), [
    {
      nodeId: '1:3',
      name: 'Frame 5',
      screen: '상세 / 상세 데스크탑',
      url: 'https://www.figma.com/design/LB4VudDhuIGjFayrm1kge1/moadong?node-id=1-3',
    },
  ]);
});
```

- [ ] **Step 2: 실패 확인**

Run: `cd frontend && npm run test:scripts`
Expected: FAIL — `Cannot find module '.../figma-gate.mjs'`

- [ ] **Step 3: figma-gate.mjs 구현**

`frontend/scripts/button-migration/figma-gate.mjs`:

```js
// 단계 ②의 판정: 시안 노드와 실제 페이지 요소의 토큰 일치·루트 크기를 본다 (figma-story-diff와 같은 기준).
export const SIZE_TOLERANCE_PX = 2;

const missing = (used, known) => [...used.keys()].filter((k) => !known.has(k));
const only = (a, b) => [...a.keys()].filter((k) => !b.has(k));

export function figmaGate({ figma, impl, theme }) {
  const parityIssues = [
    ...only(figma.colors, impl.colors).map((k) => `시안에만 색 ${k}`),
    ...only(impl.colors, figma.colors).map((k) => `구현에만 색 ${k}`),
    ...only(figma.typography, impl.typography).map((k) => `시안에만 타이포 ${k}`),
    ...only(impl.typography, figma.typography).map((k) => `구현에만 타이포 ${k}`),
  ];
  // theme에 없는 값은 "시안과 같은가"와 별개라 판정에서 뺀다. 이전 PR에서 theme에 추가한다.
  const tokenIssues = [
    ...missing(figma.colors, theme.colors).map((k) => `시안 색 ${k}`),
    ...missing(impl.colors, theme.colors).map((k) => `구현 색 ${k}`),
    ...missing(figma.typography, theme.typography).map((k) => `시안 타이포 ${k}`),
    ...missing(impl.typography, theme.typography).map((k) => `구현 타이포 ${k}`),
  ];
  // 반올림하지 않는다. 2.49px가 2로 접혀 통과하는 걸 막는다.
  const dw = impl.bbox.width - figma.bbox.width;
  const dh = impl.bbox.height - figma.bbox.height;
  const sizePass =
    Math.abs(dw) <= SIZE_TOLERANCE_PX && Math.abs(dh) <= SIZE_TOLERANCE_PX;
  return {
    pass: parityIssues.length === 0 && sizePass,
    sizePass,
    parityIssues,
    tokenIssues,
    dw,
    dh,
  };
}
```

- [ ] **Step 4: figma-search.mjs 구현**

`frontend/scripts/button-migration/figma-search.mjs`:

```js
// "✳️ 페이지 최종"에서 버튼 라벨과 글자가 같은 TEXT 노드를 찾아 감싸는 프레임을 후보로 낸다.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { api } from '../figma-story-diff/figma.mjs';

export const FILE_KEY = process.env.FIGMA_FILE_KEY ?? 'LB4VudDhuIGjFayrm1kge1';
export const PAGE_NAME = '✳️ 페이지 최종';
const CACHE = path.resolve(
  import.meta.dirname,
  '../../node_modules/.cache/button-migration/page.json',
);

const BOXY = new Set(['FRAME', 'INSTANCE', 'COMPONENT']);
const painted = (n) =>
  (n.fills ?? []).some((f) => f.visible !== false && f.type === 'SOLID') ||
  (n.strokes ?? []).length > 0 ||
  n.cornerRadius > 0;

export const nodeUrl = (id) =>
  `https://www.figma.com/design/${FILE_KEY}/moadong?node-id=${id.replace(':', '-')}`;

export function findCandidates(page, label) {
  const out = [];
  const walk = (node, ancestors) => {
    if (node.type === 'TEXT' && node.characters?.trim() === label) {
      // 인스턴스 내부 노드(I로 시작)는 링크로 못 연다. 바깥의 칠해진 프레임을 잡는다.
      const box = [...ancestors]
        .reverse()
        .find((a) => BOXY.has(a.type) && !a.id.startsWith('I') && painted(a));
      if (box)
        out.push({
          nodeId: box.id,
          name: box.name,
          screen: ancestors
            .slice(1, 3)
            .map((a) => a.name)
            .join(' / '),
          url: nodeUrl(box.id),
        });
    }
    for (const c of node.children ?? []) walk(c, [...ancestors, node]);
  };
  walk(page, []);
  return out;
}

// 페이지 전체 트리는 크다. 한 번 받아 캐시하고, 시안이 바뀌면 --refresh로 다시 받는다.
export async function loadPage({ refresh = false } = {}) {
  if (!refresh && existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, 'utf8'));
  const file = await api(`/files/${FILE_KEY}?depth=1`);
  const page = file.document.children.find((p) => p.name === PAGE_NAME);
  if (!page) throw new Error(`Figma 페이지 "${PAGE_NAME}"가 없다`);
  const body = await api(
    `/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(page.id)}`,
  );
  const doc = body.nodes[page.id].document;
  await mkdir(path.dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(doc));
  return doc;
}
```

- [ ] **Step 5: 통과 확인**

Run: `cd frontend && npm run test:scripts`
Expected: PASS (누적 34개)

- [ ] **Step 6: 두 CLI 작성**

`frontend/package.json` `"scripts"`에 추가:

```json
    "button:figma-candidates": "dotenv -- node scripts/button-migration/figma-candidates.mjs",
    "button:figma-match": "dotenv -- node scripts/button-migration/figma-match.mjs",
```

`frontend/scripts/button-migration/figma-candidates.mjs`:

```js
// 단계 ② 보조: 후보 묶음의 자리마다 시안 노드 후보를 찾아 목록을 낸다. 확정은 사람이 sites.json의 figma에 적는다.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { findCandidates, loadPage } from './figma-search.mjs';
import { SITES_FILE, clusters, loadSites } from './sites.mjs';

const OUT = path.resolve(import.meta.dirname, '../../visual-diff/button-figma');
const { values: args } = parseArgs({
  options: {
    ids: { type: 'string' },
    refresh: { type: 'boolean', default: false },
  },
});

const sites = loadSites(SITES_FILE);
const candidateKeys = new Set(
  clusters(sites)
    .filter((c) => c.candidate)
    .map((c) => c.key),
);
const wanted = args.ids ? new Set(args.ids.split(',')) : null;
const targets = sites.filter((s) =>
  wanted ? wanted.has(s.id) : candidateKeys.has(s.signatureKey) && !s.figma,
);

const page = await loadPage({ refresh: args.refresh });
const lines = ['# 시안 노드 후보', ''];
for (const s of targets) {
  const found = s.label ? findCandidates(page, s.label) : [];
  lines.push(`## ${s.id}`, '');
  if (!s.label) lines.push('- 라벨이 동적이라 직접 찾아야 한다');
  else if (!found.length) lines.push(`- "${s.label}" 글자를 가진 노드가 없다`);
  else lines.push(...found.map((c) => `- ${c.screen} › ${c.name} — ${c.url}`));
  lines.push('');
}
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'candidates.md'), lines.join('\n'));
console.log(`자리 ${targets.length}개 → visual-diff/button-figma/candidates.md`);
```

`frontend/scripts/button-migration/figma-match.mjs`:

```js
// 단계 ②: figma·route·locator가 채워진 자리를 시안 노드와 대조해 figma-match / figma-violation을 기록한다.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fetchFigma } from '../figma-story-diff/figma.mjs';
import { collectElement } from '../figma-story-diff/story.mjs';
import { loadTheme } from '../figma-story-diff/theme.mjs';
import { FRONTEND, openPages, startVite } from './app.mjs';
import { figmaGate } from './figma-gate.mjs';
import { FREEZE_CSS, launchBrowser, resolveTarget } from './measure.mjs';
import { SITES_FILE, loadSites, saveSites } from './sites.mjs';

const PORT = 3102;
const DEFAULT_VIEWPORT = 1440;
const OUT = path.join(FRONTEND, 'visual-diff/button-figma');
const { values: args } = parseArgs({ options: { ids: { type: 'string' } } });

const sites = loadSites(SITES_FILE);
const wanted = args.ids ? new Set(args.ids.split(',')) : null;
const targets = sites.filter(
  (s) =>
    s.figma &&
    s.route &&
    s.locator &&
    (wanted
      ? wanted.has(s.id)
      : ['inventoried', 'figma-violation'].includes(s.status)),
);
if (!targets.length) {
  console.error('대상 없음: figma·route·locator가 모두 채워진 자리가 없다');
  process.exit(2);
}

const lines = (items) => items.map((x) => `- ${x}`).join('\n') || '없음';

const theme = await loadTheme();
const server = await startVite(FRONTEND, PORT);
const browser = await launchBrowser();
const results = [];
try {
  const pageFor = await openPages(browser, server.url, targets, {
    deviceScaleFactor: 2,
  });
  for (const site of targets) {
    try {
      const figma = await fetchFigma(site.figma);
      const page = pageFor(site.route);
      await page.setViewportSize({
        width: site.figmaViewport ?? DEFAULT_VIEWPORT,
        height: 900,
      });
      await page.goto(new URL(site.route, server.url).href, {
        waitUntil: 'networkidle',
      });
      await page.addStyleTag({ content: FREEZE_CSS });
      const target = await resolveTarget(page, site.locator);
      if (!target) throw new Error('요소가 안 보인다');
      const impl = await collectElement(target);
      const gate = figmaGate({ figma, impl, theme });
      const dir = path.join(OUT, site.id.replace(/[^\w.-]+/g, '_'));
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'figma.png'), figma.png);
      await writeFile(path.join(dir, 'impl.png'), impl.png);
      await writeFile(
        path.join(dir, 'report.md'),
        `# ${site.id} — ${gate.pass ? 'figma-match' : 'figma-violation'}

- 시안: [${figma.name}](${site.figma}) · 폭 ${site.figmaViewport ?? DEFAULT_VIEWPORT}
- 경로: \`${site.route}\` · locator: \`${JSON.stringify(site.locator)}\`
- 루트 크기: 시안 ${figma.bbox.width}×${figma.bbox.height} · 구현 ${impl.bbox.width}×${impl.bbox.height} (Δ ${gate.dw.toFixed(2)}, ${gate.dh.toFixed(2)}) — ${gate.sizePass ? 'PASS' : 'FAIL'}

## 토큰 일치 (판정)

${lines(gate.parityIssues)}

## theme에 없는 값 (보고만, 이전 전에 theme에 추가)

${lines(gate.tokenIssues)}

![figma](figma.png) ![impl](impl.png)
`,
      );
      results.push({
        site,
        status: gate.pass ? 'figma-match' : 'figma-violation',
        note: `${path.relative(FRONTEND, dir)}/report.md`,
      });
    } catch (e) {
      results.push({ site, status: null, note: e.message });
    }
  }
} finally {
  await browser.close();
  server.stop();
}

const statusById = new Map(
  results.filter((r) => r.status).map((r) => [r.site.id, r.status]),
);
saveSites(
  SITES_FILE,
  sites.map((s) =>
    statusById.has(s.id) ? { ...s, status: statusById.get(s.id) } : s,
  ),
);
for (const r of results)
  console.log(`${r.status ?? 'ERROR'}  ${r.site.id}  ${r.note}`);
process.exit(results.every((r) => r.status) ? 0 : 1);
```

- [ ] **Step 7: 자리 하나로 끝까지 돌려 본다**

Run: `cd frontend && npm run button:figma-candidates`
Expected: `자리 N개 → visual-diff/button-figma/candidates.md`. N은 Task 4 리포트의 "후보 묶음 자리 수"와 같다(아직 `figma`가 채워진 자리가 없으므로).

`candidates.md`에서 후보가 하나로 좁혀지는 자리를 하나 고른다. 그 자리의 `sites.json` 레코드에 `figma`(후보 URL), `route`(그 화면 경로), `figmaViewport`(시안이 모바일이면 375, 아니면 1440)를 손으로 채운다. 라벨이 locator로 부족하면 `locator`에 `nth`도 넣는다.

Run: `cd frontend && npm run button:figma-match -- --ids '<고른 자리 id>'`
Expected: `figma-match` 또는 `figma-violation` 한 줄. `visual-diff/button-figma/<id>/report.md`에 시안·구현 이미지가 있고, `sites.json`의 그 자리 `status`가 같은 값으로 바뀐다. 리포트를 눈으로 보고 판정이 이미지와 맞는지 확인한다. 안 맞으면 그 원인(잘못 잡은 시안 노드, 래퍼 요소, 반투명 등)을 Task 9 문서의 "자주 틀리는 것"에 적는다.

- [ ] **Step 8: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/figma-gate.mjs frontend/scripts/button-migration/figma-search.mjs frontend/scripts/button-migration/figma.test.mjs frontend/scripts/button-migration/figma-candidates.mjs frontend/scripts/button-migration/figma-match.mjs frontend/scripts/button-migration/sites.json frontend/package.json
git commit -m "feat: 버튼 자리를 화면 시안과 대조해 일치·위반을 기록한다"
```

---

### Task 9: 문서와 기준선 정리

**Files:**
- Create: `frontend/scripts/button-migration/CLAUDE.md`
- Modify: `frontend/CLAUDE.md` (명령어, 환경 변수, 폴더별 문서 인덱스)

**Interfaces:**
- Consumes: Task 4의 `visual-diff/button-inventory/summary.json`, Task 6·8에서 적어 둔 원인 메모
- Produces: 스크립트 문서와 PR 본문에 옮길 기준선 수치

- [ ] **Step 1: 스크립트 문서 작성**

`frontend/scripts/button-migration/CLAUDE.md` (Task 6 Step 7, Task 8 Step 7에서 발견한 것이 있으면 "자주 틀리는 것"에 더한다):

````markdown
# button-migration — 버튼 인벤토리 · 시안 대조 · before/after

공용 `Button`으로 옮길 자리를 찾고, 시안과 이미 일치하는 자리만 옮긴 뒤, 옮기기 전후 렌더 결과가 같은지 확인한다. 설계는 [`docs/superpowers/specs/2026-10-06-button-design-system-design.md`](../../../docs/superpowers/specs/2026-10-06-button-design-system-design.md).

## 순서

| 단계 | 명령 | 하는 일 | 대장 상태 |
|---|---|---|---|
| ① | `npm run button:inventory` | `src`의 `styled.button`·`styled(Button)`과 사용처를 모아 `sites.json`·`visual-diff/button-inventory/report.md` 생성 | `inventoried` |
| ② | `npm run button:figma-candidates` | 후보 묶음 자리마다 "✳️ 페이지 최종"에서 같은 라벨 노드를 찾아 `visual-diff/button-figma/candidates.md`로 | – |
| ② | (손으로) | `sites.json`에 `figma`·`route`·`figmaViewport`(·`locator.nth`)를 채운다. 시안이 없으면 `status`를 `no-design`으로 | `no-design` |
| ② | `npm run button:figma-match` | 실제 페이지 요소를 시안 노드와 대조 | `figma-match` / `figma-violation` |
| ③ | (손으로) | `figma-match` 자리만 공용 `Button`으로 옮기고 `status`를 `migrated`로 | `migrated` |
| ④ | `npm run button:before-after` | 기준 커밋(`--base`, 기본 `origin/develop-fe`)과 작업 트리를 띄워 비교 | `verified` |

판정기가 같은 커밋끼리 PASS를 내는지는 `npm run button:before-after -- --base HEAD --targets scripts/button-migration/smoke-targets.json`으로 확인한다. 스크립트 단위 테스트는 `npm run test:scripts`(jest가 아니라 `node:test`).

## 전제

- `frontend/.env`: `FIGMA_TOKEN`(②), `DEV_ADMIN_ID`·`DEV_ADMIN_PASSWORD`(②·④의 관리자 화면). Conductor가 브랜치를 옮기면 `.env`가 지워질 수 있다.
- `npx playwright install chromium` 한 번.
- ④는 기준 커밋을 `.context/button-before`에 worktree로 만들고 `npm ci`를 돈다. 같은 커밋이면 다시 쓴다. 지우려면 `--clean`.

## 고칠 때 알아야 할 것

- **판정은 렌더 결과로만 한다.** 정적 시그니처는 묶음 후보를 고르는 데만 쓴다. props 분기·부모 셀렉터·미디어쿼리는 정적으로 다 못 읽는다.
- **`type`은 실효값(`el.type`)으로 비교한다.** 속성값으로 비교하면 이전 때 `type='submit'`을 명시한 정상 자리가 FAIL이 되고, 폼 안에서 submit이 button으로 바뀐 진짜 회귀는 놓친다.
- **트랜지션·애니메이션을 CSS 주입으로 끈다.** 안 끄면 hover 직후 전환 중간값이 잡혀 같은 코드끼리도 FAIL이 난다.
- **양쪽 다 못 찾으면 FAIL이다.** "차이 없음"으로 넘기면 locator 오타가 PASS로 숨는다.
- **before·after 서버는 같은 포트로 차례로 띄운다.** 동시에 띄우면 `node_modules/.vite` 캐시를 서로 덮어쓴다.
- **`/admin/login`은 비로그인 세션으로 연다.** 로그인한 세션이면 `/admin`으로 튕긴다.
- **시안 대조에서 theme에 없는 값은 판정에 넣지 않는다.** "시안과 같은가"와 "토큰이 있는가"는 다른 질문이다. 리포트에만 남기고 이전 PR에서 theme에 추가한다.
- **묶음 키는 hover·미디어쿼리까지 포함한다.** 최상위가 같아도 hover가 다르면 같은 variant가 아니다.
- `sites.json`은 커밋한다. 인벤토리를 다시 돌려도 `route`·`locator`·`figma`·`figmaViewport`·`status`는 보존되고, 시그니처가 바뀐 자리만 `status`가 `inventoried`로 돌아간다.
- 스토리·테스트 파일과 `Button.tsx` 내부의 `StyledButton`은 인벤토리에서 뺀다.

## 자주 틀리는 것

- `locator가 N개에 걸린다`: 같은 라벨 버튼이 화면에 여럿이다. `locator.nth`를 넣는다.
- 라벨이 `null`인 자리: 자식에 표현식이 섞여 있다. `locator`를 `{ "css": "..." }`나 다른 `role`·`name`으로 직접 채운다.
````

- [ ] **Step 2: frontend/CLAUDE.md 갱신**

`## 빌드 및 개발 명령어`의 `# Figma 시안 대조` 블록 바로 아래에 추가:

```bash
# 버튼 이전 (scripts/button-migration/CLAUDE.md)
npm run button:inventory         # 버튼 정의·사용처 인벤토리 → sites.json + 리포트
npm run button:figma-candidates  # 후보 자리의 시안 노드 후보 찾기
npm run button:figma-match       # 자리를 시안과 대조
npm run button:before-after      # 기준 커밋과 작업 트리의 렌더 결과 비교
npm run test:scripts             # 위 스크립트의 node:test 단위 테스트
```

`### 환경 변수`의 `FIGMA_TOKEN` 줄 아래에 추가:

```markdown
- `DEV_ADMIN_ID`·`DEV_ADMIN_PASSWORD` - dev 서버 테스트 관리자 계정. 버튼 before/after·시안 대조가 관리자 화면을 열 때 쓴다 → [`scripts/button-migration/CLAUDE.md`](scripts/button-migration/CLAUDE.md)
```

`## 폴더별 문서 인덱스` 표 마지막 줄 아래에 추가:

```markdown
| 버튼 인벤토리·시안 대조·before/after | [`scripts/button-migration/CLAUDE.md`](scripts/button-migration/CLAUDE.md) |
```

- [ ] **Step 3: 포맷·린트·전체 테스트**

Run:

```bash
cd frontend && ./node_modules/.bin/prettier --write scripts/button-migration scripts/figma-story-diff && npx eslint scripts/button-migration scripts/figma-story-diff && npm run test:scripts && npm test -- --silent && npm run typecheck
```

Expected: eslint 에러 0(경고는 `no-console`만), `test:scripts` 전부 PASS, jest 기존 테스트 PASS, typecheck 통과. prettier가 바꾼 파일이 있으면 Task 1~8 테스트를 다시 돌린다.

- [ ] **Step 4: 기준선 수치 확인**

Run: `cd frontend && npm run button:inventory && cat visual-diff/button-inventory/summary.json`
Expected: `sites`, `signatures`, `candidateClusters`, `candidateSites`, `commonButton.files`, `commonButton.jsx`, `overrides`, `byStatus` 값이 나온다. 이 값이 PR 본문의 기준선이다. 스펙 2절의 측정치(정의 153 등)와 다르면, 차이의 이유를 PR 본문에 한 문장으로 적는다(스토리·테스트 제외, `Button.tsx` 내부 제외 등).

- [ ] **Step 5: 커밋 (사용자 요청 시)**

```bash
git add frontend/scripts/button-migration/CLAUDE.md frontend/CLAUDE.md frontend/scripts/button-migration frontend/scripts/figma-story-diff
git commit -m "docs: 버튼 이전 도구 사용법과 고칠 때 알아야 할 것을 적는다"
```

---

## 이 계획 다음

PR 1이 머지되면 `visual-diff/button-inventory/report.md`의 후보 묶음을 보고 두 번째 계획을 쓴다.
- **PR 2:** Button 스타일 분리, 겉모습 prop의 축 결정, 기존 Button 사용처 전부 before/after. 기존 사용처는 `--targets` 파일로 넘긴다.
- **PR 3~:** 묶음별 이전과 disabled 스토리 비교.
