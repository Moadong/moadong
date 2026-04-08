#!/bin/bash
# PostCompact hook: CLAUDE.md 핵심 컨텍스트를 압축 후 재주입
CLAUDE_MD="/Users/seokyoung-won/Desktop/moadong/frontend/CLAUDE.md"

if [ ! -f "$CLAUDE_MD" ]; then
  exit 0
fi

# 아키텍처 개요 섹션만 추출 (너무 많은 토큰 방지)
CONTEXT=$(awk '/^## 아키텍처 개요/,/^## [^아]/' "$CLAUDE_MD" | head -60)

if [ -z "$CONTEXT" ]; then
  exit 0
fi

CONTEXT_JSON=$(printf '%s' "$CONTEXT" | jq -Rs .)

printf '{"hookSpecificOutput":{"hookEventName":"PostCompact","additionalContext":%s}}' "$CONTEXT_JSON"
