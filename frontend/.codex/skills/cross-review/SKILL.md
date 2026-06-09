---
name: "cross-review"
description: "다른 AI가 작성한 코드를 리뷰하기 위해 모아동 cross-review 스크립트를 실행할 때 사용한다. /cross-review, 크로스 에이전트 리뷰, Claude 작성 코드 리뷰, Codex 작성 코드 리뷰 요청에 사용한다."
---

# 모아동 크로스 리뷰

## Codex 적용 규칙

- Claude slash command의 인자 참조는 사용자의 현재 요청으로 해석한다.
- Claude 전용 `allowed-tools` 메타데이터는 무시하고, 현재 Codex 세션에서 제공되는 도구를 사용한다.
- 원본이 Claude 서브에이전트 호출을 지시하면, Codex에서 명시적인 서브에이전트 도구가 있고 적절한 경우를 제외하고 해당 에이전트 지침을 직접 따라 작업한다.
- 모든 작업은 저장소의 `AGENTS.md` 지침을 우선해서 따른다.

## Source: `.claude/commands/cross-review.md`

크로스 에이전트 코드 리뷰를 실행합니다. 코드를 작성한 AI와 다른 AI가 리뷰합니다.

사용법:

- `/cross-review claude` — Claude로 작성 → Codex가 리뷰
- `/cross-review codex` — Codex로 작성 → Claude가 리뷰
- `/cross-review` — 기본값: claude로 간주 (Codex가 리뷰)

아래 명령을 실행하고 결과를 그대로 출력합니다:

```bash
./scripts/cross-review.sh --writer 작성자 인자, 기본값 claude
```
