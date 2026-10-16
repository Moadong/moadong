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
PR에 `reviewer-harry[bot]` 작성자로 코멘트가 달리면 성공.

참고:
- **draft PR**과 **포크에서 올라온 PR**은 리뷰 대상에서 제외된다(워크플로우가 트리거되지 않음).
- 같은 레포 브랜치에서 올린, draft가 아닌 PR만 harry가 리뷰한다.
