# apis — API 레이어 & 인증

## API 레이어 패턴

API는 `src/apis/utils/apiHelpers.ts`의 헬퍼 함수를 사용하는 일관된 패턴을 따름:

- `handleResponse<T>()` - 응답 파싱, `{ data: {...} }` 형식 자동 언래핑
- `secureFetch()` - 인증된 요청, **401 시 토큰 자동 갱신** (`src/apis/auth/secureFetch.ts`)
- `studentFetch()` - 익명 학생 토큰 요청 (`src/apis/auth/studentFetch.ts`). 우체통 전용
- `fetchWithTimeout()` - 타임아웃(기본 10s) 붙은 fetch 래퍼 (`src/apis/utils/fetchWithTimeout.ts`). 타임아웃/네트워크 실패를 `NetworkError`로 변환, 호출부 signal 병합 지원. API 호출은 raw `fetch` 대신 이걸 사용 (예외: SSE 스트림, S3 presigned 업로드)

- 도메인별 API 함수는 이 디렉토리에 둔다 (club, auth, application, applicants). 페이지나 컴포넌트 안에 직접 분산시키지 않는다.
- 쿼리 키는 `src/constants/queryKeys.ts`에 중앙 관리.

## 인증 플로우

- JWT는 localStorage에 저장 (`accessToken` 키, `src/constants/storageKeys.ts`에서 관리)
- 리프레시 토큰은 쿠키로 처리 (`credentials: 'include'`)
- `secureFetch()`가 1차 요청 → 401이면 `refreshAccessToken()`으로 토큰 재발급 후 재요청. refresh 실패 시 `REFRESH_FAILED` 에러
- 어드민 라우트는 `PrivateRoute` 컴포넌트로 보호

### 익명 학생 토큰 (우체통)

우체통은 로그인 없이 쓰지만 '내가 보낸 편지'를 구분해야 해서 별도 토큰을 쓴다.

- `POST /auth/student`로 발급, localStorage `studentAccessToken`에 저장
- 만료가 없어 refresh 흐름이 없다. 저장된 토큰이 무효할 때(서명 키 교체 등)만 401에서 한 번 재발급 후 재시도
- 발급은 `issueStudentTokenOnce()`로 합친다. 발급마다 새 UUID라 동시 요청이 각자 발급받으면 학생 신원이 갈린다

## 실시간 업데이트 (SSE)

지원자 상태 업데이트는 SSE(Server-Sent Events)로 처리. 관련 파일:

- `src/apis/clubSSE.ts` - SSE 연결
- `src/hooks/useApplicantSSE.ts` - 구독 훅
- `src/store/useAdminClubStore.ts` - 상태 관리 (Zustand)
