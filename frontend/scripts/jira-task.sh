#!/usr/bin/env bash
# GitHub 이슈 생성으로 Jira 하위 작업 + 브랜치 자동 생성
# 사용법: ./scripts/jira-task.sh "제목" "담당자" "MOA-xxx" "브랜치명" ["분기브랜치"] ["설명"] ["태스크"]
#
# GitHub Actions(common-jira-create.yml)이 이슈를 감지해 자동으로:
#   - Jira 하위 작업 생성 (상위 스토리의 하위)
#   - Git 브랜치 생성
set -euo pipefail

TITLE="${1:-}"
ASSIGNEE="${2:-}"
PARENT_KEY="${3:-}"
BRANCH="${4:-}"
BASE_BRANCH="${5:-develop-fe}"
DESCRIPTION="${6:-}"
TASKS="${7:-- [ ] Task1}"
REPO="Moadong/moadong"

if [ -z "$TITLE" ] || [ -z "$ASSIGNEE" ] || [ -z "$PARENT_KEY" ] || [ -z "$BRANCH" ]; then
  echo "사용법: ./scripts/jira-task.sh \"제목\" \"담당자\" \"MOA-xxx\" \"브랜치명\" [\"분기브랜치\"] [\"설명\"] [\"태스크\"]" >&2
  exit 1
fi

if [[ "$PARENT_KEY" != MOA-* ]]; then
  echo "오류: 상위 스토리 키는 MOA- 로 시작해야 합니다. (입력값: $PARENT_KEY)" >&2
  exit 1
fi

if ! command -v gh &>/dev/null; then
  echo "오류: GitHub CLI(gh)가 필요합니다. brew install gh" >&2
  exit 1
fi

BODY=$(cat <<BODY_EOF
### 🗓️ 마감일

_No response_

### 🙋 담당자(Assignee)

${ASSIGNEE}

### 🎟️ 상위 스토리 (Story Key)

${PARENT_KEY}

### 🌳 브랜치명 (Branch)

${BRANCH}

### 🧭 분기할 브랜치 선택

${BASE_BRANCH}

### 📝 상세 내용(Description)

${DESCRIPTION:-_No response_}

### ✅ 체크리스트(Tasks)

${TASKS}
BODY_EOF
)

ISSUE_URL=$(gh issue create \
  --repo "$REPO" \
  --title "$TITLE" \
  --label "✨ Feature" \
  --body "$BODY")

echo "✅ 이슈 생성 완료: $ISSUE_URL"
echo "⏳ GitHub Actions이 Jira 하위 작업과 브랜치를 자동 생성합니다."
