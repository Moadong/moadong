# Design System Toolkit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디자인 토큰 파이프라인, ESLint 커스텀 룰, GitHub Actions CI를 구축해 UI 일관성 자동 보장

**Architecture:** `tokens/*.json`을 단일 진실 공급원으로 삼고 Style Dictionary로 `src/styles/theme/*.ts`를 자동 생성. ESLint 커스텀 룰이 styled-components 내 하드코딩 색상값을 실시간 감지하고, GitHub Actions가 PR마다 위반 목록을 코멘트로 게시.

**Tech Stack:** style-dictionary@3, ESLint v9 flat config, GitHub Actions

---

## 파일 구조

**생성:**
- `tokens/colors.json` — 색상 토큰 소스 (단일 진실 공급원)
- `tokens/typography.json` — 타이포그래피 토큰 소스
- `config/style-dictionary.config.cjs` — Style Dictionary 커스텀 포매터 + 설정
- `src/eslint-rules/no-hardcoded-design-tokens.js` — ESLint 커스텀 룰
- `src/eslint-rules/no-hardcoded-design-tokens.test.js` — 룰 단위 테스트
- `.github/workflows/design-audit.yml` — PR 자동 audit CI

**수정:**
- `package.json` — `ds:build`, `ds:watch`, `prebuild` 스크립트 + `style-dictionary` devDependency
- `src/styles/theme/colors.ts` — 자동 생성으로 교체 (AUTO-GENERATED 주석 포함)
- `src/styles/theme/typography.ts` — 자동 생성으로 교체 (AUTO-GENERATED 주석 포함)
- `eslint.config.mjs` — `design-system` 플러그인 + `no-hardcoded-tokens` 룰 추가

---

## Phase 1: 토큰 파이프라인

### Task 1: tokens/colors.json 생성

**Files:**
- Create: `tokens/colors.json`

- [ ] **Step 1: `tokens/` 디렉토리 + `colors.json` 생성**

```json
{
  "color": {
    "primary": {
      "900": { "value": "#FF5414" },
      "800": { "value": "#FF7543" },
      "700": { "value": "#FF9F7C" },
      "600": { "value": "#FFDED2" },
      "500": { "value": "#FFECE5" }
    },
    "secondary": {
      "1": {
        "main": { "value": "#FF7DA4" },
        "back": { "value": "#FFF0F4" },
        "tag":  { "value": "#FFEBF1" }
      },
      "2": {
        "main": { "value": "#FFD54A" },
        "back": { "value": "#FFF9E5" },
        "tag":  { "value": "#FFF6D6" }
      },
      "3": {
        "main": { "value": "#5FD8C0" },
        "back": { "value": "#EBFAF7" },
        "tag":  { "value": "#E3FAF5" }
      },
      "4": {
        "main": { "value": "#7094FF" },
        "back": { "value": "#EFF3FF" },
        "tag":  { "value": "#E5ECFF" }
      },
      "5": {
        "main": { "value": "#FFA04D" },
        "back": { "value": "#FFF5E5" },
        "tag":  { "value": "#FFF2DB" }
      },
      "6": {
        "main": { "value": "#C379F6" },
        "back": { "value": "#FAF2FF" },
        "tag":  { "value": "#F7EBFF" }
      }
    },
    "accent": {
      "1": {
        "900": { "value": "#3DBBFF" },
        "800": { "value": "#73CEFF" },
        "700": { "value": "#D9F2FF" },
        "600": { "value": "#E5F6FF" },
        "500": { "value": "#F2FBFF" }
      },
      "2": {
        "900": { "value": "#49D5AD" },
        "500": { "value": "#EBFAF1" }
      },
      "3": {
        "500": { "value": "#FFE8E8" }
      }
    },
    "base": {
      "white": { "value": "#FFFFFF" },
      "black": { "value": "#111111" }
    },
    "gray": {
      "100": { "value": "#F5F5F5" },
      "200": { "value": "#F2F2F2" },
      "300": { "value": "#EBEBEB" },
      "400": { "value": "#DCDCDC" },
      "500": { "value": "#C5C5C5" },
      "600": { "value": "#989898" },
      "700": { "value": "#787878" },
      "800": { "value": "#4B4B4B" },
      "900": { "value": "#3A3A3A" }
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tokens/colors.json
git commit -m "feat(design-system): 색상 토큰 JSON 파일 추가"
```

---

### Task 2: tokens/typography.json 생성

**Files:**
- Create: `tokens/typography.json`

- [ ] **Step 1: `tokens/typography.json` 생성**

타이포그래피는 `size`+`weight` 복합값을 그대로 `value`에 담는다.

```json
{
  "typography": {
    "title": {
      "title1": { "value": { "size": "40px", "weight": 700 } },
      "title2": { "value": { "size": "24px", "weight": 700 } },
      "title3": { "value": { "size": "22px", "weight": 700 } },
      "title4": { "value": { "size": "22px", "weight": 700 } },
      "title5": { "value": { "size": "20px", "weight": 700 } },
      "title6": { "value": { "size": "18px", "weight": 700 } },
      "title7": { "value": { "size": "16px", "weight": 700 } }
    },
    "paragraph": {
      "p1": { "value": { "size": "20px", "weight": 600 } },
      "p2": { "value": { "size": "16px", "weight": 600 } },
      "p3": { "value": { "size": "16px", "weight": 500 } },
      "p4": { "value": { "size": "16px", "weight": 400 } },
      "p5": { "value": { "size": "14px", "weight": 500 } },
      "p6": { "value": { "size": "14px", "weight": 400 } },
      "p7": { "value": { "size": "12px", "weight": 400 } }
    },
    "button": {
      "button1": { "value": { "size": "14px", "weight": 600 } },
      "button2": { "value": { "size": "12px", "weight": 600 } }
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tokens/typography.json
git commit -m "feat(design-system): 타이포그래피 토큰 JSON 파일 추가"
```

---

### Task 3: Style Dictionary 설치 + 커스텀 포매터 설정

**Files:**
- Create: `config/style-dictionary.config.cjs`
- Modify: `package.json`

- [ ] **Step 1: style-dictionary 설치**

```bash
npm install --save-dev style-dictionary@3
```

Expected: `package.json` devDependencies에 `"style-dictionary": "^3.x.x"` 추가됨

- [ ] **Step 2: `config/style-dictionary.config.cjs` 생성**

Style Dictionary 기본 포매터는 flat 출력이지만, 기존 theme 구조는 중첩 객체다.
커스텀 포매터로 기존 형식을 유지한다.

```js
// config/style-dictionary.config.cjs
const StyleDictionary = require('style-dictionary');

/**
 * flat token 목록 -> 중첩 객체 재구성
 * token.path 예: ['color', 'primary', '900'] -> { primary: { '900': '#FF5414' } }
 * 첫 번째 path 세그먼트(카테고리)는 제거한다.
 */
function buildNestedObject(tokens) {
  const result = {};
  tokens.forEach((token) => {
    const parts = token.path.slice(1); // 'color' 또는 'typography' 제거
    let obj = result;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        obj[part] = token.value;
      } else {
        if (!obj[part]) obj[part] = {};
        obj = obj[part];
      }
    });
  });
  return result;
}

StyleDictionary.registerFormat({
  name: 'custom/ts-nested',
  formatter({ dictionary, options }) {
    const outputName = options.outputName;
    const nested = buildNestedObject(dictionary.allTokens);
    const json = JSON.stringify(nested, null, 2);
    return [
      '// WARNING: AUTO-GENERATED. Edit tokens/ instead.',
      `export const ${outputName} = ${json} as const;`,
      '',
    ].join('\n');
  },
});

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    ts: {
      transforms: [], // 값 변환 없음 -- 원본 값 그대로 유지
      buildPath: 'src/styles/theme/',
      files: [
        {
          destination: 'colors.ts',
          format: 'custom/ts-nested',
          filter: (token) => token.path[0] === 'color',
          options: { outputName: 'colors' },
        },
        {
          destination: 'typography.ts',
          format: 'custom/ts-nested',
          filter: (token) => token.path[0] === 'typography',
          options: { outputName: 'typography' },
        },
      ],
    },
  },
};
```

- [ ] **Step 3: `package.json` `scripts` 섹션에 추가**

```json
"ds:build": "style-dictionary build --config config/style-dictionary.config.cjs",
"ds:watch": "style-dictionary build --watch --config config/style-dictionary.config.cjs",
"prebuild": "npm run ds:build"
```

`prebuild`는 `npm run build` 전에 자동 실행된다. 기존 `prebuild` 없음 — 충돌 없이 추가 가능.

- [ ] **Step 4: Commit**

```bash
git add config/style-dictionary.config.cjs package.json package-lock.json
git commit -m "feat(design-system): Style Dictionary 설정 및 커스텀 포매터 추가"
```

---

### Task 4: 파이프라인 실행 + 출력 검증

**Files:**
- Modify: `src/styles/theme/colors.ts` (자동 생성으로 교체)
- Modify: `src/styles/theme/typography.ts` (자동 생성으로 교체)

- [ ] **Step 1: `npm run ds:build` 실행**

```bash
npm run ds:build
```

Expected:
```
style-dictionary build
checkmark  src/styles/theme/colors.ts
checkmark  src/styles/theme/typography.ts
```

- [ ] **Step 2: 색상값 일치 여부 검증**

`src/styles/theme/colors.ts` 첫 줄이 `// WARNING: AUTO-GENERATED.`인지 확인.
`primary["900"]`이 `"#FF5414"`인지 확인.
값이 다르면 `tokens/colors.json`을 수정 후 `npm run ds:build` 재실행.

- [ ] **Step 3: TypeScript 타입 체크**

```bash
npm run typecheck
```

Expected: 에러 없음.
`src/styles/theme/index.ts`의 `export const theme = { colors, typography, transitions }` 구조는 변경 없이 그대로 작동.

- [ ] **Step 4: `lint-results.json` gitignore에 추가**

`.gitignore`에 한 줄 추가 (CI 중간 산출물):
```
lint-results.json
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme/colors.ts src/styles/theme/typography.ts .gitignore
git commit -m "feat(design-system): theme 파일을 Style Dictionary 자동 생성으로 전환"
```

---

## Phase 2: ESLint 커스텀 룰

### Task 5: 룰 테스트 작성 (실패하는 테스트 먼저)

**Files:**
- Create: `src/eslint-rules/no-hardcoded-design-tokens.js` (스켈레톤)
- Create: `src/eslint-rules/no-hardcoded-design-tokens.test.js`

- [ ] **Step 1: 스켈레톤 파일 생성 (아직 동작 안 함)**

`src/eslint-rules/no-hardcoded-design-tokens.js`:

```js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow hardcoded color values in styled-components.' },
    messages: {
      hardcodedColor:
        "Hardcoded color '{{value}}' found. Use theme token instead: {{suggestion}}",
    },
    schema: [],
  },
  create() {
    return {}; // 아직 구현 없음 -- invalid 케이스를 감지하지 못해 테스트 실패
  },
};
```

- [ ] **Step 2: 테스트 파일 생성**

`src/eslint-rules/no-hardcoded-design-tokens.test.js`:

```js
const { RuleTester } = require('eslint');
const rule = require('./no-hardcoded-design-tokens');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-hardcoded-design-tokens', rule, {
  valid: [
    // 테마 토큰 사용 -- 경고 없음
    {
      code: "const B = styled.button`color: ${({ theme }) => theme.colors.primary['900']};`",
    },
    // 색상 아닌 값 -- 경고 없음
    {
      code: 'const B = styled.button`padding: 16px; border-radius: 8px;`',
    },
    // styled-components 아닌 태그드 템플릿 -- 경고 없음
    {
      code: 'const q = gql`query { user { id } }`',
    },
  ],
  invalid: [
    // HEX 색상
    {
      code: 'const B = styled.button`color: #FF5414;`',
      errors: [{ messageId: 'hardcodedColor' }],
    },
    // rgb
    {
      code: 'const B = styled.button`background: rgb(0, 0, 0);`',
      errors: [{ messageId: 'hardcodedColor' }],
    },
    // rgba
    {
      code: 'const B = styled.div`border-color: rgba(255, 84, 20, 0.5);`',
      errors: [{ messageId: 'hardcodedColor' }],
    },
    // styled(Component) 형태
    {
      code: 'const B = styled(Button)`color: #FF5414;`',
      errors: [{ messageId: 'hardcodedColor' }],
    },
    // css 헬퍼
    {
      code: 'const style = css`color: #FF5414;`',
      errors: [{ messageId: 'hardcodedColor' }],
    },
  ],
});

console.log('All tests passed.');
```

- [ ] **Step 3: 테스트 실행 -- 실패 확인**

```bash
npx jest src/eslint-rules/no-hardcoded-design-tokens.test.js --no-coverage
```

Expected: FAIL -- invalid 케이스에서 에러가 보고되지 않아 실패

- [ ] **Step 4: Commit (failing)**

```bash
git add src/eslint-rules/
git commit -m "test(design-system): ESLint 커스텀 룰 테스트 추가 (failing)"
```

---

### Task 6: 룰 구현 + 테스트 통과

**Files:**
- Modify: `src/eslint-rules/no-hardcoded-design-tokens.js`

- [ ] **Step 1: 룰 전체 구현**

`src/eslint-rules/no-hardcoded-design-tokens.js`를 다음으로 교체:

```js
const path = require('path');
const fs = require('fs');

// 감지할 색상 패턴 (matchAll 사용 -- global flag 필수)
const COLOR_PATTERNS = [
  /#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?\b/g,                    // #rrggbb, #rrggbbaa
  /#[0-9a-fA-F]{3}\b/g,                                       // #rgb
  /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+[^)]*\)/g,           // rgb(), rgba()
  /hsla?\s*\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%[^)]*\)/g,   // hsl(), hsla()
];

/**
 * tokens/colors.json에서 hex -> token path 역방향 맵 빌드
 * 예: '#FF5414' -> 'theme.colors.primary["900"]'
 */
function buildReverseMap() {
  try {
    const tokensPath = path.join(process.cwd(), 'tokens', 'colors.json');
    const raw = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    const map = {};

    function traverse(obj, parts) {
      if (obj && typeof obj === 'object' && 'value' in obj) {
        if (typeof obj.value === 'string') {
          const segments = parts.slice(1); // 'color' 제거
          const tokenPath =
            'theme.colors.' +
            segments
              .map((p) => (/^\d/.test(p) ? `["${p}"]` : p))
              .join('.')
              .replace(/\.\[/g, '[');
          map[obj.value.toUpperCase()] = tokenPath;
        }
      } else if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, val]) => {
          traverse(val, [...parts, key]);
        });
      }
    }

    traverse(raw, []);
    return map;
  } catch {
    return {};
  }
}

/**
 * TaggedTemplateExpression의 tag가 styled-components 관련인지 판별
 * - styled.div, styled.button 등 MemberExpression
 * - styled(Component) CallExpression
 * - css, createGlobalStyle, keyframes Identifier
 */
function isStyledTag(node) {
  const { tag } = node;
  if (tag.type === 'MemberExpression') {
    return tag.object && tag.object.name === 'styled';
  }
  if (tag.type === 'CallExpression') {
    const { callee } = tag;
    if (callee.name === 'styled') return true;
    if (
      callee.type === 'MemberExpression' &&
      callee.object &&
      callee.object.name === 'styled'
    )
      return true;
  }
  if (tag.type === 'Identifier') {
    return ['css', 'createGlobalStyle', 'keyframes'].includes(tag.name);
  }
  return false;
}

// 모듈 로드 시 한 번만 빌드
const reverseMap = buildReverseMap();

module.exports = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow hardcoded color values in styled-components.' },
    messages: {
      hardcodedColor:
        "Hardcoded color '{{value}}' found. Use theme token instead: {{suggestion}}",
    },
    schema: [],
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (!isStyledTag(node)) return;

        node.quasi.quasis.forEach((quasi) => {
          const text = quasi.value.raw;
          COLOR_PATTERNS.forEach((pattern) => {
            // matchAll: global 정규식을 안전하게 반복 매칭
            for (const match of text.matchAll(pattern)) {
              const value = match[0];
              const suggestion =
                reverseMap[value.toUpperCase()] ||
                reverseMap[value.toLowerCase()] ||
                'a theme token';
              context.report({
                node: quasi,
                messageId: 'hardcodedColor',
                data: { value, suggestion },
              });
            }
          });
        });
      },
    };
  },
};
```

- [ ] **Step 2: 테스트 실행 -- 통과 확인**

```bash
npx jest src/eslint-rules/no-hardcoded-design-tokens.test.js --no-coverage
```

Expected:
```
PASS src/eslint-rules/no-hardcoded-design-tokens.test.js
All tests passed.
```

- [ ] **Step 3: Commit**

```bash
git add src/eslint-rules/no-hardcoded-design-tokens.js
git commit -m "feat(design-system): ESLint 하드코딩 색상값 감지 룰 구현"
```

---

### Task 7: ESLint config에 룰 등록 + 기존 위반 현황 파악

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: `eslint.config.mjs` 수정**

기존 파일 전체를 다음으로 교체:

```js
import { createRequire } from 'module';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import storybook from 'eslint-plugin-storybook';

// ESM에서 CJS 모듈(커스텀 룰) 로드
const require = createRequire(import.meta.url);
const noHardcodedTokens = require('./src/eslint-rules/no-hardcoded-design-tokens.js');

const config = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'public/**',
      'jest.config.js',
      'jest.setup.ts',
      'netlify.toml',
    ],
  },
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      storybook,
      'design-system': { rules: { 'no-hardcoded-tokens': noHardcodedTokens } },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 기존 위반 전부 수정 완료 후 'error'로 승격
      'design-system/no-hardcoded-tokens': 'warn',
    },
    settings: { react: { version: 'detect' } },
  },
  configPrettier,
];

export default config;
```

- [ ] **Step 2: 기존 위반 현황 파악**

```bash
npm run lint 2>&1 | grep "no-hardcoded-tokens" | wc -l
```

숫자가 출력됨. 0이면 깨끗한 상태. 숫자가 있으면 향후 `warn -> error` 승격 전에 수정할 목록. 지금은 `warn`이므로 빌드/CI를 막지 않음.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "feat(design-system): ESLint config에 no-hardcoded-tokens 룰 등록"
```

---

## Phase 3: GitHub Actions CI

### Task 8: GitHub Actions 워크플로우 생성

**Files:**
- Create: `.github/workflows/design-audit.yml`

참고: 이 레포는 git root가 `moadong/`이고 frontend 코드가 `frontend/` 서브디렉토리에 있다.
워크플로우는 `defaults.run.working-directory: frontend`로 설정한다.

- [ ] **Step 1: `.github/workflows/design-audit.yml` 생성**

```yaml
name: Design System Audit

on:
  pull_request:
    paths:
      - 'frontend/src/**'
      - 'frontend/tokens/**'

jobs:
  design-audit:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build design tokens
        run: npm run ds:build

      - name: Run ESLint (design audit)
        run: npm run lint -- --format json --output-file lint-results.json || true

      - name: Post PR comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const resultsPath = 'frontend/lint-results.json';

            if (!fs.existsSync(resultsPath)) {
              console.log('lint-results.json 없음 -- 스킵');
              return;
            }

            const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
            const violations = results.flatMap((r) =>
              (r.messages || [])
                .filter((m) => m.ruleId === 'design-system/no-hardcoded-tokens')
                .map((m) => {
                  const file = r.filePath.replace(
                    process.env.GITHUB_WORKSPACE + '/frontend/',
                    ''
                  );
                  return `  \`${file}\`:${m.line}  ${m.message}`;
                })
            );

            const body =
              violations.length === 0
                ? 'checkmark **Design System Audit**: 하드코딩 토큰 위반 없음.'
                : [
                    `palette **Design System Audit**: ${violations.length}건의 위반 발견.`,
                    '',
                    '```',
                    ...violations,
                    '```',
                    '',
                    '> 하드코딩된 색상값 대신 `theme` 토큰을 사용해주세요.',
                  ].join('\n');

            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body,
            });
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/design-audit.yml
git commit -m "feat(design-system): GitHub Actions Design System Audit 워크플로우 추가"
```

- [ ] **Step 3: 테스트 PR로 동작 검증**

1. 테스트 브랜치 생성:
   ```bash
   git checkout -b test/design-audit-check
   ```
2. 아무 `*.styles.ts` 파일에 임시 하드코딩 추가:
   ```css
   color: #FF5414;
   ```
3. push 후 PR 오픈, GitHub Actions 탭에서 워크플로우 실행 확인
4. PR 코멘트에 위반 목록 표시 확인
5. 검증 완료 후 임시 변경 되돌리고 브랜치 삭제:
   ```bash
   git checkout develop-fe && git branch -d test/design-audit-check
   ```
