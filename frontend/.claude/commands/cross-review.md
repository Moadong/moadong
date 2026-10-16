크로스 에이전트 코드 리뷰를 실행합니다. 코드를 작성한 AI와 다른 AI가 리뷰합니다.

사용법:

- `/cross-review claude` — Claude로 작성 → Codex가 리뷰
- `/cross-review codex` — Codex로 작성 → Claude가 리뷰
- `/cross-review` — 기본값: claude로 간주 (Codex가 리뷰)

아래 명령을 실행하고 결과를 그대로 출력합니다:

```bash
./scripts/cross-review.sh --writer ${ARGUMENTS:-claude}
```
