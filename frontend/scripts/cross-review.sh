#!/usr/bin/env bash
# 크로스 에이전트 코드 리뷰: 작성 도구의 반대 CLI로 독립적인 리뷰 수행
# 사용법: ./scripts/cross-review.sh --writer <claude|codex> [--staged]
set -euo pipefail

# --writer <claude|codex> 로 작성 도구 지정 → 반대 CLI로 리뷰
WRITER=""
STAGED=false
while [ $# -gt 0 ]; do
  case "$1" in
    --writer) WRITER="$2"; shift 2 ;;
    --staged) STAGED=true; shift ;;
    *) shift ;;
  esac
done

pick_reviewer() {
  local prefer="$1"
  if [ "$prefer" = "codex" ] && command -v codex &>/dev/null; then
    RUN_REVIEW() { codex -q "$1"; }; CLI_NAME="codex"
  elif [ "$prefer" = "claude" ] && command -v claude &>/dev/null; then
    RUN_REVIEW() { claude -p "$1"; }; CLI_NAME="claude"
  elif command -v codex &>/dev/null; then
    RUN_REVIEW() { codex -q "$1"; }; CLI_NAME="codex"
  elif command -v claude &>/dev/null; then
    RUN_REVIEW() { claude -p "$1"; }; CLI_NAME="claude"
  else
    echo "오류: claude 또는 codex CLI를 찾을 수 없습니다." >&2
    echo "  Claude Code: https://claude.ai/code" >&2
    echo "  Codex CLI:   https://github.com/openai/codex" >&2
    exit 1
  fi
}

# 작성 도구의 반대 CLI를 리뷰어로 선택
case "$WRITER" in
  claude) pick_reviewer "codex" ;;
  codex)  pick_reviewer "claude" ;;
  *)      pick_reviewer "codex" ;;  # 기본값: codex로 리뷰
esac

if $STAGED; then
  DIFF=$(git diff --staged 2>/dev/null)
  SCOPE="스테이징된 변경사항"
else
  DIFF=$(git diff HEAD 2>/dev/null)
  SCOPE="미커밋 변경사항"
  if [ -z "$DIFF" ]; then
    DIFF=$(git diff --staged 2>/dev/null)
    SCOPE="스테이징된 변경사항"
  fi
fi


if [ -z "$DIFF" ]; then
  echo "리뷰할 변경사항이 없습니다."
  exit 0
fi

LINE_COUNT=$(echo "$DIFF" | wc -l | tr -d ' ')
echo "크로스 에이전트 리뷰 시작 [$CLI_NAME] ($SCOPE, ${LINE_COUNT}줄)..."
echo ""

PROMPT="당신은 10년차 프론트엔드 시니어 개발자입니다. 이 코드를 누가 어떻게 작성했는지 전혀 모릅니다. 아래 git diff를 객관적으로 리뷰하세요.

**프로젝트 컨텍스트 (React 19 + TypeScript + styled-components):**
- 변수/함수: camelCase | 컴포넌트/타입: PascalCase | 상수: UPPER_SNAKE_CASE
- \`any\` 타입 금지 — 명시적 TypeScript 타입 필수
- 상수는 반드시 \`src/constants/\`에서 관리
- 스타일링은 styled-components + 테마 시스템 (\`src/styles/theme/\`)
- API 호출은 \`handleResponse<T>()\`, \`secureFetch()\` 헬퍼 사용
- Mixpanel 이벤트명은 \`src/constants/eventName.ts\`에서 가져오기 — 문자열 하드코딩 금지
- 서버 상태: React Query v5 | 클라이언트 상태: Zustand

**리뷰 기준:**
1. CRITICAL — 버그, 로직 오류, 보안 취약점, TypeScript 타입 오류
2. WARNING — 컨벤션 위반, 성능 이슈, 하드코딩 문자열
3. INFO — 코드 스타일, 중복 코드, 네이밍

**출력 형식:**
심각도별 그룹화. 각 항목: \`[심각도] 파일경로:라인 — 설명\`
마지막에 한 줄 요약: 총 발견 건수 + 가장 먼저 수정할 항목.
모든 출력은 한국어로 작성하세요.

Diff:
---
$DIFF"

RUN_REVIEW "$PROMPT"
