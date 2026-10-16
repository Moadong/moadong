# harry PR 리뷰봇 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PR이 열리거나 업데이트되면 GitHub App `harry`로 내 리뷰 취향을 자동 검사해 요약 코멘트를 다는 봇을 만든다.

**Architecture:** `anthropics/claude-code-action@v1`(헤드리스 Claude Code CLI)을 GitHub Actions에서 실행한다. `actions/create-github-app-token`으로 발급한 harry App 토큰으로 코멘트를 작성해 `harry[bot]` 정체성을 부여하고, Claude 인증은 구독 OAuth 토큰을 사용한다. 리뷰 기준은 별도 markdown 파일에 두어 워크플로우 수정 없이 취향을 갱신한다.

**Tech Stack:** GitHub Actions, `anthropics/claude-code-action@v1`, `actions/create-github-app-token@v1`, `actions/checkout@v4`, Claude Code CLI(sonnet 모델), GitHub App.

## Global Constraints

- 엔진 액션 버전: `anthropics/claude-code-action@v1` (v0.x 사용 금지)
- 리뷰 모델: `claude-sonnet-4-6` (고정)
- 트리거: `pull_request` `types: [opened, synchronize]`, draft PR 제외
- 권한: `contents: read`, `pull-requests: write` 만
- 출력: 요약 코멘트 1개 (인라인 줄별 코멘트 금지)
- 코멘트 언어: 한국어, 머리말 `## 🧐 harry의 취향저격 리뷰`
- Secret 이름(고정): `CLAUDE_CODE_OAUTH_TOKEN`, `HARRY_APP_ID`, `HARRY_APP_PRIVATE_KEY`
- 커밋 메시지: 한글, 한 커밋 한 목적 (AGENTS.md 커밋 규칙)
- **커밋은 사용자 명시 요청 시에만** — 자동 커밋 금지. 아래 각 태스크의 commit 스텝은 사용자가 진행을 승인했을 때만 실행한다.

---

### Task 1: harry 리뷰 룰 파일 작성

harry의 정체성 = 리뷰 기준. 워크플로우가 이 파일을 읽어 프롬프트 기준으로 사용한다. 먼저 만들어야 워크플로우가 참조할 대상이 존재한다.

**Files:**
- Create: `.github/harry-review-rules.md`

**Interfaces:**
- Consumes: 없음 (정적 문서)
- Produces: `.github/harry-review-rules.md` — Task 2의 워크플로우 prompt가 경로로 참조한다.

- [ ] **Step 1: 룰 파일 생성**

`.github/harry-review-rules.md` 에 아래 내용을 그대로 작성한다:

```markdown
# harry 리뷰 기준

너는 'harry'. moadong 레포의 PR을 내(레포 오너) 취향 기준으로 리뷰한다.
아래 항목 위반만 지적한다. 일반적인 코드 리뷰 잡설은 줄이고, 아래 기준에 집중한다.
위반이 없으면 통과시키고 짧게 칭찬 한 줄만 남긴다.

## 프론트엔드 (React + TypeScript + Vite)

- **React Compiler 전제**: 수동 `memo` / `useCallback` / `useMemo` 추가를 지적한다.
  리렌더 병목을 측정·진단한 근거 없이 메모이제이션을 넣었다면 제거를 제안한다.
- **불필요한 useEffect 금지**: 파생 상태 계산이나 이벤트 핸들러로 풀 수 있는 로직을
  `useEffect`로 처리했다면 지적하고 대안을 제시한다.
- **네이밍 일관성**: 인접 파일/기존 타입의 네이밍 규칙과 어긋나면 지적한다.
- **데이터 패칭**: `frontend/src/hooks/Queries/`의 기존 패턴을 재사용했는지 본다.
  컴포넌트/페이지 안에서 직접 패칭하면 지적한다.
- **API 호출 위치**: API 함수는 `frontend/src/apis/`에 모은다. 페이지/컴포넌트에
  fetch/axios가 흩어져 있으면 지적한다.
- **공통 UI 재사용**: 새 UI가 `frontend/src/components/`의 기존 컴포넌트로
  대체 가능한데 새로 만들었으면 지적한다.
- **변경 범위(surgical)**: 요청과 무관한 인접 코드/포맷팅 변경, 기능 변경과
  대규모 리팩터링 혼합을 지적한다.
- **학생용/관리자용 공통 영향**: 양쪽 화면에 공통 영향을 주는 수정인데 한쪽만
  고려한 흔적이면 지적한다.
- **테스트 누락**: 로직 변경에 대응하는 테스트가 없으면 지적한다.

## 백엔드 (Spring Boot)

- controller / service / repository / dto(payload) 역할을 한 클래스에 섞으면 지적한다.
- 도메인 패키지 구성을 벗어나면 지적한다.
- 파일 업로드 / 알림 / 실시간 이벤트처럼 부작용이 있는 로직은 영향 범위를
  확인했는지 본다.

## 보안 (공통)

- 비밀키 / 토큰 / 계정 정보 / 민감 설정값 하드코딩을 지적한다.
- 사용자 입력 검증 누락을 지적한다.

## 출력 형식

- 한국어로, 머리말 `## 🧐 harry의 취향저격 리뷰` 로 시작한다.
- 살짝 깐깐하지만 무례하지 않은 톤.
- 지적은 `- [파일:줄] 내용 — 이유 / 제안` 형태의 목록으로.
- 요약 코멘트 1개만 작성한다.
```

- [ ] **Step 2: 파일 존재·내용 검증**

Run: `test -f .github/harry-review-rules.md && grep -q "harry의 취향저격 리뷰" .github/harry-review-rules.md && echo OK`
Expected: `OK`

- [ ] **Step 3: 커밋 (사용자 승인 시에만)**

```bash
git add .github/harry-review-rules.md
git commit -m "feat: harry 리뷰봇 룰 파일 추가"
```

---

### Task 2: harry 워크플로우 작성

PR 트리거 시 App 토큰을 발급하고 claude-code-action을 실행해 룰 기준으로 리뷰 코멘트를 단다.

**Files:**
- Create: `.github/workflows/harry-review.yml`

**Interfaces:**
- Consumes: `.github/harry-review-rules.md` (Task 1), Secret `CLAUDE_CODE_OAUTH_TOKEN` / `HARRY_APP_ID` / `HARRY_APP_PRIVATE_KEY` (Task 3에서 사람이 등록)
- Produces: PR 코멘트 (`harry[bot]` 작성자)

- [ ] **Step 1: 워크플로우 파일 생성**

`.github/workflows/harry-review.yml` 에 아래 내용을 그대로 작성한다:

```yaml
name: harry PR Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  harry-review:
    if: ${{ github.event.pull_request.draft == false }}
    runs-on: ubuntu-latest
    steps:
      - name: Generate harry App token
        id: app-token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.HARRY_APP_ID }}
          private-key: ${{ secrets.HARRY_APP_PRIVATE_KEY }}

      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: harry review
        uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          prompt: |
            너는 'harry'라는 이름의 PR 리뷰봇이다.
            저장소 루트의 `.github/harry-review-rules.md` 파일을 읽고,
            그 기준에 따라 이 PR의 변경사항(diff)을 리뷰해라.
            리뷰 결과는 PR에 **요약 코멘트 1개**로 작성해라. 인라인 줄별 코멘트는 달지 마라.
            코멘트는 한국어로 작성하고, 머리말은 `## 🧐 harry의 취향저격 리뷰` 로 시작해라.
            룰 위반이 없으면 통과시키고 짧게 칭찬 한 줄만 남겨라.
          claude_args: |
            {
              "model": "claude-sonnet-4-6"
            }
        env:
          CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

- [ ] **Step 2: YAML 문법 검증**

Run:
```bash
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/harry-review.yml')); print('YAML OK')"
```
Expected: `YAML OK` (만약 `ModuleNotFoundError: yaml` 이면 `pip3 install pyyaml` 후 재실행, 또는 `python3 -c "import json,yaml"` 대신 GitHub Actions 탭에서 문법 오류 여부로 확인)

- [ ] **Step 3: 핵심 키 존재 검증**

Run:
```bash
python3 - <<'PY'
import yaml
d = yaml.safe_load(open('.github/workflows/harry-review.yml'))
j = d['jobs']['harry-review']
assert j['if'] == '${{ github.event.pull_request.draft == false }}'
steps = {s.get('name'): s for s in j['steps']}
assert 'Generate harry App token' in steps
assert steps['harry review']['uses'] == 'anthropics/claude-code-action@v1'
assert 'claude-sonnet-4-6' in steps['harry review']['with']['claude_args']
assert d['permissions'] == {'contents': 'read', 'pull-requests': 'write'}
print('KEYS OK')
PY
```
Expected: `KEYS OK`

- [ ] **Step 4: 커밋 (사용자 승인 시에만)**

```bash
git add .github/workflows/harry-review.yml
git commit -m "feat: harry PR 리뷰 워크플로우 추가"
```

---

### Task 3: 수동 셋업 안내서 작성 + 사용자 셋업

코드로 못 하는 부분(토큰·App·Secret). 안내서를 남기고, 사용자가 직접 셋업한다.

**Files:**
- Create: `docs/harry-review-bot-setup.md`

**Interfaces:**
- Consumes: 없음
- Produces: Secret 3종이 레포에 등록된 상태 (사용자 수동) → Task 2 워크플로우가 동작 가능해짐

- [ ] **Step 1: 안내서 작성**

`docs/harry-review-bot-setup.md` 에 아래 내용을 작성한다:

```markdown
# harry 리뷰봇 셋업 안내

워크플로우(`.github/workflows/harry-review.yml`)가 동작하려면 아래 수동 셋업이 필요하다.
모두 `Moadong/moadong` 레포 관리자 권한이 필요하다.

## 1. Claude 구독 토큰 발급
로컬 터미널에서:
```bash
claude setup-token
```
브라우저 인증 후 출력되는 OAuth 토큰을 복사한다. (Max/Pro 구독 필요)

## 2. GitHub App `harry` 생성
GitHub → Settings → Developer settings → GitHub Apps → New GitHub App
- App name: `harry`
- Homepage URL: 아무 값 (예: 레포 URL)
- Webhook: **Active 체크 해제** (불필요)
- Repository permissions:
  - Pull requests: **Read and write**
  - Contents: **Read-only**
- 저장 후 App 페이지에서 아바타(프로필 이미지) 업로드

## 3. App ID + Private Key 확보
- App 페이지에서 **App ID** 기록
- "Private keys" → **Generate a private key** → `.pem` 파일 다운로드

## 4. App 설치
- App 페이지 → Install App → `Moadong/moadong` 에 설치 (Only select repositories)

## 5. 레포 Secret 등록
`Moadong/moadong` → Settings → Secrets and variables → Actions → New repository secret
- `CLAUDE_CODE_OAUTH_TOKEN` = 1번 토큰
- `HARRY_APP_ID` = 3번 App ID
- `HARRY_APP_PRIVATE_KEY` = 3번 `.pem` 파일 전체 내용 (`-----BEGIN...END-----` 포함)

## 6. 동작 확인
테스트 PR을 하나 열어 Actions 탭에서 `harry PR Review` 워크플로우 실행 확인.
PR에 `harry[bot]` 작성자로 코멘트가 달리면 성공.
```

- [ ] **Step 2: 안내서 검증**

Run: `test -f docs/harry-review-bot-setup.md && grep -q "CLAUDE_CODE_OAUTH_TOKEN" docs/harry-review-bot-setup.md && echo OK`
Expected: `OK`

- [ ] **Step 3: 커밋 (사용자 승인 시에만)**

```bash
git add docs/harry-review-bot-setup.md
git commit -m "docs: harry 리뷰봇 셋업 안내서 추가"
```

- [ ] **Step 4: 사용자 수동 셋업 (코드 아님)**

사용자가 `docs/harry-review-bot-setup.md` 1~5단계를 직접 수행한다. Secret 3종 등록 완료까지 확인한다.

---

### Task 4: 최종 통합 검증 (테스트 PR)

Secret 등록 후 실제로 봇이 도는지 확인한다. Task 3 셋업 완료가 선행되어야 한다.

**Files:** 없음 (런타임 검증)

**Interfaces:**
- Consumes: 배포된 워크플로우 + 등록된 Secret 3종
- Produces: 없음 (검증 결과)

- [ ] **Step 1: 룰 위반 코드를 담은 테스트 PR 생성**

브랜치를 하나 만들어 일부러 룰 위반 코드(예: 불필요한 `useEffect` 또는 수동 `useMemo`)를 추가하고 PR을 연다.

- [ ] **Step 2: 워크플로우 트리거 확인**

Run: `gh run list --workflow "harry PR Review" --limit 3`
Expected: 방금 연 PR에 대한 실행이 목록에 보임 (status completed)

- [ ] **Step 3: 코멘트·정체성 확인**

Run: `gh pr view <PR번호> --comments`
Expected: 작성자가 `harry[bot]`, 머리말 `## 🧐 harry의 취향저격 리뷰`, 넣어둔 룰 위반이 지적됨

- [ ] **Step 4: draft 비트리거 확인**

draft PR을 하나 열고, `gh run list --workflow "harry PR Review"` 에 새 실행이 생기지 **않는지** 확인한다.
Expected: draft PR에 대한 실행 없음

---

## 검증 요약

- Task 1~3: 파일 생성 + 로컬 문법/내용 검증 (사람 셋업은 Task 3 Step 4)
- Task 4: 실제 PR로 트리거·정체성·룰 적용·draft 제외를 end-to-end 확인
- 자동화로 못 막는 부분(구독 한도, Secret 권한)은 Task 3 안내서에 명시됨
