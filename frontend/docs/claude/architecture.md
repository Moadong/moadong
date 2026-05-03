# 아키텍처

## 기술 스택

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

## 환경 변수

`.env` 파일에 다음 환경 변수 설정 필요 (모두 `VITE_` 접두사 사용):

- `VITE_API_URL` - 백엔드 API URL
- `VITE_MIXPANEL_TOKEN` - Mixpanel 프로젝트 토큰
- `VITE_SENTRY_DSN` - Sentry DSN
- `VITE_SENTRY_RELEASE` - Sentry 릴리즈 버전
- `VITE_ENABLE_SENTRY_IN_DEV` - 개발 환경에서 Sentry 활성화 여부 (true/false)
- `VITE_CHANNEL_PLUGIN_KEY` - Channel.io 플러그인 키
- `VITE_KAKAO_JAVASCRIPT_KEY` - Kakao JavaScript 키

## 프로젝트 구조

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
