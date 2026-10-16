디자인 피드백 툴바 마크다운을 받아 `.github/design-feedback-rules.md` 절차대로 스타일을 고치고 PR을 연다.
CI 워크플로(`design-feedback.yml`)와 같은 규칙을 로컬에서 돌리는 수동 경로다.

## 입력

1. 이슈 번호가 있으면: "이슈 번호를 입력해주세요 (없으면 Enter)". 있으면 `ISSUE_NUMBER`로 쓰고 규칙 1절대로 `gh issue view`로 본문을 가져온다.
2. 없으면: "툴바에서 복사한 마크다운을 붙여넣어주세요". 붙여넣은 내용을 이슈 본문의 `### 🎨 피드백` 섹션으로 간주한다.

## 실행

- 레포 루트의 `.github/design-feedback-rules.md`를 읽고 2절부터 7절까지 그대로 따른다.
- 환경변수 대신 아래 값을 쓴다: `REPO`=`Moadong/moadong`, `PR_BASE`=`develop-fe`.
- 이슈 번호가 없으면 5절의 이슈 댓글은 달지 말고 그 내용을 사용자에게 출력한다. 브랜치명은 `design/<YYYYMMDD>-<슬러그>`, PR 본문의 `Closes #` 줄은 뺀다.
- 브랜치를 따기 전에 `git status`가 깨끗한지 확인한다. 깨끗하지 않으면 멈추고 사용자에게 알린다.
- 커밋과 PR 생성 전에 diff를 보여 주고 사용자 확인을 받는다.
