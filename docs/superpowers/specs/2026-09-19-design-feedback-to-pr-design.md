# 디자인 피드백 → PR 자동화 설계

작성일: 2026-09-19
대상 레포: `Moadong/moadong` (frontend + .github)

## 1. 목표

디자이너가 **브라우저만으로** 실서비스 화면의 요소를 찍고 "8px 왼쪽으로", "글자 키워줘" 같은 메모를 남기면, 에이전트가 코드를 고쳐 PR을 올린다. 디자이너는 Vercel 프리뷰에서 결과를 눈으로 확인하고, 개발자가 리뷰·머지한다.

핵심은 "디자이너의 안목이 프롬프트를 거쳐 코드로 직접 반영"되는 것이다. 요소 특정의 정확도를 자연어에만 맡기지 않고, 주석 툴바가 붙이는 컴포넌트 이름·클래스·좌표를 함께 보낸다.

## 2. 결정 사항 요약

| 항목 | 결정 | 근거 |
|---|---|---|
| 디자이너 환경 | 브라우저만. 레포·Node·Claude Code 없음 | 사용자 확인 |
| 주석 대상 화면 | 실서비스(moadong.com) | 페이지 맥락 안에서 느끼는 피드백이라서. Storybook은 스토리 있는 컴포넌트만 보임 |
| 주석 도구 | `agentation` 패키지의 `<Agentation />` 툴바 | 요소 클릭 → 메모 → 마크다운 복사. React 컴포넌트 이름·DOM 경로·클래스·좌표·주변 텍스트를 자동 첨부 |
| 브라우저 → CI 전달 | 툴바 "복사" → GitHub 이슈 폼에 붙여넣기 | 브라우저에 토큰을 두지 않아도 되고 프론트 레포만 만짐. 나중에 `webhookUrl`로 직접 전송 승격 가능 |
| 에이전트 실행 위치 | GitHub Actions, `anthropics/claude-code-action@v1` | harry 리뷰봇과 같은 인프라. 새 시크릿 없음 |
| 봇 정체성 | harry GitHub App 토큰 재사용 | PR·댓글 작성자가 `reviewer-harry[bot]` |
| 트리거 | `issues: [opened, labeled]` + 라벨 `design-feedback` + 작성자 OWNER/MEMBER/COLLABORATOR | 프롬프트 인젝션 방어. 디자이너는 조직 멤버(확인됨) |
| 툴바 노출 조건 | `?design=1` 쿼리로 켜고 localStorage에 유지, `?design=0`으로 끔. 인앱 웹뷰 제외 | 툴바는 읽기 전용이라 공개돼도 보안 위험 없음. 관리자 로그인 조건은 후속 옵션 |
| 번들 영향 | `React.lazy`로 분리. 일반 사용자 번들에 agentation 청크 없음 | |
| styled-components 이름 | `babel-plugin-styled-components` displayName 켬 | 툴바가 fiber에서 뽑는 이름이 `styled.div`로 나오는 문제 해결. 번들 증가량은 구현 때 측정해 PR에 기록 |
| 규칙 위치 | `.github/design-feedback-rules.md` | harry-review-rules.md와 같은 구조. 워크플로 YAML 안 건드리고 규칙만 수정 |
| 로컬 경로 | `.claude/skills/design-feedback/` 스킬이 같은 규칙 파일을 읽음 | CI 배포 전 규칙 시험, CI 장애 시 수동 경로 |

## 3. 전체 흐름

1. 디자이너가 `moadong.com/?design=1`로 접속한다. 오른쪽 아래 툴바가 뜬다.
2. 요소를 클릭해 메모를 단다. 여러 개 가능. "복사"를 누르면 마크다운이 클립보드에 들어간다.
3. GitHub에서 "디자인 피드백" 이슈 폼을 열고 붙여넣는다. 라벨 `design-feedback`이 자동으로 붙는다.
4. 워크플로가 라벨을 보고 에이전트를 띄운다. 에이전트는 develop-fe에서 브랜치를 따고 규칙에 맞게 코드를 고쳐 PR을 연다.
5. Vercel이 PR에 프리뷰 URL을 댓글로 단다. 에이전트는 이슈에 "PR 열었음 + PR 링크" 댓글을 남긴다.
6. 디자이너가 프리뷰에서 확인한다. 추가 수정은 PR 댓글에 쓴다. 개발자가 리뷰·머지한다.

harry 리뷰봇은 base가 main이 아닌 PR에 자동으로 붙으므로 그대로 동작한다.

## 4. 만들 파일

### 4.1 프론트 (`frontend/`)

- `package.json`: `agentation` (devDependencies 아님. 프로덕션에서 lazy 로드되므로 dependencies), `babel-plugin-styled-components`. agentation은 PolyForm Shield 1.0.0(비OSS, 경쟁 제품 제작 금지)이며 프로덕션에 95 kB gzip 청크로 배포된다. 툴바를 켠 사용자만 받는다. 내부 도구 용도라 허용.
- `config/vite.config.ts`: react 플러그인의 babel plugins에 `['babel-plugin-styled-components', { displayName: true, fileName: true, ssr: false }]` 추가. `fileName: true`라야 `Container`(72곳)처럼 겹치는 변수명이 `Headerstyles__Container`로 파일별로 구분된다. `ssr: false`는 componentId를 빼서 번들 증가를 줄인다. 실측 index 청크 gzip: 기준 159.57 kB → fileName:false 160.43 → fileName:true 162.06 → fileName:true+ssr 165.47. 채택은 162.06.
- `src/components/common/DesignFeedbackToolbar/DesignFeedbackToolbar.tsx` (신규):
  - `?design=1`이면 localStorage `STORAGE_KEYS.DESIGN_FEEDBACK`에 `'1'` 저장, `?design=0`이면 삭제.
  - 저장값이 `'1'`이고 `isInAppWebView()`가 false일 때만 `React.lazy(() => import('agentation'))`로 `<Agentation />` 렌더. `Suspense` fallback은 null.
  - 툴바 자체 설정(다크모드 등)은 건드리지 않는다.
- `src/constants/storageKeys.ts`: 키 하나 추가.
- `src/App.tsx`: `<FloatingButtonGroup />` 옆에 `<DesignFeedbackToolbar />` 한 줄.

### 4.2 GitHub (`.github/`)

- `ISSUE_TEMPLATE/design-feedback.yml`: 라벨 `design-feedback` 자동 부여. 필드는 두 개.
  - `feedback` (textarea, 필수): 툴바에서 복사한 마크다운 붙여넣기.
  - `storyKey` (input, 선택): 상위 Jira 스토리 키(MOA-xx). 있으면 브랜치명 끝에 붙인다.
  - 기존 `create-jira-issue.yml`은 본문에 "🎟️ 상위 작업 (Ticket Number)"가 있을 때만 돌므로 이 폼과 충돌하지 않는다.
- `workflows/design-feedback.yml`:
  - 트리거 `issues: [labeled]`만. 폼이 라벨을 자동으로 붙이므로 `opened`까지 걸면 같은 이슈가 두 번 돈다. `if`: 붙은 라벨이 `design-feedback` + `author_association`이 OWNER/MEMBER/COLLABORATOR. `timeout-minutes: 30`.
  - `concurrency: design-feedback-${{ issue.number }}`로 같은 이슈 재실행 직렬화.
  - 권한 `contents: write`, `pull-requests: write`, `issues: write`.
  - 스텝: harry App 토큰 발급 → checkout(develop-fe, App 토큰, fetch-depth 0) → Node 20 + `npm ci` (frontend) → `claude-code-action@v1`.
  - 프롬프트는 짧게: 규칙 파일을 읽고, `$ISSUE_NUMBER` 이슈 본문을 `gh issue view`로 가져와 규칙대로 처리하라. 환경변수 `ISSUE_NUMBER`, `GH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`.
  - `claude_args`: `--model claude-opus-5`, allowedTools는 규칙 파일이 쓰는 명령만(`gh issue view/comment`, `gh pr create`, `git` 하위 명령별, `cd frontend && npm run typecheck`, `cd frontend && npx eslint src`). 이슈 본문에 실서비스 화면 텍스트(사용자 입력)가 섞여 들어오므로 무제한 Bash는 주지 않는다.
  - 배포 순서 제약: `issues` 이벤트 워크플로는 **기본 브랜치(main)의 YAML**만 읽는다. 규칙 파일은 체크아웃한 develop-fe에서 읽는다. 따라서 YAML은 main까지 가야 트리거되고, 규칙 파일은 develop-fe에 있으면 된다. develop-fe에만 머지하면 조용히 안 돈다.
- `design-feedback-rules.md`: 에이전트 규칙(5절).

### 4.3 로컬 커맨드 (`frontend/.claude/commands/design-feedback.md`)

레포에 스킬 디렉터리가 없고 `frontend/.claude/commands/*.md`가 관례라 커맨드로 둔다. `.claude`가 로컬 `.git/info/exclude`에 있어 `git add -f`가 필요하다.

- 입력: 툴바 마크다운(인자 또는 붙여넣기)과 선택적 이슈 번호.
- 절차는 규칙 파일을 그대로 따른다. 이슈 번호가 없으면 브랜치명에 `#0` 대신 날짜를 쓴다.
- CI 프롬프트와 규칙 파일이 단일 진실 원천이며, 스킬은 그 파일을 읽으라고만 지시한다.

## 5. 에이전트 규칙 (`.github/design-feedback-rules.md` 핵심)

### 5.1 요소 → 소스 찾기
- 툴바 출력은 `**Location:** #root > .Content-jqvACv > .Header-iaiWsU`(styled 변수명-해시 경로), `**React:**`(컴포넌트 체인, 프로덕션에선 축약될 수 있음), 개발 빌드 한정 `**Source:** 파일:줄`, `**Feedback:**`으로 구성된다. 실측(2026-09-19). Source → Location의 styled 변수명 → 읽을 수 있는 React 이름 → 페이지 경로 순으로 `frontend/src`를 grep한다.
- 후보 파일이 정확히 하나로 좁혀질 때만 수정한다. 둘 이상이거나 못 찾으면 코드를 건드리지 않고 이슈에 후보 목록과 함께 "어느 쪽인지" 되묻는 댓글을 단다. 추측으로 고치지 않는다.

### 5.2 바꿀 수 있는 것
- 스타일 값만: margin·padding·gap·width·height·font-size·font-weight·line-height·color·border·border-radius·align·justify·order·z-index.
- 하지 않는 것: 로직, 데이터 흐름, 컴포넌트 분리·합치기, 새 컴포넌트, props 추가, 조건부 렌더 변경. 메모가 이를 요구하면 PR 없이 이슈에 "개발 작업으로 넘긴다"고 답하고 끝낸다.
- 테마 토큰(`@/styles/theme`)에 같은 값이 있으면 리터럴 대신 토큰을 쓴다. 없으면 리터럴을 쓰고 토큰을 새로 만들지 않는다.

### 5.3 반응형
- 툴바 출력의 뷰포트 크기를 기준으로, 미디어쿼리가 있는 스타일은 해당 브레이크포인트 블록만 고친다. 다른 브레이크포인트는 건드리지 않는다.

### 5.4 검증
- `cd frontend && npm run typecheck && npm run lint` 통과 필수. 실패하면 PR을 열지 않고 이슈에 실패 로그 요약을 남긴다.
- 변경 파일은 메모 수 이하로 제한한다. 메모 3개에 파일 5개가 바뀌면 멈추고 이슈에 설명한다.

### 5.5 브랜치·PR
- `git config`는 harry 워크플로와 같은 이름·이메일.
- 브랜치 `design/#<이슈번호>-<영문슬러그>` (스토리 키 있으면 `-MOA-xx` 접미).
- PR 제목 `[design] <메모 한 줄 요약>`, base `develop-fe`.
- PR 본문: `Closes #<이슈번호>`, 메모 → 바꾼 파일·줄 대응표, 뷰포트 크기, 번들 크기 변화(styled displayName 관련이 아니면 생략).
- PR을 연 뒤 이슈에 PR 링크 댓글. 모든 댓글은 한국어 해요체.

## 6. 검증 계획

- 프론트: `?design=1`로 홈 접속 → 배너 제목 클릭 → 복사 → 마크다운에 `MainBanner`류 컴포넌트 이름과 `__` 붙은 클래스가 있는지 확인. `npm run build` 산출물에서 agentation이 별도 청크이고 index 청크에 없는지 확인. 프로덕션 번들 gzip 크기 전후 비교를 PR에 기록.
- 규칙 파일: 로컬 스킬로 메모 세 개("배너 제목 8px 왼쪽", "카드 간격 넓혀", "이 버튼 로직 바꿔줘")를 넣어 앞 둘은 의도한 파일만 바뀌고 셋째는 거부 댓글이 나오는지 확인.
- 워크플로: 테스트 이슈를 열어 PR·프리뷰·이슈 댓글까지 한 바퀴 도는지 확인. 조직 외 계정으로 이슈를 열면 워크플로가 스킵되는지 확인.

## 7. 범위 밖 (후속)

- 툴바에서 이슈 직접 생성(`webhookUrl` + 백엔드 프록시). 첫 버전은 복사·붙여넣기.
- 툴바 노출을 관리자 로그인 조건으로 제한.
- PR에 전후 스크린샷 자동 첨부. 첫 버전은 Vercel 프리뷰로 대체.
- Storybook/Chromatic 위 주석. Figma↔Storybook 대조 스킬(PR #2043)이 그 영역을 일부 덮는다.
