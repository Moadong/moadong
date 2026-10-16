# harry — PR 자동 리뷰봇 설계

작성일: 2026-06-27
대상 레포: `Moadong/moadong`

## 1. 목표

PR이 열리거나 업데이트되면 **자동으로** 내 리뷰 취향(코드 기준)을 검사해서 코멘트를 다는 봇 `harry`를 만든다.
- 핵심은 **B = 내 리뷰 기준/취향**의 자동화. 말투는 평범하되 살짝 깐깐한 톤.
- 봇은 **GitHub App** 기반으로, 코멘트가 `harry[bot]` 작성자(내 아바타)로 달려 독립된 정체성을 가진다.
- 인증은 **Anthropic API 종량과금 대신 Claude 구독(OAuth) 또는 GitHub App 토큰** 경유 — 엔진은 헤드리스 Claude Code CLI.

## 2. 결정 사항 요약

| 항목 | 결정 |
|---|---|
| 엔진 | `anthropics/claude-code-action@v1` (헤드리스 Claude Code CLI) |
| 인증 (Claude) | `CLAUDE_CODE_OAUTH_TOKEN` — 내 Max/Pro 구독 토큰. API 종량과금 없음, 구독 한도에서 차감 |
| 봇 정체성 | **GitHub App** `harry` — 코멘트가 `harry[bot]` + 내 아바타로 작성됨 |
| 트리거 | `pull_request` `types: [opened, synchronize]`, draft 제외 |
| 출력 포맷 | **요약 코멘트 1개** (인라인 줄별 코멘트 아님) |
| CodeRabbit | **공존** — CodeRabbit은 일반 리뷰, harry는 내 취향 저격 전용 |
| 리뷰 기준 위치 | 별도 파일 `.github/harry-review-rules.md` (YAML 안 건드리고 이 파일만 수정) |

## 3. 만들 파일 (레포 내, 2개)

### 3.1 `.github/workflows/harry-review.yml`
- 트리거: `pull_request: [opened, synchronize]`, `if: !draft`
- 권한: `pull-requests: write`, `contents: read`
- 스텝:
  1. `actions/create-github-app-token@v1` — `HARRY_APP_ID` + `HARRY_APP_PRIVATE_KEY` 시크릿으로 단기 설치 토큰 발급 (코멘트를 `harry[bot]`으로 달기 위함)
  2. `actions/checkout@v4` (`fetch-depth: 0`)
  3. `anthropics/claude-code-action@v1`
     - `github_token`: 1번에서 발급한 App 토큰
     - `prompt`: `.github/harry-review-rules.md`를 읽어 그 기준으로 PR diff를 리뷰하고 요약 코멘트 1개를 작성하라는 지시
     - `claude_args`: 모델 = `claude-sonnet-4-6` (비용/한도 균형)
     - `env: CLAUDE_CODE_OAUTH_TOKEN`

### 3.2 `.github/harry-review-rules.md`
harry의 "정체성" = 리뷰 기준. AGENTS.md + 내 알려진 취향을 시드로 초안 작성, 이후 사용자가 자유 수정.

초안에 포함할 기준 (프론트):
- **React Compiler 전제** — 수동 `memo`/`useCallback`/`useMemo` 추가를 지적 (리렌더 병목 진단 없이 넣지 말 것)
- **불필요한 useEffect** 금지 — 파생 상태/이벤트 핸들러로 풀 수 있는 걸 effect로 처리하면 지적
- **네이밍** — 기존 파일/타입 네이밍 규칙 일관성
- 데이터 패칭은 `hooks/Queries/` 패턴 재사용, API 호출은 `apis/`에 집중 (페이지/컴포넌트에 흩뿌리지 말 것)
- 공통 UI는 `components/` 재사용 우선
- 변경 범위 최소(surgical), 기능 변경과 대규모 리팩터링 혼합 금지
- 학생용/관리자용 공통 영향 수정은 양쪽 화면 의식
- 테스트 누락 지적

초안에 포함할 기준 (백엔드):
- controller/service/repository/dto 역할 혼합 금지
- 도메인 패키지 구성 유지
- 부작용 로직(파일 업로드/알림/실시간) 영향 범위 확인

보안 (공통):
- 비밀키/토큰/민감설정 하드코딩 지적
- 사용자 입력 검증 누락 지적

페르소나 서명: 코멘트 머리말 `## 🧐 harry의 취향저격 리뷰` + 한국어, 살짝 깐깐한 톤.

## 4. 사용자가 직접 해야 하는 수동 작업 (코드로 불가)

설계 구현 후 별도 안내서(`docs/...` 또는 PR 본문)로 단계별 제공. 요약:

1. **Claude 구독 토큰 발급**: 로컬에서 `claude setup-token` → OAuth 토큰
2. **GitHub App `harry` 생성**: 이름 `harry`, 아바타 업로드, 권한 = Pull requests(Read & write) + Contents(Read), 구독 webhook 불필요
3. App **Private Key(.pem) 발급** + **App ID** 확보
4. App을 `Moadong/moadong`에 **설치(install)**
5. 레포 Secret 3개 등록:
   - `CLAUDE_CODE_OAUTH_TOKEN` (1번)
   - `HARRY_APP_ID` (3번)
   - `HARRY_APP_PRIVATE_KEY` (3번 .pem 전체 내용)

> 전제: 사용자가 `Moadong/moadong`에 Secret 등록 + App 설치 권한을 가짐. 없으면 여기서 막힘.

## 5. 비목표 (YAGNI)

- 인라인 줄별 리뷰 코멘트 (요약형으로 시작, 필요 시 추후)
- CodeRabbit 제거 (당분간 공존)
- 셀프호스티드 러너 (GitHub 호스티드 사용)
- harry가 코드를 자동 수정/푸시하는 기능 (리뷰 코멘트만)

## 6. 검증 방법

- 테스트 PR을 하나 열어 harry 워크플로우가 트리거되는지 확인
- 코멘트 작성자가 `harry[bot]` + 아바타로 뜨는지 확인
- 룰 위반 코드를 일부러 넣은 PR에서 harry가 해당 항목을 지적하는지 확인
- draft PR에서는 트리거되지 않는지 확인
