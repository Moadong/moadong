# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **문서 구조**: 이 파일은 항상 로드되는 전역 가이드(빌드/컨벤션/테스트/하드룰)다.
> 도메인 상세는 **각 폴더의 `CLAUDE.md`로 분산**되어 있고, 그 폴더의 파일을 작업할 때만 로드된다.
> 코드를 바꾸면 **같은 폴더의 `CLAUDE.md`도 함께 갱신**한다 (아래 [폴더별 문서 인덱스](#폴더별-문서-인덱스) 참고).

## 빌드 및 개발 명령어

> Node 22.12.0 사용 (`.nvmrc` 기준). `nvm use`로 맞출 것.

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

# Storybook 사용 가이드 (공통 컴포넌트 수정 시)
# - 개발 중: npm run storybook (dev 서버로 실시간 확인)
# - 기존 스토리가 있는 컴포넌트 수정 후 PR 전: npm run build-storybook
# - 스토리가 없는 신규 컴포넌트: npm run typecheck 로 충분

# 유틸리티
npm run generate:sitemap # sitemap.xml 생성
```

## 아키텍처 개요

### 기술 스택

- React 19 + TypeScript
- Vite 번들러 (webpack 설정도 있으나 Vite가 주력)
- styled-components 스타일링
- TanStack React Query v5 서버 상태 관리
- Zustand 클라이언트 상태 관리
- React Router v7
- date-fns 날짜 처리 · Framer Motion 애니메이션 · Swiper 캐러셀
- react-datepicker 날짜 선택 · react-markdown 마크다운 렌더링

외부 서비스: Mixpanel, Sentry, Channel.io, Kakao SDK, Naver Map → 초기화·상세는 [`src/utils/CLAUDE.md`](src/utils/CLAUDE.md)

### 환경 변수

`.env` 파일에 다음 환경 변수 설정 필요 (모두 `VITE_` 접두사 사용):

- `VITE_API_URL` - 백엔드 API URL
- `VITE_MIXPANEL_TOKEN` - Mixpanel 프로젝트 토큰
- `VITE_SENTRY_DSN` - Sentry DSN
- `VITE_SENTRY_RELEASE` - Sentry 릴리즈 버전
- `VITE_ENABLE_SENTRY_IN_DEV` - 개발 환경에서 Sentry 활성화 여부 (true/false)
- `VITE_CHANNEL_PLUGIN_KEY` - Channel.io 플러그인 키
- `VITE_KAKAO_JAVASCRIPT_KEY` - Kakao JavaScript 키
- `VITE_NAVER_MAP_CLIENT_ID` - 네이버 지도 API 클라이언트 ID

### 프로젝트 구조

**경로 별칭**: `@/*`는 `src/*`로 매핑

**주요 디렉토리** (★ = 폴더 전용 `CLAUDE.md` 있음):

- `src/apis/` ★ - 도메인별 API 함수 + 인증 + SSE
- `src/hooks/Queries/` ★ - API를 래핑하는 React Query 훅 + 캐싱 전략
- `src/store/` - Zustand 스토어 (useCategoryStore, useSearchStore, useAdminClubStore)
- `src/pages/` - 라우트 기반 페이지 컴포넌트
- `src/components/` - 공용 UI 컴포넌트
- `src/layouts/` ★ - 웹/웹뷰 통합 라우팅 레이아웃
- `src/experiments/` ★ - A/B 테스트 실험 정의 및 관리
- `src/styles/` ★ - 전역 스타일·테마·브레이크포인트
- `src/constants/` ★ - 상수 관리 (queryKeys, storageKeys, status 등)
- `src/utils/` ★ - 유틸리티 함수 + 외부 SDK 초기화
- `src/mocks/` - MSW(Mock Service Worker) 핸들러
- `src/errors/` - 커스텀 에러 클래스
- `src/types/` - 공용 타입 정의

## 코딩 컨벤션

### 네이밍

- 변수, 함수: camelCase
- 컴포넌트, 타입: PascalCase
- 파일명: 컴포넌트는 PascalCase.tsx, 유틸은 camelCase.ts
- 상수: UPPER_SNAKE_CASE

### Import 순서

외부 라이브러리 → 내부 모듈 → 타입 → 스타일

### 스타일·타입

- styled-components 사용, 테마 시스템 활용
- `any` 금지, 명시적 타입 정의
- 상수는 `src/constants/`에서 관리
- 데이터 패칭은 `src/hooks/Queries/`의 기존 패턴을 우선 재사용
- API 호출은 `src/apis/`에 두고 페이지/컴포넌트에 분산시키지 않음

### Mixpanel 이벤트 트래킹

- 이벤트명은 `src/constants/eventName.ts`의 `USER_EVENT`에서 관리, 문자열 하드코딩 금지
- sessionStorage 키는 `page + id` 스코프로 작성

## 테스트 & Storybook

- Jest + React Testing Library, MSW로 API 모킹
- 테스트 파일은 `*.test.ts` 또는 `*.test.tsx` 형식
- 커버리지 리포트: `npm run coverage` · 단일 파일: `npx jest path/to/file.test.ts`
- MSW: `src/mocks/`에서 API 모킹 관리 (`handlers/` 도메인별 핸들러, `browser.ts` 워커). Storybook·개발 환경에서 사용
- Storybook: 컴포넌트 독립 개발 환경(포트 6006), MSW addon으로 API 모킹, Chromatic으로 시각적 회귀 테스트

## Claude Code Agent

`.claude/agents/` 디렉토리에 전담 agent 정의:

- `API훅부서.md` - React Query 훅 생성 및 관리 전담

Agent 사용 시 해당 문서를 참조하여 일관된 패턴 유지.

## 폴더별 문서 인덱스

도메인 상세는 코드 옆 `CLAUDE.md`에 있다. 해당 폴더 작업 시 자동 로드되며, 코드 변경 시 같은 파일을 갱신한다.

| 영역 | 문서 |
| --- | --- |
| API 레이어·인증·SSE | [`src/apis/CLAUDE.md`](src/apis/CLAUDE.md) |
| React Query 훅·캐싱 전략 | [`src/hooks/Queries/CLAUDE.md`](src/hooks/Queries/CLAUDE.md) |
| 상수 관리 | [`src/constants/CLAUDE.md`](src/constants/CLAUDE.md) |
| UI·테마·브레이크포인트·날짜 | [`src/styles/CLAUDE.md`](src/styles/CLAUDE.md) |
| A/B 테스트 실험 | [`src/experiments/CLAUDE.md`](src/experiments/CLAUDE.md) |
| 웹/웹뷰 통합 라우팅 | [`src/layouts/CLAUDE.md`](src/layouts/CLAUDE.md) |
| 유틸리티·외부 SDK 초기화 | [`src/utils/CLAUDE.md`](src/utils/CLAUDE.md) |
| OG 태그 (`middleware.ts`) | [`docs/claude/og.md`](docs/claude/og.md) |

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:

- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
