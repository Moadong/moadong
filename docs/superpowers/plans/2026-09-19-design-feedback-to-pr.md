# 디자인 피드백 → PR 자동화 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 디자이너가 실서비스에서 요소를 찍어 남긴 메모가 GitHub 이슈를 거쳐 에이전트가 만든 PR로 이어지게 한다.

**Architecture:** 프론트에 `agentation` 툴바를 `?design=1` 조건으로 lazy 렌더하고, styled-components displayName을 켜서 툴바 출력에 컴포넌트 이름이 남게 한다. `design-feedback` 라벨 이슈가 열리면 GitHub Actions에서 claude-code-action이 `.github/design-feedback-rules.md` 규칙대로 스타일만 고쳐 PR을 연다. 같은 규칙 파일을 읽는 로컬 커맨드를 두어 CI 없이도 시험한다.

**Tech Stack:** React 19, Vite + @vitejs/plugin-react(babel), styled-components 6, agentation 3.x, babel-plugin-styled-components 2.x, jest + testing-library, GitHub Actions + anthropics/claude-code-action@v1.

**Spec:** `docs/superpowers/specs/2026-09-19-design-feedback-to-pr-design.md`

## Global Constraints

- 커밋은 사용자가 명시적으로 요청할 때만 한다. 각 태스크 끝의 "커밋" 단계는 사용자 승인 후 실행한다.
- 브랜치명·PR 규칙: PR은 `feature/#<이슈>-<슬러그>-MOA-<키>` 브랜치에서만 연다. 워크스페이스 브랜치(denver)로 PR을 열지 않는다.
- PR·커밋 메시지에 `Co-Authored-By`, `Generated with` 트레일러를 넣지 않는다.
- 프론트 코드에 수동 `memo`/`useCallback`/`useMemo`를 넣지 않는다(React Compiler 전제). nullable 접근은 옵셔널 체이닝.
- 에이전트 모델은 `claude-opus-5`.
- 툴바는 `isInAppWebView()`가 true면 렌더하지 않는다.
- 일반 사용자 번들(index 청크)에 agentation 코드가 들어가면 안 된다.
- 작업 디렉터리: 프론트 명령은 `frontend/`에서 실행한다.

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `frontend/package.json` | `agentation`, `babel-plugin-styled-components` 의존성 |
| `frontend/config/vite.config.ts` | styled-components displayName babel 플러그인 |
| `frontend/src/constants/storageKeys.ts` | `DESIGN_FEEDBACK` 키 |
| `frontend/src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.tsx` | 쿼리→localStorage 게이트 + lazy `<Agentation />` |
| `frontend/src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.test.tsx` | 게이트 동작 테스트 |
| `frontend/src/App.tsx` | 툴바 마운트 |
| `.github/ISSUE_TEMPLATE/design-feedback.yml` | 디자이너용 이슈 폼 |
| `.github/design-feedback-rules.md` | 에이전트 규칙(단일 진실 원천) |
| `.github/workflows/design-feedback.yml` | 이슈 → 에이전트 → PR |
| `frontend/.claude/commands/design-feedback.md` | 로컬 수동 경로 |

---

### Task 1: styled-components displayName 켜기

**Files:**
- Modify: `frontend/package.json` (devDependencies)
- Modify: `frontend/config/vite.config.ts:27-31`

**Interfaces:**
- Produces: 프로덕션 DOM 클래스에 `BannerContainer-kfzAzD` 형태로 styled 변수명이 남는다. Task 2·5의 요소 찾기가 이 이름에 의존한다.

- [ ] **Step 1: 플러그인 설치**

```bash
cd frontend && npm install -D babel-plugin-styled-components@^2.1.4
```

- [ ] **Step 2: vite 설정에 플러그인 추가**

`frontend/config/vite.config.ts`의 react 플러그인 부분을 아래로 바꾼다. React Compiler가 먼저 돌아야 하므로 순서를 지킨다.

```ts
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', {}],
            // agentation 툴바가 DOM 클래스에서 styled 변수명을 읽을 수 있게 한다.
            // fileName: false — 이름만 붙이고 파일 경로는 붙이지 않아 번들 증가를 줄인다.
            [
              'babel-plugin-styled-components',
              { displayName: true, fileName: false, ssr: false },
            ],
          ],
        },
      }),
```

- [ ] **Step 3: 빌드 전 번들 크기 기록**

플러그인 추가 전 크기를 먼저 잰다. Step 2를 잠시 되돌리지 말고, `git stash`도 쓰지 말고, 아래처럼 develop-fe 기준 빌드를 별도 디렉터리에서 잰다.

```bash
cd frontend && git show origin/develop-fe:frontend/config/vite.config.ts > /tmp/vite.before.ts
npx vite build --config /tmp/vite.before.ts --outDir /tmp/dist-before 2>&1 | grep -E "index-.*\.js" | head -3
```

Expected: `dist/assets/index-<hash>.js  <N> kB │ gzip: <M> kB` 한 줄. `<M>`을 적어 둔다.

- [ ] **Step 4: 플러그인 적용 빌드로 이름 확인**

```bash
cd frontend && npm run build:dev 2>&1 | grep -E "index-.*\.js" | head -3
grep -o "BannerContainer-sc-[a-z0-9]*" dist/assets/index-*.js | head -1
```

Expected: 두 번째 명령이 `BannerContainer-sc-xxxxx`를 출력한다. 첫 명령의 gzip 크기와 Step 3의 크기 차이를 PR 본문용으로 적어 둔다.

- [ ] **Step 5: 타입·린트**

```bash
cd frontend && npm run typecheck && npm run lint
```

Expected: 둘 다 종료 코드 0.

- [ ] **Step 6: 커밋 (사용자 승인 후)**

```bash
git add frontend/package.json frontend/package-lock.json frontend/config/vite.config.ts
git commit -m "chore(frontend): styled-components displayName을 켠다

디자인 피드백 툴바가 DOM 클래스에서 styled 변수명을 읽어 소스 파일을 찾을 수 있게 한다."
```

---

### Task 2: DesignFeedbackToolbar 컴포넌트

**Files:**
- Modify: `frontend/package.json` (dependencies)
- Modify: `frontend/src/constants/storageKeys.ts`
- Create: `frontend/src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.tsx`
- Test: `frontend/src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.test.tsx`

**Interfaces:**
- Consumes: `isInAppWebView()` from `@/utils/isInAppWebView`, `STORAGE_KEYS` from `@/constants/storageKeys`.
- Produces: default export `DesignFeedbackToolbar: () => JSX.Element | null`. Task 3이 App.tsx에 마운트한다.

- [ ] **Step 1: agentation 설치**

프로덕션에서 lazy 로드되므로 devDependencies가 아니라 dependencies다.

```bash
cd frontend && npm install agentation@^3.0.2
```

- [ ] **Step 2: storage key 추가**

`frontend/src/constants/storageKeys.ts`의 `QUERY_CACHE` 줄 아래에 추가한다.

```ts
  /** 디자인 피드백 툴바. `?design=1`로 켜고 `?design=0`으로 끈다 */
  DESIGN_FEEDBACK: 'designFeedback',
```

- [ ] **Step 3: 실패하는 테스트 작성**

`frontend/src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import DesignFeedbackToolbar from './DesignFeedbackToolbar';

jest.mock('agentation', () => ({
  Agentation: () => <div data-testid="agentation" />,
}));

const setSearch = (search: string) => {
  window.history.replaceState({}, '', `/${search}`);
};

const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
};

beforeEach(() => {
  localStorage.clear();
  setSearch('');
  setUserAgent('Mozilla/5.0');
});

describe('DesignFeedbackToolbar', () => {
  it('기본 상태에서는 렌더하지 않는다', () => {
    render(<DesignFeedbackToolbar />);
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
  });

  it('?design=1이면 켜고 localStorage에 남긴다', async () => {
    setSearch('?design=1');
    render(<DesignFeedbackToolbar />);
    expect(await screen.findByTestId('agentation')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK)).toBe('1');
  });

  it('localStorage에 남아 있으면 쿼리가 없어도 켠다', async () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    render(<DesignFeedbackToolbar />);
    expect(await screen.findByTestId('agentation')).toBeInTheDocument();
  });

  it('?design=0이면 끄고 localStorage를 지운다', () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    setSearch('?design=0');
    render(<DesignFeedbackToolbar />);
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK)).toBeNull();
  });

  it('인앱 웹뷰에서는 켜져 있어도 렌더하지 않는다', () => {
    localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
    setUserAgent('MoadongApp/1.5.1');
    render(<DesignFeedbackToolbar />);
    expect(screen.queryByTestId('agentation')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 4: 실패 확인**

```bash
cd frontend && npx jest src/components/common/DesignFeedbackToolbar --coverage=false
```

Expected: FAIL, `Cannot find module './DesignFeedbackToolbar'`.

- [ ] **Step 5: 구현**

`frontend/src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.tsx`:

```tsx
import { lazy, Suspense } from 'react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import isInAppWebView from '@/utils/isInAppWebView';

// 일반 사용자 번들에 들어가지 않게 별도 청크로 분리한다.
const Agentation = lazy(() =>
  import('agentation').then((m) => ({ default: m.Agentation })),
);

// `?design=1`로 켜고 `?design=0`으로 끈다. 쿼리가 없으면 저장된 값을 따른다.
const resolveEnabled = () => {
  const flag = new URLSearchParams(window.location.search).get('design');
  if (flag === '1') localStorage.setItem(STORAGE_KEYS.DESIGN_FEEDBACK, '1');
  if (flag === '0') localStorage.removeItem(STORAGE_KEYS.DESIGN_FEEDBACK);
  return localStorage.getItem(STORAGE_KEYS.DESIGN_FEEDBACK) === '1';
};

const DesignFeedbackToolbar = () => {
  if (isInAppWebView() || !resolveEnabled()) return null;

  return (
    <Suspense fallback={null}>
      <Agentation />
    </Suspense>
  );
};

export default DesignFeedbackToolbar;
```

- [ ] **Step 6: 통과 확인**

```bash
cd frontend && npx jest src/components/common/DesignFeedbackToolbar --coverage=false
```

Expected: 5 passed.

- [ ] **Step 7: 타입·린트**

```bash
cd frontend && npm run typecheck && npm run lint
```

Expected: 종료 코드 0.

- [ ] **Step 8: 커밋 (사용자 승인 후)**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/constants/storageKeys.ts frontend/src/components/common/DesignFeedbackToolbar/
git commit -m "feat(frontend): 디자인 피드백 툴바를 ?design=1로 켠다

agentation 툴바를 lazy 청크로 분리해 일반 사용자 번들에는 들어가지 않는다. 인앱 웹뷰에서는 렌더하지 않는다."
```

---

### Task 3: App.tsx 마운트와 번들 분리 확인

**Files:**
- Modify: `frontend/src/App.tsx:1-17` (import), `frontend/src/App.tsx:96` (JSX)

**Interfaces:**
- Consumes: `DesignFeedbackToolbar` default export (Task 2).

- [ ] **Step 1: import 추가**

`FloatingButtonGroup` import 아래 줄에 추가한다.

```ts
import DesignFeedbackToolbar from '@/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar';
```

- [ ] **Step 2: JSX에 마운트**

`<FloatingButtonGroup />` 바로 아래에 추가한다.

```tsx
              <FloatingButtonGroup />
              <DesignFeedbackToolbar />
```

- [ ] **Step 3: 별도 청크 확인**

```bash
cd frontend && npm run build:dev 2>&1 | grep -iE "agentation|index-.*\.js"
grep -c "agentation" dist/assets/index-*.js
```

Expected: 빌드 출력에 agentation 청크(`agentation-<hash>.js` 또는 `DesignFeedbackToolbar-<hash>.js`)가 따로 있고, `grep -c`는 `0`이다.

- [ ] **Step 4: 브라우저에서 확인**

```bash
cd frontend && npm run dev
```

`http://localhost:3000/?design=1`을 데스크톱 브라우저로 연다. 오른쪽 아래 툴바가 뜬다. 배너 영역을 클릭해 메모를 하나 쓰고 "복사"를 누른 뒤 붙여넣어 본다. 마크다운에 `BannerContainer-` 류 클래스가 있어야 한다. `?design=0`으로 다시 열면 툴바가 사라져야 한다. 확인 후 dev 서버를 끈다.

- [ ] **Step 5: 커밋 (사용자 승인 후)**

```bash
git add frontend/src/App.tsx
git commit -m "feat(frontend): 디자인 피드백 툴바를 앱에 마운트한다"
```

---

### Task 4: 이슈 폼과 라벨

**Files:**
- Create: `.github/ISSUE_TEMPLATE/design-feedback.yml`

**Interfaces:**
- Produces: 라벨 `design-feedback`, 이슈 본문에 `### 🎨 피드백` 섹션과 `### 🎟️ 상위 스토리 (선택)` 섹션. Task 6의 규칙 파일이 이 섹션 이름으로 본문을 읽는다.

- [ ] **Step 1: 라벨 생성**

```bash
gh label create design-feedback --description "디자이너 툴바 피드백. 에이전트가 PR을 만든다" --color FFC0CB
```

Expected: `✓ Label "design-feedback" created`.

- [ ] **Step 2: 이슈 폼 작성**

`.github/ISSUE_TEMPLATE/design-feedback.yml`:

```yaml
name: '디자인 피드백'
description: '실서비스에서 ?design=1 툴바로 복사한 메모를 붙여넣으면 에이전트가 PR을 만듭니다.'
labels: [design-feedback]
title: '[design] '
body:
  - type: markdown
    attributes:
      value: |
        1. `https://moadong.com/?design=1`로 접속하면 오른쪽 아래 툴바가 뜹니다.
        2. 요소를 클릭해 메모를 남기고 "복사"를 누르세요. 여러 개 가능합니다.
        3. 아래에 붙여넣고 제출하면 에이전트가 PR을 열고 이 이슈에 링크를 답니다.
        4. PR의 Vercel 프리뷰에서 확인하세요. 더 고칠 게 있으면 PR 댓글에 적으세요.

  - type: textarea
    id: feedback
    attributes:
      label: '🎨 피드백'
      description: '툴바에서 복사한 내용을 그대로 붙여넣으세요.'
    validations:
      required: true

  - type: input
    id: storyKey
    attributes:
      label: '🎟️ 상위 스토리 (선택)'
      description: '연결할 Jira 스토리 키가 있으면 적으세요 (예: MOA-42).'
      placeholder: 'MOA-42'
    validations:
      required: false
```

- [ ] **Step 3: Jira 워크플로와 충돌 없음 확인**

```bash
grep -n "상위 작업 (Ticket Number)" .github/workflows/create-jira-issue.yml
grep -c "상위 작업 (Ticket Number)" .github/ISSUE_TEMPLATE/design-feedback.yml
```

Expected: 첫 명령은 `if:` 줄을 출력하고, 두 번째는 `0`. 즉 이 폼으로 만든 이슈는 Jira 워크플로를 타지 않는다.

- [ ] **Step 4: 커밋 (사용자 승인 후)**

```bash
git add .github/ISSUE_TEMPLATE/design-feedback.yml
git commit -m "chore(github): 디자인 피드백 이슈 폼을 추가한다"
```

---

### Task 5: 에이전트 규칙 파일

**Files:**
- Create: `.github/design-feedback-rules.md`

**Interfaces:**
- Consumes: 이슈 본문 섹션 이름(Task 4).
- Produces: Task 6 워크플로와 Task 7 로컬 커맨드가 읽는 절차. 환경변수 계약: `ISSUE_NUMBER`(필수), `REPO`(`owner/name`), `PR_BASE`(기본 `develop-fe`).

- [ ] **Step 1: 규칙 파일 작성**

`.github/design-feedback-rules.md`:

````markdown
# 디자인 피드백 처리 규칙

너는 moadong 프론트의 디자인 피드백을 코드로 옮기는 에이전트다. 디자이너가 실서비스에서
툴바로 남긴 메모를 받아 **스타일 값만** 고치고 PR을 연다. 판단이 갈리면 고치지 말고 되묻는다.

입력은 환경변수로 온다. 값을 직접 타이핑하지 말고 항상 환경변수를 써라.
- `ISSUE_NUMBER`: 처리할 이슈 번호
- `REPO`: `owner/name`
- `PR_BASE`: PR base 브랜치 (기본 `develop-fe`)

## 1. 이슈 읽기

```bash
gh issue view "$ISSUE_NUMBER" --repo "$REPO" --json title,body,labels
```

본문에서 `### 🎨 피드백` 아래가 툴바 마크다운이고, `### 🎟️ 상위 스토리 (선택)` 아래가
Jira 키(없으면 `_No response_`)다. 툴바 마크다운은 메모(annotation) 여러 개로 되어 있고,
각 메모에 디자이너 코멘트, 요소 이름, CSS 클래스, DOM 경로, React 컴포넌트, 주변 텍스트,
좌표·크기, 뷰포트 크기가 붙어 있다.

## 2. 요소 → 소스 찾기

메모마다 아래 순서로 `frontend/src`를 grep한다. 먼저 맞는 단서로 후보가 하나로 좁혀지면 멈춘다.

1. CSS 클래스 중 `<이름>-sc-<해시>` 패턴의 `<이름>`. `export const <이름> = styled` 로 grep.
2. React 컴포넌트 이름. `const <이름> = ` 또는 `function <이름>` 으로 grep.
3. 주변 텍스트(한글 문구). 문자열 리터럴로 grep.
4. DOM 경로의 태그 순서와 JSX 구조 대조.

**후보 파일이 정확히 하나일 때만 수정한다.** 둘 이상이거나 없으면 그 메모는 건드리지 않고
4절의 되묻기 댓글에 후보 목록과 함께 적는다. 추측으로 고치지 않는다.

## 3. 바꿀 수 있는 것

- 허용: `margin` `padding` `gap` `width` `height` `max-width` `min-height` `font-size`
  `font-weight` `line-height` `letter-spacing` `color` `background` `border` `border-radius`
  `opacity` `align-items` `justify-content` `text-align` `order` `z-index` `transform`(translate만).
- 금지: 로직, 데이터 흐름, 컴포넌트 분리·합치기, 새 컴포넌트, props 추가, 조건부 렌더 변경,
  JSX 구조 변경, 텍스트 문구 변경. 메모가 이를 요구하면 그 메모는 고치지 않고 4절 댓글에
  "개발 작업으로 넘긴다"고 적는다.
- `@/styles/theme`에 같은 값의 토큰(색·간격·폰트)이 있으면 리터럴 대신 토큰을 쓴다.
  없으면 리터럴을 쓰고 토큰을 새로 만들지 않는다.
- 반응형: 메모의 뷰포트 너비를 기준으로, 미디어쿼리가 있으면 그 너비가 속한 블록만 고친다.
  다른 브레이크포인트 블록은 건드리지 않는다.
- 변경 파일 수는 메모 수 이하여야 한다. 넘으면 멈추고 4절 댓글로 설명한다.
- 메모와 무관한 줄은 한 글자도 바꾸지 않는다. 포맷팅·인접 코드 정리 금지.

## 4. 되묻기 · 거부 댓글

고치지 못한 메모가 하나라도 있으면 아래 형식으로 이슈에 댓글을 단다. 고칠 수 있는 메모는
그대로 진행한다(부분 PR 허용).

```bash
gh issue comment "$ISSUE_NUMBER" --repo "$REPO" --body "$BODY"
```

- 후보가 여럿: "메모 N은 다음 파일 중 어디인지 골라 주세요: (목록)"
- 못 찾음: "메모 N의 요소를 소스에서 찾지 못했어요. 페이지 URL과 화면 캡처를 이슈에 더해 주세요."
- 금지 항목: "메모 N은 (이유) 개발 작업이라 이 자동화에서는 다루지 않아요. 개발자에게 넘길게요."

모든 댓글은 한국어 해요체.

## 5. 검증

```bash
cd frontend && npm run typecheck && npm run lint
```

둘 중 하나라도 실패하면 PR을 열지 않는다. 변경을 되돌리고(`git checkout -- .`) 이슈에
실패 원인을 3줄 이내로 댓글 단다.

## 6. 브랜치 · PR

고친 메모가 하나 이상이고 검증을 통과했을 때만 한다.

```bash
git config user.name "harry"
git config user.email "harry@users.noreply.github.com"
git fetch origin "$PR_BASE"
git checkout -b "$BRANCH" "origin/$PR_BASE"
```

- `$BRANCH`는 `design/#<ISSUE_NUMBER>-<영문슬러그>`. 슬러그는 첫 메모의 요지를 영어 소문자
  하이픈 3~5단어로. 상위 스토리 키가 있으면 `-MOA-<번호>`를 뒤에 붙인다.
- 브랜치는 반드시 `origin/$PR_BASE`에서 깨끗하게 딴다. 수정은 브랜치를 딴 뒤에 적용한다
  (수정을 먼저 했다면 `git stash`를 쓰지 말고 diff를 파일로 저장했다가 `git apply`한다).
- 커밋 메시지: `style(<영역>): <메모 요지 한 줄>`. 트레일러(`Co-Authored-By` 등) 금지.
- PR:

```bash
gh pr create --repo "$REPO" --base "$PR_BASE" --title "[design] <메모 요지 한 줄>" --body "$PR_BODY"
```

PR 본문 형식:

```
Closes #<ISSUE_NUMBER>

## 메모 → 변경
| 메모 | 파일:줄 | 전 → 후 |
|---|---|---|
| 배너 제목 8px 왼쪽 | frontend/src/pages/MainPage/components/Banner/Banner.styles.ts:41 | margin-left: 24px → 16px |

## 뷰포트
<너비>×<높이> (메모에 적힌 값)

## 처리하지 않은 메모
(없으면 "없음". 있으면 4절 댓글과 같은 내용 요약)
```

- PR을 연 뒤 이슈에 댓글: "PR을 열었어요: <PR URL>. Vercel 프리뷰 댓글이 PR에 달리면 거기서 확인해 주세요."
````

- [ ] **Step 2: 형식 점검**

```bash
grep -c "^## " .github/design-feedback-rules.md
```

Expected: `6`.

- [ ] **Step 3: 커밋 (사용자 승인 후)**

```bash
git add .github/design-feedback-rules.md
git commit -m "chore(github): 디자인 피드백 에이전트 규칙을 적는다"
```

---

### Task 6: 워크플로

**Files:**
- Create: `.github/workflows/design-feedback.yml`

**Interfaces:**
- Consumes: 규칙 파일(Task 5) 환경변수 계약, harry App 시크릿 `HARRY_APP_ID`·`HARRY_APP_PRIVATE_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`.

- [ ] **Step 1: 워크플로 작성**

`.github/workflows/design-feedback.yml`:

```yaml
name: Design feedback → PR

on:
  issues:
    types: [opened, labeled]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  design-feedback:
    # 디자이너 툴바 피드백 이슈만 처리한다.
    # - 라벨 design-feedback이 있어야 한다.
    # - 조직 멤버가 연 이슈만: 외부인이 이슈로 프롬프트 인젝션 + 쓰기 권한을 얻는 걸 막는다.
    # - labeled 이벤트는 그 라벨이 붙었을 때만: 다른 라벨 추가로 중복 실행되지 않게 한다.
    if: >-
      ${{ contains(github.event.issue.labels.*.name, 'design-feedback')
      && contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.issue.author_association)
      && (github.event.action == 'opened' || github.event.label.name == 'design-feedback') }}
    # 같은 이슈를 다시 라벨링해 재실행할 때 브랜치 push가 겹치지 않게 직렬화한다.
    concurrency: design-feedback-${{ github.event.issue.number }}
    runs-on: ubuntu-latest
    steps:
      - name: Generate harry App token
        id: app-token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.HARRY_APP_ID }}
          private-key: ${{ secrets.HARRY_APP_PRIVATE_KEY }}

      - name: Checkout develop-fe
        uses: actions/checkout@v4
        with:
          ref: develop-fe
          fetch-depth: 0
          token: ${{ steps.app-token.outputs.token }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Apply design feedback
        uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          prompt: |
            저장소 루트의 `.github/design-feedback-rules.md`를 읽고, 그 절차를 처음부터 끝까지
            그대로 따라라. 대상 이슈 번호·레포·base 브랜치는 환경변수 $ISSUE_NUMBER, $REPO,
            $PR_BASE로 주어진다. 셸 명령에서는 값을 직접 타이핑하지 말고 항상 환경변수를 써라.
          claude_args: |
            --model claude-opus-5
            --allowedTools Read,Edit,Write,Glob,Grep,Bash
        env:
          CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
          ISSUE_NUMBER: ${{ github.event.issue.number }}
          REPO: ${{ github.repository }}
          PR_BASE: develop-fe
```

- [ ] **Step 2: YAML 문법 확인**

```bash
npx --yes yaml-lint .github/workflows/design-feedback.yml 2>&1 | tail -1
```

Expected: 오류 없음. (`yaml-lint`가 없으면 `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/design-feedback.yml'))"`로 대체.)

- [ ] **Step 3: harry 워크플로와 시크릿 이름 대조**

```bash
grep -o "secrets\.[A-Z_]*" .github/workflows/design-feedback.yml | sort -u
grep -o "secrets\.[A-Z_]*" .github/workflows/harry-review.yml | sort -u
```

Expected: 첫 목록이 두 번째 목록의 부분집합.

- [ ] **Step 4: 커밋 (사용자 승인 후)**

```bash
git add .github/workflows/design-feedback.yml
git commit -m "ci: 디자인 피드백 이슈를 에이전트가 PR로 만든다"
```

---

### Task 7: 로컬 커맨드

**Files:**
- Create: `frontend/.claude/commands/design-feedback.md`

**Interfaces:**
- Consumes: 규칙 파일(Task 5). 이슈 번호 없이도 돌 수 있게 브랜치명 규칙만 덮어쓴다.

- [ ] **Step 1: 커맨드 작성**

`frontend/.claude/commands/design-feedback.md`:

```markdown
디자인 피드백 툴바 마크다운을 받아 `.github/design-feedback-rules.md` 절차대로 스타일을 고치고 PR을 연다.
CI 워크플로(`design-feedback.yml`)와 같은 규칙을 로컬에서 돌리는 수동 경로다.

## 입력

1. 이슈 번호가 있으면: "이슈 번호를 입력해주세요 (없으면 Enter)". 있으면 `ISSUE_NUMBER`로 쓰고 규칙 1절대로 `gh issue view`로 본문을 가져온다.
2. 없으면: "툴바에서 복사한 마크다운을 붙여넣어주세요". 붙여넣은 내용을 이슈 본문의 `### 🎨 피드백` 섹션으로 간주한다.

## 실행

- 레포 루트의 `.github/design-feedback-rules.md`를 읽고 2절부터 6절까지 그대로 따른다.
- 환경변수 대신 아래 값을 쓴다: `REPO`=`Moadong/moadong`, `PR_BASE`=`develop-fe`.
- 이슈 번호가 없으면 4절의 이슈 댓글은 달지 말고 그 내용을 사용자에게 출력한다. 브랜치명은 `design/<YYYYMMDD>-<슬러그>`, PR 본문의 `Closes #` 줄은 뺀다.
- 브랜치를 따기 전에 `git status`가 깨끗한지 확인한다. 깨끗하지 않으면 멈추고 사용자에게 알린다.
- 커밋과 PR 생성 전에 diff를 보여 주고 사용자 확인을 받는다.
```

- [ ] **Step 2: 드라이런**

Claude Code에서 `/design-feedback`을 실행하고 이슈 번호 없이 아래 마크다운을 붙여넣는다.

```
## Annotation 1
**Comment:** 배너 제목을 8px 왼쪽으로
**Element:** h2
**Classes:** BannerTitle-sc-1a2b3c
**React:** Banner > BannerTitle
**Nearby text:** 이번 주 인기 동아리
**Viewport:** 1440×900
```

Expected: 에이전트가 `Banner.styles.ts`의 `BannerTitle` 하나만 후보로 잡고 diff를 보여 준다. `git status`를 확인해 다른 파일이 바뀌지 않았는지 본다. 확인 후 diff는 `git checkout -- frontend/src`로 되돌린다. (클래스 이름이 실제와 다르면 Task 3 Step 4에서 복사한 실제 마크다운을 쓴다.)

- [ ] **Step 3: 거부 경로 드라이런**

같은 커맨드에 아래를 넣는다.

```
## Annotation 1
**Comment:** 이 버튼 누르면 모달 대신 새 페이지로 가게 해줘
**Element:** button
**Classes:** ApplyButton-sc-9z8y7x
**Viewport:** 1440×900
```

Expected: 파일을 바꾸지 않고 "개발 작업이라 이 자동화에서는 다루지 않아요"류 안내를 출력한다.

- [ ] **Step 4: 커밋 (사용자 승인 후)**

```bash
git add frontend/.claude/commands/design-feedback.md
git commit -m "chore(frontend): 디자인 피드백 로컬 커맨드를 추가한다"
```

---

### Task 8: 종단 검증과 PR

**Files:** 없음(검증만)

- [ ] **Step 1: 브랜치 규칙에 맞는 이슈·브랜치 준비**

이 작업 자체의 PR을 위한 GitHub 이슈(Jira 폼)를 만들고, 담당자는 seongwon030, 브랜치는 `feature/#<번호>-design-feedback-to-pr-MOA-<키>`로 한다. 워크스페이스 브랜치에서 그 브랜치로 커밋을 옮긴다.

- [ ] **Step 2: 전체 테스트**

```bash
cd frontend && npx prettier --check "**/*.{ts,tsx,js,jsx,css,scss}" && npm run typecheck && npm run lint && npx jest --coverage=false
```

Expected: 모두 종료 코드 0.

- [ ] **Step 3: PR 생성 (사용자 승인 후)**

base `develop-fe`, 제목 `[feature] 디자인 피드백 툴바와 이슈→PR 자동화`. 본문에 Task 1 Step 3·4의 번들 gzip 전후 크기, 디자이너 사용 절차 4줄, 머지 후 할 일(아래 Step 4)을 적는다.

- [ ] **Step 4: 머지 후 종단 시험 (사용자가 수행)**

1. develop-fe에 머지되어 Vercel에 배포된 뒤 `https://<develop-fe 배포 URL>/?design=1`에서 툴바가 뜨는지 본다.
2. 디자인 피드백 이슈 폼으로 테스트 이슈를 하나 연다. Actions 탭에서 `Design feedback → PR`이 돌고 PR과 이슈 댓글이 생기는지 본다.
3. 조직 외 계정으로 같은 폼의 이슈를 열어 워크플로가 스킵되는지 본다(가능하면).
