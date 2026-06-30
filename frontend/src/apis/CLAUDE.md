# apis — API 레이어 & 인증

## API 레이어 패턴

API는 `src/apis/utils/apiHelpers.ts`의 헬퍼 함수를 사용하는 일관된 패턴을 따름:

- `handleResponse<T>()` - 응답 파싱, `{ data: {...} }` 형식 자동 언래핑
- `secureFetch()` - 인증된 요청, **401 시 토큰 자동 갱신** (`src/apis/auth/secureFetch.ts`)

- 도메인별 API 함수는 이 디렉토리에 둔다 (club, auth, application, applicants). 페이지나 컴포넌트 안에 직접 분산시키지 않는다.
- 쿼리 키는 `src/constants/queryKeys.ts`에 중앙 관리.

## 인증 플로우

- JWT는 localStorage에 저장 (`accessToken` 키, `src/constants/storageKeys.ts`에서 관리)
- 리프레시 토큰은 쿠키로 처리 (`credentials: 'include'`)
- `secureFetch()`가 1차 요청 → 401이면 `refreshAccessToken()`으로 토큰 재발급 후 재요청. refresh 실패 시 `REFRESH_FAILED` 에러
- 어드민 라우트는 `PrivateRoute` 컴포넌트로 보호

## 실시간 업데이트 (SSE)

지원자 상태 업데이트는 SSE(Server-Sent Events)로 처리. 관련 파일:

- `src/apis/clubSSE.ts` - SSE 연결
- `src/hooks/useApplicantSSE.ts` - 구독 훅
- `src/store/useAdminClubStore.ts` - 상태 관리 (Zustand)
