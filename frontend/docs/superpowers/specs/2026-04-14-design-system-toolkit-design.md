# Design System Toolkit — 설계 문서

**날짜**: 2026-04-14  
**작성자**: seongwon seo  
**상태**: 승인됨

---

## 배경 및 목표

### 문제

- 코드베이스 전반에 하드코딩된 색상값(`#3B82F6`, `rgb(...)` 등)이 산재해 있어 UI 일관성 유지가 어렵다.
- 디자인 토큰이 TypeScript 파일로만 관리되어 단일 진실 공급원(single source of truth)이 불명확하다.
- 토큰 위반을 감지하는 자동화 수단이 없어 코드 리뷰에서 사람이 직접 확인해야 한다.

### 목표

1. 디자인 토큰을 JSON 파일로 중앙 관리하고, 빌드 시 TypeScript 파일로 자동 변환한다.
2. ESLint 커스텀 룰로 하드코딩된 값을 개발 중 실시간 감지한다.
3. GitHub Actions로 PR마다 토큰 위반을 자동으로 리포트한다.

### 범위 외 (이번 버전)

- Figma API 직접 연동 (향후 확장)
- AI 기반 컴포넌트 코드 자동 생성 (향후 확장)
- 간격(spacing), 그림자(shadow) 등 색상 외 토큰의 ESLint 룰 (향후 확장)

---

## 아키텍처

```
[tokens/]                  ← 단일 진실 공급원 (JSON)
    ├── colors.json
    ├── typography.json
    └── spacing.json
          ↓
[Style Dictionary]         ← 빌드 타임 변환 (npm run ds:build)
          ↓
[src/styles/theme/]        ← 자동 생성 (직접 편집 금지)
    ├── colors.ts  ✦ generated
    ├── typography.ts  ✦ generated
    └── index.ts
          ↓
[ESLint custom rule]       ← 개발 중 실시간 위반 감지
          ↓
[GitHub Actions]           ← PR마다 audit 결과 코멘트
```

**핵심 원칙**:

- `tokens/`가 단일 진실 공급원. 토큰 수정 시 반드시 JSON 파일만 수정.
- 기존 styled-components + ThemeProvider 사용 방식은 변경 없음.
- 3단계를 독립적으로 배포 가능 — 1단계만 완료해도 팀에 가치가 있음.

---

## 1단계: 토큰 파이프라인 (Style Dictionary)

### 파일 구조

```
tokens/
├── colors.json
├── typography.json
└── spacing.json

config/
└── style-dictionary.config.js

src/styles/theme/         ← Style Dictionary 출력 (기존 경로 유지)
├── colors.ts             ← ⚠️ AUTO-GENERATED. Edit tokens/ instead.
├── typography.ts         ← ⚠️ AUTO-GENERATED. Edit tokens/ instead.
├── transitions.ts        ← 수동 관리 (애니메이션은 토큰화 범위 외)
└── index.ts
```

### 토큰 JSON 형식

```json
// tokens/colors.json
{
  "color": {
    "primary": { "value": "#3B82F6", "type": "color" },
    "primary-hover": { "value": "#2563EB", "type": "color" },
    "text-default": { "value": "#111827", "type": "color" },
    "text-muted": { "value": "#6B7280", "type": "color" },
    "background": { "value": "#FFFFFF", "type": "color" },
    "border": { "value": "#E5E7EB", "type": "color" }
  }
}
```

### Style Dictionary 설정

```js
// config/style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    ts: {
      transformGroup: 'js',
      buildPath: 'src/styles/theme/',
      files: [
        {
          destination: 'colors.ts',
          format: 'javascript/es6',
          filter: { type: 'color' },
        },
        {
          destination: 'typography.ts',
          format: 'javascript/es6',
          filter: { type: 'typography' },
        },
      ],
    },
  },
};
```

### npm 스크립트

```json
{
  "ds:build": "style-dictionary build --config config/style-dictionary.config.js",
  "ds:watch": "style-dictionary build --watch --config config/style-dictionary.config.js",
  "prebuild": "npm run ds:build"
}
```

`prebuild` 훅으로 `npm run build` 전에 자동 실행. (기존 `prebuild` 훅 없음 — 충돌 없이 추가 가능)

### 마이그레이션 전략

1. 기존 `src/styles/theme/colors.ts` 값을 `tokens/colors.json`으로 이관
2. Style Dictionary로 동일한 `colors.ts` 재생성 (출력 검증)
3. 기존 파일 상단에 `// ⚠️ AUTO-GENERATED. Edit tokens/ instead.` 주석 추가
4. `.gitignore`에 추가하지 않음 — 생성 파일도 git에 포함해 CI 없이도 팀이 바로 사용 가능

---

## 2단계: ESLint 커스텀 룰

### 감지 대상

styled-components 템플릿 리터럴 내부의 하드코딩된 색상값:

- HEX: `#rgb`, `#rrggbb`, `#rrggbbaa`
- RGB/RGBA: `rgb(...)`, `rgba(...)`
- HSL/HSLA: `hsl(...)`, `hsla(...)`
- Named colors: `red`, `blue` 등 CSS 색상 키워드

```tsx
// ❌ 위반 — ESLint 경고
const Button = styled.button`
  color: #3b82f6;
  background: rgb(0, 0, 0);
`;

// ✅ 통과
const Button = styled.button`
  color: ${({ theme }) => theme.colors.primary};
`;
```

### 구현

```
src/eslint-rules/
└── no-hardcoded-design-tokens.js
```

- AST에서 `TaggedTemplateExpression` (styled-components) 탐지
- 템플릿 리터럴 문자열에서 색상 패턴 정규식 매칭
- 위반 시 토큰 역매핑으로 자동 제안 (`#3B82F6` → `theme.colors.primary`)
- `tokens/colors.json`을 읽어 제안 목록 동적 생성

### ESLint 설정

```js
// eslint.config.mjs  ← 프로젝트 기존 파일에 추가
import noHardcodedTokens from './src/eslint-rules/no-hardcoded-design-tokens.js';

export default [
  {
    plugins: {
      'design-system': { rules: { 'no-hardcoded-tokens': noHardcodedTokens } },
    },
    rules: {
      'design-system/no-hardcoded-tokens': 'warn', // 안정화 후 'error'로 승격
    },
  },
];
```

### 에러 메시지 형식

```
Hardcoded color '#3B82F6' found. Use theme token instead: theme.colors.primary
```

---

## 3단계: GitHub Actions CI

### 워크플로우

```yaml
# .github/workflows/design-audit.yml
name: Design System Audit

on:
  pull_request:
    paths:
      - 'src/**'
      - 'tokens/**'

jobs:
  design-audit:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run ds:build

      - name: Run ESLint (design tokens audit)
        id: lint
        run: npm run lint -- --format json --output-file lint-results.json || true

      - name: Post PR comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('lint-results.json', 'utf8'));
            const violations = results
              .flatMap(r => r.messages
                .filter(m => m.ruleId === 'design-system/no-hardcoded-tokens')
                .map(m => `  ${r.filePath.replace(process.cwd(), '')}:${m.line}  ${m.message}`)
              );

            const body = violations.length === 0
              ? '✅ **Design System Audit**: No hardcoded token violations found.'
              : `🎨 **Design System Audit**: ${violations.length} violation(s) found.\n\n\`\`\`\n${violations.join('\n')}\n\`\`\``;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body
            });
```

### PR 코멘트 예시

```
🎨 Design System Audit: 3 violation(s) found.

  /src/pages/MainPage/components/ClubCard/ClubCard.styles.ts:12  Hardcoded color '#3B82F6'. Use theme.colors.primary
  /src/components/common/Modal/Modal.styles.ts:34  Hardcoded color '#111827'. Use theme.colors.text-default
  /src/pages/AdminPage/components/SideBar/SideBar.styles.ts:8  Hardcoded color '#E5E7EB'. Use theme.colors.border
```

---

## 구현 순서

```
Phase 1: 토큰 파이프라인          ~3일
  ├── tokens/ 디렉토리 + JSON 파일 작성
  ├── Style Dictionary 설치 및 설정
  ├── 기존 theme 파일 마이그레이션
  └── npm 스크립트 연결 + prebuild 훅

Phase 2: ESLint 커스텀 룰         ~3일
  ├── AST 기반 룰 작성
  ├── 토큰 역매핑 제안 로직
  ├── ESLint config 연결
  └── 기존 위반 목록 확인 (warn으로 시작)

Phase 3: GitHub Actions            ~1일
  ├── 워크플로우 파일 작성
  ├── PR 코멘트 스크립트 작성
  └── 테스트 PR로 동작 검증
```

---

## Figma 연동 전략

토큰 파이프라인은 입력이 JSON이면 출처에 무관하게 동작하도록 설계되어 있다. Figma 연동은 파이프라인의 전제조건이 아니며, 단계적으로 도입한다.

### 현재 상태 진단 기준

| Figma 상태              | 대응 방법                              |
| ----------------------- | -------------------------------------- |
| Variables/Styles 미정의 | 코드에서 역추출 → `tokens/*.json` 작성 |
| Styles만 있음           | Tokens Studio 플러그인으로 내보내기    |
| Variables까지 있음      | Figma Variables API 자동 동기화        |

### 단계별 전략

**Phase 0 (지금)**: 코드 역추출

현재 `src/styles/theme/colors.ts`, `typography.ts`에 이미 정의된 값을 `tokens/*.json`으로 이관. Figma 연동 없이 파이프라인 먼저 구축.

```
코드(theme/*.ts) → tokens/*.json → Style Dictionary → theme/*.ts (자동 생성)
```

**Phase 1 (파이프라인 안정화 후)**: Tokens Studio 반자동 연동

디자이너가 Figma에 Styles/Variables를 정의하면, [Tokens Studio](https://tokens.studio/) 플러그인으로 `tokens.json` 내보내기. 수동이지만 디자이너 주도로 동기화 가능.

```
Figma (Tokens Studio) → tokens/*.json export → PR → ds:build
```

**Phase 2 (선택)**: Figma Variables API 자동화

Figma Professional 플랜 이상에서 Variables API 사용 가능. `scripts/sync-figma-tokens.js` 스크립트로 완전 자동화.

```bash
# Personal Access Token 필요
FIGMA_TOKEN=xxx FILE_ID=yyy npm run ds:figma-sync
```

```
Figma Variables API → scripts/sync-figma-tokens.js → tokens/*.json → ds:build
```

### 핵심 원칙

- **파이프라인 입력 포맷(JSON)은 고정** — Figma 연동 방식이 바뀌어도 이후 과정은 변경 없음
- **디자이너와의 싱크 시점**: 파이프라인이 작동하기 시작하면 디자이너에게 Figma Styles/Variables 정의 요청. 코드 기준 토큰을 Figma에 역으로 반영하는 것도 가능.

---

## 향후 확장 가능성

- **AI 코드 생성**: Claude API로 토큰 스펙 기반 컴포넌트 초안 생성
- **spacing/shadow 룰**: ESLint 룰을 색상 외 토큰으로 확장
- **토큰 사용 리포트**: 각 토큰이 몇 곳에서 쓰이는지 통계 생성

---

## 성공 기준

- [ ] `npm run ds:build` 실행 시 `tokens/*.json` → `src/styles/theme/*.ts` 변환 성공
- [ ] 하드코딩된 색상값에 ESLint 경고가 표시됨
- [ ] PR 오픈 시 GitHub Actions가 자동으로 위반 목록을 코멘트로 남김
- [ ] 기존 `ThemeProvider` 기반 코드가 마이그레이션 후에도 정상 동작
