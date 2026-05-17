# API & 인증

## API 레이어 패턴

API는 `src/apis/utils/apiHelpers.ts`의 헬퍼 함수를 사용하는 일관된 패턴을 따름:

- `handleResponse<T>()` - 응답 파싱, `{ data: {...} }` 형식 자동 언래핑
- `secureFetch()` - 인증된 요청, 401 시 토큰 자동 갱신

쿼리 키는 `src/constants/queryKeys.ts`에 중앙 관리.

## React Query 캐싱 전략 (staleTime / gcTime)

데이터 변경 빈도와 실시간성 요구에 따라 아래 기준으로 설정:

| 데이터 성격                        | staleTime                            | gcTime                | 사용 예                                 |
| ---------------------------------- | ------------------------------------ | --------------------- | --------------------------------------- |
| 데이터 성격                        | staleTime                            | gcTime                | 사용 예                                 |
| ---------------------------------- | ------------------------------------ | --------------------- | -------------------------------------   |
| 거의 변하지 않는 정적 데이터       | `60 * 60 * 1000` (1시간)             | `60 * 60 * 1000`      | `useBanner`                             |
| 자주 바뀌지 않는 일반 데이터       | `5 * 60 * 1000` (5분)                | 기본값 (5분)          | `useGoogleCalendar`, 클럽 캘린더 이벤트 |
| 일반 목록/상세 데이터              | `60 * 1000` (1분)                    | 기본값                | 클럽 목록, 클럽 상세                    |
| 폴링 + stale 마커                  | `60 * 1000` (1분)                    | 기본값                | `usePromotion` (refetchInterval 병행)   |
| 사용자 입력에 반응하는 데이터      | `30 * 1000` (30초)                   | 기본값                | 클럽 검색, 자동완성                     |
| 항상 최신값이 필요한 실시간 데이터 | `0`                                  | 기본값                | `useGame`                               |

**규칙:**

- `staleTime`만 설정하는 경우 `gcTime`은 기본값(5분)으로 유지
- 정적 데이터처럼 메모리에 오래 유지해야 하는 경우에만 `gcTime`을 `staleTime`과 함께 명시
- 실시간성이 중요한 데이터는 `staleTime: 0` (기본값이므로 생략 가능하나 의도 명시를 위해 작성)

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
