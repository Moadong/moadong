# API & 인증

## API 레이어 패턴

API는 `src/apis/utils/apiHelpers.ts`의 헬퍼 함수를 사용하는 일관된 패턴을 따름:

- `handleResponse<T>()` - 응답 파싱, `{ data: {...} }` 형식 자동 언래핑
- `secureFetch()` - 인증된 요청, 403 시 토큰 자동 갱신

쿼리 키는 `src/constants/queryKeys.ts`에 중앙 관리.

## 인증 플로우

- JWT는 localStorage에 저장 (`accessToken` 키, `src/constants/storageKeys.ts`에서 관리)
- 리프레시 토큰은 쿠키로 처리
- `src/apis/auth/secureFetch.ts`의 `secureFetch()`가 자동 토큰 갱신 담당
- 어드민 라우트는 `PrivateRoute` 컴포넌트로 보호

## 외부 서비스 통합

- **Mixpanel**: 사용자 분석 및 이벤트 트래킹
- **Sentry**: 에러 모니터링 및 성능 추적
- **Channel.io**: 고객 지원 채팅
- **Kakao SDK**: 카카오 공유 기능

모든 SDK는 `src/utils/initSDK.ts`에서 초기화되며, 각각 환경 변수 필요.

## 상수 관리

`src/constants/`에 모든 상수 중앙 관리:

- `queryKeys.ts` - React Query 쿼리 키 (도메인.액션 형식)
- `storageKeys.ts` - localStorage 키 (`accessToken`, `hasConsentedPersonalInfo`)
- `status.ts` - 지원 상태 정의 (PENDING, APPROVED, REJECTED 등)
- `eventName.ts` - Mixpanel 이벤트명
- `api.ts` - API 엔드포인트 URL
- `snsConfig.ts` - SNS 플랫폼 설정
- `applicationForm.ts` - 지원서 폼 설정
- `uploadLimit.ts` - 파일 업로드 제한
