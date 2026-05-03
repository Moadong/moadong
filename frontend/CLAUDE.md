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
- date-fns 날짜 처리
- Framer Motion 애니메이션
- Swiper 캐러셀
- react-datepicker 날짜 선택
- react-markdown 마크다운 렌더링

### 외부 서비스 통합

- **Mixpanel**: 사용자 분석 및 이벤트 트래킹
- **Sentry**: 에러 모니터링 및 성능 추적
- **Channel.io**: 고객 지원 채팅
- **Kakao SDK**: 카카오 공유 기능
- **Naver Map**: 동아리방 위치 지도 (네이버 클라우드 플랫폼)

모든 SDK는 `src/utils/initSDK.ts`에서 초기화되며, 각각 환경 변수 필요.

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

**주요 디렉토리**:

- `src/apis/` - 도메인별 API 함수 (club, auth, application, applicants)
- `src/hooks/Queries/` - API를 래핑하는 React Query 훅 (useClub, useApplication, useApplicants)
- `src/store/` - Zustand 스토어 (useCategoryStore, useSearchStore)
- `src/pages/` - 라우트 기반 페이지 컴포넌트
- `src/components/` - 공용 UI 컴포넌트
- `src/context/` - React Context 프로바이더 (AdminClubContext - SSE 상태 관리)
- `src/experiments/` - A/B 테스트 실험 정의 및 관리
- `src/mocks/` - MSW(Mock Service Worker) 핸들러
- `src/utils/` - 유틸리티 함수 (날짜 파싱, 유효성 검사, 디바운스, WebView 브릿지 등)
- `src/errors/` - 커스텀 에러 클래스
- `src/types/` - 공용 타입 정의
- `src/constants/` - 상수 관리 (queryKeys, storageKeys, status, eventName, api, snsConfig 등)

### API 레이어 패턴

API는 `src/apis/utils/apiHelpers.ts`의 헬퍼 함수를 사용하는 일관된 패턴을 따름:

- `handleResponse<T>()` - 응답 파싱, `{ data: {...} }` 형식 자동 언래핑
- `secureFetch()` - 인증된 요청, 403 시 토큰 자동 갱신

쿼리 키는 `src/constants/queryKeys.ts`에 중앙 관리.

### 인증 플로우

- JWT는 localStorage에 저장 (`accessToken` 키, `src/constants/storageKeys.ts`에서 관리)
- 리프레시 토큰은 쿠키로 처리
- `src/apis/auth/secureFetch.ts`의 `secureFetch()`가 자동 토큰 갱신 담당
- 어드민 라우트는 `PrivateRoute` 컴포넌트로 보호

### 실험(A/B 테스트) 프레임워크

`src/experiments/`에서 Mixpanel 기반 실험 관리:

- `definitions.ts` - 실험 정의 (key, variants, weights)
- `ExperimentRepository.ts` - 실험 할당 및 변형 조회 로직
- `initializeExperiments.ts` - 앱 시작 시 실험 초기화
- `useExperiment()` 훅으로 컴포넌트에서 실험 변형 사용

**예시**:

```typescript
const { variant } = useExperiment(mainBannerExperiment);
// variant는 'A' 또는 'B'
```

### MSW (Mock Service Worker)

`src/mocks/`에서 API 모킹 관리:

- `handlers/` - 도메인별 모킹 핸들러
- `browser.ts` - MSW 브라우저 워커 설정
- Storybook 및 개발 환경에서 사용

### 주요 유틸리티 함수

`src/utils/`에 공용 유틸리티 함수 모음:

- `formatRelativeDateTime.ts` - 상대적 시간 표시 ("2시간 전")
- `recruitmentDateParser.ts` - 모집 기간 파싱
- `debounce.ts` - 디바운스 함수
- `validateSocialLink.ts` - SNS 링크 유효성 검사
- `isInAppWebView.ts` - 인앱 WebView 감지
- `webviewBridge.ts` - 네이티브 앱과 통신
- `initSDK.ts` - 외부 SDK 초기화 (Mixpanel, Sentry, Channel.io, Kakao)

### 반응형 브레이크포인트

`src/styles/mediaQuery.ts`에 정의:

- mini_mobile: 375px
- mobile: 500px
- tablet: 700px
- laptop: 1280px
- Desktop: 1280px 초과 (기본값)

### 테마 시스템

테마는 `src/styles/theme/`에 colors, typography, transitions로 정의. styled-components `ThemeProvider`를 통해 접근.

### 상수 관리

`src/constants/`에 모든 상수 중앙 관리:

- `queryKeys.ts` - React Query 쿼리 키 (도메인.액션 형식)
- `storageKeys.ts` - localStorage 키 (`accessToken`, `hasConsentedPersonalInfo`)
- `status.ts` - 지원 상태 정의 (PENDING, APPROVED, REJECTED 등)
- `eventName.ts` - Mixpanel 이벤트명
- `api.ts` - API 엔드포인트 URL
- `snsConfig.ts` - SNS 플랫폼 설정
- `applicationForm.ts` - 지원서 폼 설정
- `uploadLimit.ts` - 파일 업로드 제한

### 실시간 업데이트

지원자 상태 업데이트를 위해 SSE(Server-Sent Events) 사용, `AdminClubContext`에서 관리.

### 날짜 처리

- `date-fns` 라이브러리 사용 (Moment.js 대신)
- `formatRelativeDateTime` 유틸로 상대 시간 표시
- `react-datepicker` 컴포넌트로 날짜 입력

### 애니메이션

- `framer-motion` 라이브러리로 페이지 전환, 모달, 제스처 등 애니메이션 구현
- `src/styles/theme/transitions.ts`에 공통 트랜지션 정의

### 캐러셀

- `swiper` 라이브러리로 이미지 슬라이더, 카드 캐러셀 구현

## 테스트

- Jest + React Testing Library
- MSW로 API 모킹
- 테스트 파일은 `*.test.ts` 또는 `*.test.tsx` 형식
- 커버리지 리포트: `npm run coverage`

## Storybook

- 컴포넌트 독립 개발 환경
- MSW addon으로 API 모킹 지원
- Chromatic으로 시각적 회귀 테스트

## Claude Code Agent

`.claude/agents/` 디렉토리에 전담 agent 정의:

- `API훅부서.md` - React Query 훅 생성 및 관리 전담

Agent 사용 시 해당 문서를 참조하여 일관된 패턴 유지.

---

## 도메인별 상세 문서

@docs/claude/architecture.md
@docs/claude/api.md
@docs/claude/ui.md
@docs/claude/testing.md
@docs/claude/features.md
@docs/claude/conventions.md
