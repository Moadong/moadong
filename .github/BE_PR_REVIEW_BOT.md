# BE PR Review Bot

`💾 BE` 라벨이 붙은 `develop/be` 대상 PR을 자동 리뷰하는 워크플로우입니다.

## 동작 조건

아래 조건을 모두 만족할 때만 실행/리뷰합니다.

- PR 상태: `open`
- PR base branch: `develop/be`
- PR label 포함: `💾 BE`
- Draft PR 아님

트리거 이벤트:

- `opened`
- `reopened`
- `synchronize`
- `labeled`
- `ready_for_review`

## 리뷰 정책

- 테스트 실행은 포함하지 않습니다.
- 시니어 관점의 정적 리스크 체크(휴리스틱)만 수행합니다.
- 리뷰 상태는 `APPROVE`로 등록합니다.
- 잠재 리스크가 감지되면 Approve 본문에 경고 항목을 함께 남깁니다.

현재 휴리스틱(예시):

1. AES-GCM 고정 IV 사용 패턴
2. 검증 전 DB ID 저장 가능성
3. 페이지네이션 상한 시 has_more/next_cursor 왜곡 가능성

## 파일 위치

- 워크플로우: `.github/workflows/be-pr-review-bot.yml`
- 문서(현재 파일): `.github/BE_PR_REVIEW_BOT.md`

## 운영 팁

- 휴리스틱은 오탐/미탐이 있을 수 있습니다. 팀 규칙에 맞게 패턴을 추가/수정하세요.
- 브랜치 보호 규칙에서 bot approval 인정 여부를 사전에 확인하세요.
- "조건 만족 PR만 자동 승인" 정책이므로, 라벨 운영 기준(`💾 BE`)을 명확히 유지하세요.
