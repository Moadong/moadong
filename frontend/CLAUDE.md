# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 빌드 및 개발 명령어

```bash
# 개발 서버 (Vite - 주로 사용)
npm run dev              # 포트 3000에서 개발 서버 시작

# 빌드
npm run build            # 기본 빌드 (타입 체크 + sitemap 생성)
npm run build:dev        # 개발 빌드
npm run build:prod       # 프로덕션 빌드
npm run preview          # 빌드 결과 미리보기
npm run clean            # dist 폴더 삭제

# 테스트
npm run test             # 전체 테스트 실행
npm run coverage         # 커버리지 리포트와 함께 테스트 실행
npx jest path/to/file.test.ts  # 단일 테스트 파일 실행

# 코드 품질
npm run lint             # ESLint 자동 수정
npm run format           # Prettier 포맷팅
npm run typecheck        # TypeScript 타입 체크만 실행

# Storybook
npm run storybook        # 포트 6006에서 Storybook 시작
npm run build-storybook  # Storybook 빌드
npm run chromatic        # Chromatic으로 시각적 테스트 배포

# 유틸리티
npm run generate:sitemap # sitemap.xml 생성
```

## Claude Code Agent

`.claude/agents/` 디렉토리에 전담 agent 정의:

- `api-hooks-agent.md` - React Query 훅 생성 및 관리 전담

Agent 사용 시 해당 문서를 참조하여 일관된 패턴 유지.

---

## 도메인별 상세 문서

@docs/claude/architecture.md
@docs/claude/api.md
@docs/claude/ui.md
@docs/claude/testing.md
@docs/claude/features.md
@docs/claude/conventions.md
