# hooks/Queries — React Query

API를 래핑하는 React Query 훅 (useClub, useApplication, useApplicants 등). 데이터 패칭은 페이지/컴포넌트에서 직접 하지 말고 이 디렉토리의 기존 패턴을 우선 재사용한다.

## 캐싱 전략 (staleTime / gcTime)

데이터 변경 빈도와 실시간성 요구에 따라 아래 기준으로 설정:

| 데이터 성격                        | staleTime                | gcTime           | 사용 예                                 |
| ---------------------------------- | ------------------------ | ---------------- | --------------------------------------- |
| 거의 변하지 않는 정적 데이터       | `60 * 60 * 1000` (1시간) | `60 * 60 * 1000` | `useBanner`, `useGame` (종료된 최종 순위) |
| 자주 바뀌지 않는 일반 데이터       | `5 * 60 * 1000` (5분)    | 기본값 (5분)     | `useGoogleCalendar`, 클럽 캘린더 이벤트 |
| 일반 목록/상세 데이터              | `60 * 1000` (1분)        | 기본값           | 클럽 목록, 클럽 상세, `useFeedback`     |
| 폴링 + stale 마커                  | `60 * 1000` (1분)        | 기본값           | `usePromotion` (refetchInterval 병행, `poll: false`면 끔) |
| 사용자 입력에 반응하는 데이터      | `30 * 1000` (30초)       | 기본값           | (현재 사용처 없음)                      |
| 항상 최신값이 필요한 실시간 데이터 | `0`                      | 기본값           | 실시간 폴링이 필요한 데이터             |

**규칙:**

- `staleTime`만 설정하는 경우 `gcTime`은 기본값(5분)으로 유지
- 정적 데이터처럼 메모리에 오래 유지해야 하는 경우에만 `gcTime`을 `staleTime`과 함께 명시
- 실시간성이 중요한 데이터는 `staleTime: 0` (기본값이므로 생략 가능하나 의도 명시를 위해 작성)

## 쿼리 옵션 (`queryOptions`)

`queryClient`에 키를 넘겨 캐시를 직접 읽거나 쓰는 쿼리(`getQueryData`·`setQueryData`·`cancelQueries` 등)는 `queryOptions`로 정의하고, 키는 옵션에서 꺼내 쓴다(`notionQueries.pages().queryKey`). 꺼낸 키에는 데이터 타입이 붙어 있어 `setQueryData`에 모양이 다른 값을 넣으면 컴파일 에러가 난다. `queryKeys`의 키를 그대로 넘기면 이 검사가 없고, `getQueryData<T>`처럼 손으로 적은 타입은 틀려도 통과한다.

- 옵션은 훅 파일에 `도메인Queries` 객체로 둔다(`useNotionCalendar.ts`). `constants/queryKeys.ts`는 import 없는 상수 파일이고 영속화 판정(`utils/shouldPersistQuery.ts`)도 가져다 쓰므로 `queryFn`을 거기 넣지 않는다
- 옵션으로 바꾼 쿼리는 `useQuery`에 제네릭을 넘기지 않는다. 데이터 타입은 `queryFn`의 반환 타입에서 추론한다
- `useQuery`로만 쓰고 `invalidateQueries`만 거는 쿼리는 바꾸지 않아도 된다. 무효화는 접두사 키로 맞추므로 데이터 타입과 관계없다
- 기존 쿼리는 한꺼번에 옮기지 않고 그 파일을 고칠 때 옮긴다. 그래서 이 규칙과 다른 코드가 남아 있다. `useApplicants`의 낙관적 업데이트는 아직 `getQueryData<ApplicantsInfo>`처럼 손으로 적은 제네릭을 쓴다

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

## Notion 캘린더 연동 상태 (`useNotionCalendar`)

연동 이력이 없으면 백엔드가 데이터베이스·페이지 조회에 400 + `950-6`을 준다.
에러가 아니라 데이터베이스는 `[]`, 페이지는 `null`로 반환해 "연결 안 됨"으로 표시한다.
401·403도 같은 빈 상태로 처리하고, 나머지 `950-*`는 쿼리 오류로 남긴다.

## 공개 캘린더 무효화

공개 상세의 캘린더(`useGetClubCalendarEvents`)는 백엔드가 요청마다 노션·구글을 직접 조회해 합친 결과라 서버 쪽 캐시가 없고, 관리자가 바꾼 내용이 늦게 보이는 건 프론트 캐시 때문이다. 그래서 관리자 캘린더 mutation(구글 선택·해제, 노션 DB 적용·해제, 숨김·해제, 커스텀 생성·수정·삭제)은 성공 시 자기 키와 함께 `queryKeys.club.allCalendarEvents`를 무효화한다.

- 공개 키는 라우트에 따라 `@이름`이나 id로 만들어지고 관리자는 id만 알아서, 키 하나가 아니라 `['clubCalendarEvents']` 접두사로 지운다. 이 루트를 다른 키에 쓰지 말 것
- 노션 DB 적용(`useApplyNotionDatabase`)은 조회처럼 보이지만 서버가 이 요청에서 선택한 DB를 저장하므로 무효화 대상이다
- 무효화는 관리자 브라우저의 캐시만 지운다. 학생 브라우저와 노션·구글에서 직접 고친 내용은 `staleTime`이 지나야 반영된다
- 캘린더 쿼리는 `clubDetail.hasCalendarConnection`이 참일 때만 켜진다. 처음 연동하거나 마지막 연동을 끊은 직후에는 이 값이 상세 캐시(1분)에 남아 있어, 캘린더 키를 무효화해도 최대 1분 동안 일정 탭이 이전 연동 상태를 따른다. 상세 무효화는 일부러 범위에서 뺐다
- 캘린더 mutation을 새로 만들면 `calendarEventsInvalidation.test.tsx`의 목록에 추가한다

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

- 이미지는 피드·로고와 같은 presigned 방식이다. `POST /api/promotion/upload-url`(배열 요청, 항목별 `success`)로 발급받아 R2에 raw `fetch`로 PUT(`requiredHeaders` 그대로, Authorization 금지)하고, `finalUrl`을 **글 저장 요청의 `images`에 전체 목록으로** 보낸다. 키가 동아리 기준(`promotion/{clubId}/`)이라 게시글 없이도 발급되므로 순서는 **업로드 → 저장**이고, 작성은 POST 한 번으로 끝난다(`useUploadPromotionImages`, `usePromotionForm`). 한 요청에 16개 이상을 담으면 배열 전체가 거부된다
- 수정 PUT은 `images`가 1개 이상이어야 한다(`@NotEmpty`). 생성은 빈 배열 허용
- 심사 전 동아리는 서버가 403(902-2)로 막는다. 화면은 요청 전에 `ClubDetail.state === 'AVAILABLE'`로 먼저 막고 같은 문구를 보여준다. 판정은 `PromotionTab/constants.ts`의 `isClubApproved`로만 한다. 상세 API가 한때 설명값(`'활성화'`)을 줬는데 백엔드 #2013에서 enum 이름으로 통일됐다

## 관리자 clubId 확인 (`useVerifiedAdminClubId`)

저장된 `adminClubId`를 `getClubIdByToken`으로 다시 확인한다. 공개 동아리 상세의 관리자 버튼(`ClubApplyButton`)이 저장값이 아니라 이 결과로 판단한다. 저장값만 믿으면 토큰이 만료되거나 다른 계정 토큰으로 바뀌어도 이전 동아리의 관리자 버튼이 남는다.

- 저장값이 없으면 요청하지 않아 일반 방문자에게는 비용이 없다
- 키에 저장값을 넣어(`queryKeys.auth.adminClubId(storedClubId)`) 다른 계정으로 다시 로그인하면 이전 확인 결과를 쓰지 않는다
- `auth` 루트는 `PERSISTED_QUERY_ROOTS`에 없어 localStorage 캐시에 저장되지 않는다. 넣지 말 것
