# hooks/Queries — React Query

API를 래핑하는 React Query 훅 (useClub, useApplication, useApplicants 등). 데이터 패칭은 페이지/컴포넌트에서 직접 하지 말고 이 디렉토리의 기존 패턴을 우선 재사용한다.

## 캐싱 전략 (staleTime / gcTime)

데이터 변경 빈도와 실시간성 요구에 따라 아래 기준으로 설정:

| 데이터 성격                        | staleTime                | gcTime           | 사용 예                                 |
| ---------------------------------- | ------------------------ | ---------------- | --------------------------------------- |
| 거의 변하지 않는 정적 데이터       | `60 * 60 * 1000` (1시간) | `60 * 60 * 1000` | `useBanner`, `useGame` (종료된 최종 순위) |
| 자주 바뀌지 않는 일반 데이터       | `5 * 60 * 1000` (5분)    | 기본값 (5분)     | `useGoogleCalendar`, 클럽 캘린더 이벤트 |
| 일반 목록/상세 데이터              | `60 * 1000` (1분)        | 기본값           | 클럽 목록, 클럽 상세, `useFeedback`     |
| 폴링 + stale 마커                  | `60 * 1000` (1분)        | 기본값           | `usePromotion` (refetchInterval 병행)   |
| 사용자 입력에 반응하는 데이터      | `30 * 1000` (30초)       | 기본값           | 클럽 검색, 자동완성                     |
| 항상 최신값이 필요한 실시간 데이터 | `0`                      | 기본값           | 실시간 폴링이 필요한 데이터             |

**규칙:**

- `staleTime`만 설정하는 경우 `gcTime`은 기본값(5분)으로 유지
- 정적 데이터처럼 메모리에 오래 유지해야 하는 경우에만 `gcTime`을 `staleTime`과 함께 명시
- 실시간성이 중요한 데이터는 `staleTime: 0` (기본값이므로 생략 가능하나 의도 명시를 위해 작성)

## Google 캘린더 연동 상태 (`useGoogleCalendar`)

연동이 안 된 상태는 두 가지이고, 백엔드 에러 코드로 구분한다. 둘을 뭉치면
"연동이 왜 자꾸 풀리냐"를 사용자가 알 수 없으므로 반드시 나눠서 다룬다.

| 코드    | 의미                | 처리                                              |
| ------- | ------------------- | ------------------------------------------------- |
| `960-4` | 연동 이력 없음      | 에러가 아니라 `null`로 반환해 "연결 안 됨"으로 표시 |
| `960-3` | 토큰 갱신 실패(만료) | 에러로 던지고 `isTokenRefreshFailedError`로 판별해 재연동 안내 |

`960-3`은 재시도해도 같은 결과라 "다시 시도" UI를 띄우지 않는다.
Google OAuth 동의 화면이 테스트 모드면 refresh token이 7일 뒤 만료되므로,
프로덕션 게시 전까지는 이 상태가 정상적으로 자주 발생한다.

## 클럽 로고 (`useClub`)

로고가 없을 때 백엔드가 주는 값이 엔드포인트마다 다르다.

| 훅 | 백엔드 DTO | 로고 없을 때 |
| --- | --- | --- |
| `useGetClubDetail` | `ClubDetailedResult` | `""` (null 폴백이 있어 null은 오지 않음) |
| `useGetCardList` | `ClubSearchResult` | `null` 가능 (로고 삭제 시 `updateLogo(null)`) |

상세는 `""`가 보장되므로 `select`에서 `undefined`로 바꾸지 않는다.
`Club['logo']` 타입이 `string`인 것과 어긋나고, 소비자가 이미 전부
`logo || 기본이미지` 가드를 갖고 있어 얻는 것도 없다.

목록은 `null`이 올 수 있는데 타입은 `string`이라 아직 어긋나 있다.
`convertGoogleDriveUrl`이 null을 받으면 내부 `try/catch`가 삼켜
`console.error`만 남기고 null을 그대로 돌려주니, 무가드 프로퍼티
접근을 새로 추가하지 말 것.

## 홍보 게시글 관리 (`usePromotion`)

관리자 CRUD는 목록 쿼리 하나(`queryKeys.promotion.list()`)만 쓰고 생성·수정·삭제·업로드 뮤테이션이 모두 그 키를 무효화한다. 상세 조회 API가 없어 수정 화면도 목록에서 `id`로 찾는다.

- 이미지는 글이 있어야 올릴 수 있다(`POST /api/promotion/{id}/upload`). 서버가 업로드된 URL을 글의 `images`에 `$addToSet`으로 바로 넣으므로 **작성은 생성 → 업로드로 끝**, **수정은 업로드 → PUT(기존 유지분 + 새 URL)** 순서다. 순서를 뒤집으면 PUT이 새 URL을 모르거나 삭제한 이미지를 서버가 다시 살린다
- 수정 PUT은 `images`가 1개 이상이어야 한다(`@NotEmpty`). 생성은 빈 배열 허용
- 심사 전 동아리는 서버가 403(902-2)로 막는다. 화면은 요청 전에 `ClubDetail.state`로 먼저 막고 같은 문구를 보여준다. 주의: 상세 API의 `state`는 enum 이름이 아니라 설명값(`'활성화'`/`'비활성화'`)이고 목록 API는 `'AVAILABLE'`이다. 판정은 `PromotionTab/constants.ts`의 `isClubApproved`로만 한다
