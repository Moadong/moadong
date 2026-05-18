#!/usr/bin/env bash
# Jira 스토리 생성 스크립트
# 사용법: ./scripts/jira-story.sh "제목" "설명" "인수조건"
#
# 필수 환경 변수 (.env 또는 shell에서 설정):
#   JIRA_HOST       - Atlassian 인스턴스 호스트명 (예: yourcompany.atlassian.net)
#   PROJECT_KEY     - Jira 프로젝트 키 (예: MOA)
#   JIRA_EMAIL      - Atlassian 계정 이메일
#   JIRA_API_TOKEN  - Atlassian API 토큰 (https://id.atlassian.com/manage-profile/security/api-tokens)
set -euo pipefail

# 프로젝트 루트의 .env 자동 로드
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$PROJECT_ROOT/.env" ] && source "$PROJECT_ROOT/.env"

JIRA_HOST="${JIRA_HOST:-}"
PROJECT_KEY="${PROJECT_KEY:-}"
ISSUE_TYPE="Story"

SUMMARY="${1:-}"
DESCRIPTION="${2:-}"
AC="${3:-}"
SPRINT_ID="${4:-}"

if [ -z "$SUMMARY" ]; then
  echo "오류: 스토리 제목이 필요합니다." >&2
  exit 1
fi

if [ -z "${JIRA_HOST:-}" ] || [ -z "${PROJECT_KEY:-}" ]; then
  echo "오류: JIRA_HOST와 PROJECT_KEY 환경 변수를 설정하세요." >&2
  echo "  export JIRA_HOST=yourcompany.atlassian.net" >&2
  echo "  export PROJECT_KEY=YOUR_PROJECT_KEY" >&2
  exit 1
fi

if [ -z "${JIRA_EMAIL:-}" ] || [ -z "${JIRA_API_TOKEN:-}" ]; then
  echo "오류: JIRA_EMAIL과 JIRA_API_TOKEN 환경 변수를 설정하세요." >&2
  echo "  export JIRA_EMAIL=your@email.com" >&2
  echo "  export JIRA_API_TOKEN=your_api_token" >&2
  echo "  API 토큰 발급: https://id.atlassian.com/manage-profile/security/api-tokens" >&2
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "오류: jq가 필요합니다." >&2
  case "$(uname -s)" in
    Darwin*) echo "  brew install jq" >&2 ;;
    MINGW*|MSYS*|CYGWIN*) echo "  winget install jqlang.jq" >&2 ;;
    Linux*) echo "  sudo apt install jq  또는  sudo yum install jq" >&2 ;;
    *) echo "  https://jqlang.github.io/jq/download/" >&2 ;;
  esac
  exit 1
fi

# ADF(Atlassian Document Format) 본문 구성
build_adf_content() {
  local desc="$1"
  local ac="$2"
  local content="[]"

  if [ -n "$desc" ]; then
    content=$(echo "$content" | jq \
      --arg text "$desc" \
      '. + [{"type":"paragraph","content":[{"type":"text","text":$text}]}]')
  fi

  if [ -n "$ac" ]; then
    content=$(echo "$content" | jq \
      '. + [{"type":"paragraph","content":[{"type":"text","text":"✅ 인수 조건","marks":[{"type":"strong"}]}]}]')
    content=$(echo "$content" | jq \
      --arg text "$ac" \
      '. + [{"type":"paragraph","content":[{"type":"text","text":$text}]}]')
  fi

  echo "$content"
}

ADF_CONTENT=$(build_adf_content "$DESCRIPTION" "$AC")

# payload를 파일로 저장 (Windows 셸 호환)
PAYLOAD_FILE=$(mktemp)
jq -n \
  --arg summary "$SUMMARY" \
  --arg project "$PROJECT_KEY" \
  --arg issuetype "$ISSUE_TYPE" \
  --argjson content "$ADF_CONTENT" \
  --argjson sprintId "${SPRINT_ID:-null}" \
  '{
    fields: {
      project: { key: $project },
      summary: $summary,
      issuetype: { name: $issuetype },
      description: {
        type: "doc",
        version: 1,
        content: $content
      }
    }
  } | if $sprintId != null then .fields.customfield_10020 = $sprintId else . end' \
  > "$PAYLOAD_FILE"

TMPFILE=$(mktemp)
HTTP_CODE=$(curl -s -o "$TMPFILE" -w "%{http_code}" \
  --connect-timeout 5 \
  --max-time 30 \
  -X POST \
  -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD_FILE" \
  "https://${JIRA_HOST}/rest/api/3/issue")
BODY=$(cat "$TMPFILE")
rm -f "$TMPFILE" "$PAYLOAD_FILE"

if [ "$HTTP_CODE" = "201" ]; then
  ISSUE_KEY=$(echo "$BODY" | jq -r '.key')
  echo "✅ 스토리 생성 완료: $ISSUE_KEY"
  echo "🔗 https://${JIRA_HOST}/browse/${ISSUE_KEY}"
else
  echo "오류: 스토리 생성 실패 (HTTP $HTTP_CODE)" >&2
  echo "$BODY" | jq -r '.errors // .errorMessages // .' >&2
  exit 1
fi
