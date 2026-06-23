# FCM 관리자 예약 알림 스펙

## 목적

개발자 포털에서 FCM 알림을 즉시 발송하는 것뿐 아니라,
지정한 시각에 발송되도록 예약하고, 예약 목록을 확인하고, 발송 전 예약을 취소할 수 있어야 한다.

현재 개발자 포털의 FCM 알림 기능은 단건 발송과 전체 발송만 지원한다.
예약 알림은 이 기존 발송 경로를 재사용하되, 발송 요청을 MongoDB에 저장한 뒤 스케줄러가 만료된 예약을 처리하는 방식으로 확장한다.

## 대상 범위

- 개발자 포털 FCM 알림 관리 화면
- FCM 예약 알림 생성 API
- FCM 예약 알림 목록/상세 조회 API
- FCM 예약 알림 취소 API
- 예약 알림 발송 스케줄러
- 예약 알림 저장 엔티티와 Repository
- 예약 알림 서비스 테스트와 스케줄러 테스트

## 사용자 시나리오

1. 개발자가 개발자 포털에 로그인한다.
2. `FCM 알림` 메뉴에서 예약 알림 영역을 연다.
3. 발송 대상, 제목, 본문, data JSON, 예약 시각을 입력한다.
4. `예약` 버튼을 누른다.
5. 예약 목록에서 방금 만든 예약을 확인한다.
6. 발송 전 예약이 필요 없어지면 `취소` 버튼을 누른다.
7. 취소된 예약은 발송되지 않고 목록에서 `취소됨` 상태로 표시된다.
8. 예약 시각이 되면 서버 스케줄러가 기존 FCM 발송 포트를 통해 알림을 보낸다.

## 현재 코드 연결점

대상 UI:

- `backend/src/main/resources/static/dev/index.html`

기존 관리자 FCM API:

- `backend/src/main/java/moadong/fcm/controller/FcmAdminController.java`
- `backend/src/main/java/moadong/fcm/service/FcmAdminService.java`

기존 FCM 발송 포트:

- `backend/src/main/java/moadong/fcm/port/PushNotificationPort.java`
- `backend/src/main/java/moadong/fcm/adapter/FirebasePushNotificationAdapter.java`

기존 인증 경계:

- `/api/admin/**`는 `DEVELOPER` 권한만 접근 가능하다.

## 핵심 원칙

1. 예약 발송은 기존 `PushNotificationPort`를 통해 수행한다.
2. 예약 생성 시에는 Firebase로 아무 메시지도 보내지 않는다.
3. 발송 전 취소된 예약은 절대 발송하지 않는다.
4. 이미 발송 중이거나 발송 완료된 예약은 취소할 수 없다.
5. 스케줄러가 중복 실행되어도 같은 예약은 한 번만 발송되어야 한다.
6. 날짜/시간 입력은 개발자 포털에서는 `Asia/Seoul` 기준으로 받고, 서버 저장은 명확한 기준 시각으로 보존한다.

## 데이터 스펙

신규 엔티티:

- `FcmScheduledNotification`

권장 패키지:

- `backend/src/main/java/moadong/fcm/entity/FcmScheduledNotification.java`

Mongo 컬렉션:

- `fcm_scheduled_notifications`

인덱스:

- `status ASC, scheduledAt ASC`
- 이름: `idx_fcm_schedule_status_scheduled_at`
- 목적: dispatcher가 `status = SCHEDULED`, `scheduledAt <= now` 조건으로 due 예약을 반복 조회할 때 전체 스캔을 피한다.

### 필드

- `id: String`
- `targetType: FcmScheduleTargetType`
- `token: String | null`
- `title: String`
- `body: String`
- `data: Map<String, String>`
- `scheduledAt: Instant`
- `status: FcmScheduleStatus`
- `createdAt: Instant`
- `updatedAt: Instant | null`
- `createdBy: String | null`
- `sendingStartedAt: Instant | null`
- `canceledAt: Instant | null`
- `sentAt: Instant | null`
- `failureReason: String | null`
- `messageId: String | null`
- `totalCount: int`
- `successCount: int`
- `failureCount: int`
- `failedTokens: List<String>`

### targetType

- `SINGLE_TOKEN`: 특정 토큰 하나에 발송한다.
- `ALL_TOKENS`: 저장된 전체 토큰에 발송한다.

### status

- `SCHEDULED`: 발송 대기
- `SENDING`: 스케줄러가 발송 처리 중
- `SENT`: 발송 완료
- `CANCELED`: 발송 전 취소
- `FAILED`: 발송 실패

### 생성 기본값

- `status = SCHEDULED`
- `createdAt = now`
- `updatedAt = null`
- `sendingStartedAt = null`
- `canceledAt = null`
- `sentAt = null`
- `failureReason = null`
- `messageId = null`
- `totalCount = 0`
- `successCount = 0`
- `failureCount = 0`
- `failedTokens = []`

## Repository 스펙

신규 Repository:

- `FcmScheduledNotificationRepository`

필수 조회:

- `findByStatusOrderByScheduledAtDesc(FcmScheduleStatus status)`
- `findAllByOrderByScheduledAtDesc()`
- `findByStatusAndScheduledAtLessThanEqual(FcmScheduleStatus status, Instant now)`

동시성 제어 권장:

- 예약 발송 직전 `SCHEDULED -> SENDING` 상태 전이를 원자적으로 처리한다.
- 예약 취소도 `SCHEDULED -> CANCELED` 상태 전이를 원자적으로 처리한다.
- 단순 `find` 후 `save`만 사용하면 다중 인스턴스 또는 중복 스케줄러 실행 시 중복 발송 위험이 있다.
- 구현 시 `MongoTemplate findAndModify`를 사용한다.

## API 스펙

공통 prefix:

- `/api/admin/fcm/schedules`

권한:

- `DEVELOPER`

### 예약 생성

`POST /api/admin/fcm/schedules`

요청:

```json
{
  "targetType": "SINGLE_TOKEN",
  "token": "fcm-token",
  "title": "알림 제목",
  "body": "알림 본문",
  "data": {
    "path": "/webview/clubDetail/club-id",
    "action": "NAVIGATE_WEBVIEW"
  },
  "scheduledAt": "2026-06-10T09:30:00+09:00"
}
```

`ALL_TOKENS` 요청에서는 `token`을 보내지 않는다.

성공 응답:

- HTTP `200`
- 메시지: `FCM 예약 알림이 생성되었습니다.`
- data: 생성된 예약 요약

검증:

- `targetType`은 필수다.
- `title`과 `body`는 공백일 수 없다.
- `SINGLE_TOKEN`이면 `token`은 필수다.
- `ALL_TOKENS`이면 `token`은 무시하거나 저장하지 않는다.
- `scheduledAt`은 현재 시각보다 이후여야 한다.
- `data`는 JSON 객체여야 하며 key는 공백일 수 없고 value는 null일 수 없다.

### 예약 목록 조회

`GET /api/admin/fcm/schedules`

쿼리:

- `status`: 선택. 없으면 전체 조회.

성공 응답:

- HTTP `200`
- data: 예약 목록

목록 정렬:

- 기본 정렬은 `scheduledAt DESC`

목록 항목:

- `id`
- `targetType`
- `title`
- `body`
- `scheduledAt`
- `status`
- `createdAt`
- `canceledAt`
- `sentAt`
- `totalCount`
- `successCount`
- `failureCount`

### 예약 상세 조회

`GET /api/admin/fcm/schedules/{scheduleId}`

성공 응답:

- HTTP `200`
- data: 예약 상세

실패 응답:

- HTTP `404`
- 메시지: `FCM 예약 알림이 존재하지 않습니다.`

### 예약 취소

`DELETE /api/admin/fcm/schedules/{scheduleId}`

동작:

1. `findAndModify`로 `SCHEDULED -> CANCELED` 전환을 시도한다.
2. 전환에 성공하면 `canceledAt = now`, `updatedAt = now`를 저장하고 응답한다.
3. 전환에 실패하면 예약 존재 여부를 조회한다.
4. 예약이 없으면 404를 응답한다.
5. 예약이 있지만 `SCHEDULED`가 아니면 409를 응답한다.

성공 응답:

- HTTP `200`
- 메시지: `FCM 예약 알림이 취소되었습니다.`

실패 응답:

- HTTP `404`
  - 메시지: `FCM 예약 알림이 존재하지 않습니다.`
- HTTP `409`
  - 메시지: `이미 발송 중이거나 처리 완료된 예약 알림은 취소할 수 없습니다.`

## 스케줄러 스펙

신규 스케줄러:

- `FcmScheduledNotificationDispatcher`

권장 실행 주기:

- 1분마다 실행
- `@Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")`
- ShedLock 사용 권장

처리 대상:

- `status = SCHEDULED`
- `scheduledAt <= now`

처리 순서:

1. due 예약 목록을 조회한다.
2. 각 예약을 원자적으로 `SCHEDULED -> SENDING`으로 전환한다.
3. 전환에 성공하면 `sendingStartedAt = now`, `updatedAt = now`를 저장한다.
4. 전환에 실패한 예약은 취소되었거나 다른 실행자가 가져간 것으로 보고 건너뛴다.
5. `SINGLE_TOKEN`이면 `PushNotificationPort.sendToToken(...)`을 호출한다.
6. `ALL_TOKENS`이면 기존 `FcmAdminService.getAllAvailableToken()` 또는 동등한 토큰 조회 로직으로 대상 토큰을 가져온 뒤 `sendToTokens(...)`를 호출한다.
7. 성공하면 `SENT`, `sentAt`, `updatedAt`, 발송 결과 카운트를 저장한다.
8. 실패하면 `FAILED`, `failureReason`, `updatedAt`을 저장한다.

### 실패 처리

`SINGLE_TOKEN` 발송 실패:

- `status = FAILED`
- `totalCount = 1`
- `failureCount = 1`
- `successCount = 0`

`ALL_TOKENS` 일부 실패:

- Firebase 호출 자체가 완료되면 `SENT`로 본다.
- `failureCount`와 `failedTokens`에 실패 정보를 남긴다.

`ALL_TOKENS` 전체 호출 예외:

- `status = FAILED`
- `failureReason`에 예외 메시지를 저장한다.

### 발송 결과 저장 계약

`SINGLE_TOKEN` 성공:

- `status = SENT`
- `totalCount = 1`
- `successCount = 1`
- `failureCount = 0`
- `messageId = TokenPushResult.messageId`
- `sentAt = now`

`SINGLE_TOKEN` 실패:

- `status = FAILED`
- `totalCount = 1`
- `successCount = 0`
- `failureCount = 1`
- `failureReason` 저장

`ALL_TOKENS` 대상 토큰 0개:

- `status = SENT`
- `totalCount = 0`
- `successCount = 0`
- `failureCount = 0`
- `sentAt = now`

`ALL_TOKENS` Firebase 호출 완료:

- `status = SENT`
- `totalCount = 발송 대상 토큰 수`
- `successCount = MulticastPushResult.successCount`
- `failureCount = MulticastPushResult.failureCount`
- `failedTokens = MulticastPushResult.failedTokens`
- `sentAt = now`

`ALL_TOKENS` Firebase 호출 예외:

- `status = FAILED`
- `totalCount = 발송 대상 토큰 수`
- `failureReason` 저장

## UI 스펙

대상 파일:

- `backend/src/main/resources/static/dev/index.html`

### 메뉴

기존 `FCM 알림` 메뉴 안에 아래 영역을 추가한다.

- `예약 알림 만들기`
- `예약 알림 목록`

### 예약 생성 폼

입력 항목:

- 대상 유형: `단건 토큰`, `전체 토큰`
- 대상 토큰: 단건일 때만 활성화
- 제목
- 본문
- data JSON
- 예약 날짜
- 예약 시간

버튼:

- `예약`
- `초기화`

### 예약 목록

표시 컬럼:

- 예약 시각
- 대상
- 제목
- 상태
- 발송 결과
- 생성 시각
- 액션

액션:

- `상세`
- `취소`

`취소` 버튼 활성화 조건:

- `status = SCHEDULED`

### UI 상태 처리

예약 생성 중:

- 생성 버튼 비활성화
- 버튼 텍스트 `예약 중...`

목록 조회 중:

- 목록 영역에 `예약 알림을 불러오는 중...`

취소 중:

- 해당 행의 취소 버튼 비활성화
- 취소 완료 후 목록 새로고침

### 프론트 검증

예약 요청 전 아래를 검증한다.

1. 제목과 본문이 비어 있지 않다.
2. 단건 토큰 대상이면 토큰이 비어 있지 않다.
3. 예약 날짜/시간이 입력되어 있다.
4. 예약 시각이 현재보다 이후다.
5. data JSON이 비어 있지 않다면 JSON 객체로 파싱된다.

## 구현 계획

### 1단계: 도메인 모델과 계약 추가

추가 파일:

- `backend/src/main/java/moadong/fcm/entity/FcmScheduledNotification.java`
- `backend/src/main/java/moadong/fcm/enums/FcmScheduleTargetType.java`
- `backend/src/main/java/moadong/fcm/enums/FcmScheduleStatus.java`
- `backend/src/main/java/moadong/fcm/repository/FcmScheduledNotificationRepository.java`

패키지 배치 원칙:

- 기존 `moadong.fcm` 하위 패키지 구조를 그대로 따른다.
- controller는 `moadong.fcm.controller`
- service와 scheduler/dispatcher는 `moadong.fcm.service`
- entity는 `moadong.fcm.entity`
- repository는 `moadong.fcm.repository`
- request DTO는 `moadong.fcm.payload.request`
- response DTO는 `moadong.fcm.payload.response`
- enum은 `moadong.fcm.enums`
- Firebase 발송은 기존 `moadong.fcm.port`와 `moadong.fcm.adapter`를 재사용한다.

구현 내용:

1. 예약 알림 Mongo 문서를 표현하는 엔티티를 만든다.
2. `SINGLE_TOKEN`, `ALL_TOKENS` 대상 타입 enum을 만든다.
3. `SCHEDULED`, `SENDING`, `SENT`, `CANCELED`, `FAILED` 상태 enum을 만든다.
4. 기본 생성 메서드 또는 정적 팩토리에서 생성 기본값을 보장한다.
5. 상태 변경 메서드를 엔티티에 둔다.

필수 엔티티 메서드:

- `markSending()`
- `markSent(...)`
- `markFailed(String failureReason)`
- `cancel(Instant canceledAt)`
- `isCancelable()`

주의:

- status 필드는 외부에서 직접 바꾸지 않고 엔티티 메서드로만 바꾼다.
- `data`와 `failedTokens`는 null 대신 빈 컬렉션으로 보존한다.

### 2단계: 요청/응답 DTO 추가

추가 패키지:

- `backend/src/main/java/moadong/fcm/payload/request`
- `backend/src/main/java/moadong/fcm/payload/response`

추가 DTO:

- `FcmScheduleCreateRequest`
- `FcmScheduleSummaryResponse`
- `FcmScheduleDetailResponse`
- `FcmScheduleCancelResponse`

요청 검증:

1. `targetType` 필수
2. `title` 필수, blank 금지
3. `body` 필수, blank 금지
4. `scheduledAt` 필수
5. `SINGLE_TOKEN`이면 `token` 필수
6. `ALL_TOKENS`이면 `token` 저장 제외
7. `data` key blank 금지, value null 금지

시간 타입:

- 요청 DTO는 `OffsetDateTime scheduledAt`을 받는다.
- 서비스 진입 시 `Instant`로 변환한다.
- UI는 `Asia/Seoul` 기준 날짜/시간을 조합해 offset 포함 문자열로 보낸다.

### 3단계: 예약 서비스 추가

추가 파일:

- `backend/src/main/java/moadong/fcm/service/FcmScheduledNotificationService.java`

책임:

1. 예약 생성
2. 예약 목록 조회
3. 예약 상세 조회
4. 예약 취소
5. due 예약 조회
6. 발송 선점
7. 발송 결과 저장

권장 public 메서드:

- `FcmScheduleDetailResponse create(FcmScheduleCreateRequest request)`
- `List<FcmScheduleSummaryResponse> getSchedules(FcmScheduleStatus status)`
- `FcmScheduleDetailResponse getSchedule(String scheduleId)`
- `FcmScheduleCancelResponse cancel(String scheduleId)`
- `List<FcmScheduledNotification> findDueSchedules(Instant now)`
- `Optional<FcmScheduledNotification> claimForSending(String scheduleId, Instant now)`
- `Optional<FcmScheduledNotification> cancelIfScheduled(String scheduleId, Instant now)`
- `void markSingleSent(String scheduleId, String messageId, Instant sentAt)`
- `void markSingleFailed(String scheduleId, String failureReason)`
- `void markBatchSent(String scheduleId, int totalCount, MulticastPushResult result, Instant sentAt)`
- `void markNoTargetSent(String scheduleId, Instant sentAt)`
- `void markFailed(String scheduleId, String failureReason)`

구현 기준:

- `create`는 예약 저장만 수행하고 Firebase를 호출하지 않는다.
- `cancel`은 `SCHEDULED` 상태에서만 성공한다.
- `cancel`은 `MongoTemplate.findAndModify`로 `SCHEDULED -> CANCELED` 전환에 성공한 경우에만 성공한다.
- `claimForSending`은 `MongoTemplate.findAndModify`로 구현한다.
- `claimForSending` 조건은 `id`, `status = SCHEDULED`, `scheduledAt <= now`를 모두 포함한다.
- `markSent`, `markFailed`는 `SENDING` 상태 예약만 갱신한다.
- `FcmDispatchResult` 같은 별도 public model은 1차 구현에서 만들지 않는다.
- dispatcher가 `TokenPushResult`와 `MulticastPushResult`를 각각 해석해 service의 상태 갱신 메서드를 호출한다.

### 4단계: 원자적 선점 Repository 구현

추가 파일:

- `backend/src/main/java/moadong/fcm/repository/FcmScheduledNotificationRepositoryCustom.java`
- `backend/src/main/java/moadong/fcm/repository/FcmScheduledNotificationRepositoryImpl.java`

역할:

- Spring Data repository 메서드만으로 표현하기 어려운 `findAndModify` 선점 로직을 custom repository로 분리한다.
- 별도 `ClaimRepository` 이름을 만들지 않고 Spring Data custom repository 관례를 따른다.

Repository 구성:

```java
public interface FcmScheduledNotificationRepository
        extends MongoRepository<FcmScheduledNotification, String>,
                FcmScheduledNotificationRepositoryCustom {
}
```

Custom interface:

```java
public interface FcmScheduledNotificationRepositoryCustom {
    Optional<FcmScheduledNotification> claimForSending(String scheduleId, Instant now);
    Optional<FcmScheduledNotification> cancelIfScheduled(String scheduleId, Instant now);
}
```

핵심 쿼리:

1. `_id = scheduleId`
2. `status = SCHEDULED`
3. `scheduledAt <= now`

핵심 업데이트:

1. `status = SENDING`
2. `sendingStartedAt = now`
3. `updatedAt = now`

반환:

- 선점 성공 시 갱신된 문서
- 실패 시 empty

취소 쿼리:

1. `_id = scheduleId`
2. `status = SCHEDULED`

취소 업데이트:

1. `status = CANCELED`
2. `canceledAt = now`
3. `updatedAt = now`

취소 반환:

- 취소 성공 시 갱신된 문서
- 실패 시 empty

구현 주의:

- 구현체 이름은 반드시 `FcmScheduledNotificationRepositoryImpl`로 둔다.
- Spring Data가 `FcmScheduledNotificationRepositoryCustom` 구현체로 자동 연결할 수 있게 같은 repository 패키지에 둔다.
- `MongoTemplate` 사용 범위는 선점과 원자적 취소 로직으로 제한한다.

### 5단계: 발송 Dispatcher 추가

추가 파일:

- `backend/src/main/java/moadong/fcm/service/FcmScheduledNotificationDispatcher.java`

책임:

1. 1분마다 due 예약을 조회한다.
2. 각 예약을 선점한다.
3. 선점 성공한 예약만 발송한다.
4. 발송 결과를 예약 문서에 저장한다.

스케줄 설정:

- `@Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")`
- `@SchedulerLock(name = "FcmScheduledNotificationDispatcher", lockAtMostFor = "2m", lockAtLeastFor = "5s")`

발송 분기:

- `SINGLE_TOKEN`
  - `PushNotificationPort.sendToToken(new TokenPushPayload(...))`
  - 성공이면 `messageId`, `successCount = 1`, `failureCount = 0`
  - 실패이면 `FAILED`
- `ALL_TOKENS`
  - `FcmAdminService.getAllAvailableToken()`으로 발송 시점 토큰 조회
  - 토큰이 없으면 `SENT`, `totalCount = 0`, `successCount = 0`, `failureCount = 0`
  - 토큰이 있으면 `PushNotificationPort.sendToTokens(new MulticastPushPayload(...))`
  - Firebase 멀티캐스트 결과는 `SENT`로 저장하고 실패 토큰 목록을 함께 저장

예외 처리:

- 예약 하나의 실패가 전체 dispatcher 실행을 중단하지 않게 한다.
- 예외 발생 예약은 `FAILED`로 저장한다.
- 다음 예약 처리를 계속한다.

### 6단계: 관리자 API 추가

추가 파일:

- `backend/src/main/java/moadong/fcm/controller/FcmScheduledNotificationAdminController.java`

엔드포인트:

- `POST /api/admin/fcm/schedules`
- `GET /api/admin/fcm/schedules`
- `GET /api/admin/fcm/schedules/{scheduleId}`
- `DELETE /api/admin/fcm/schedules/{scheduleId}`

구현 기준:

- 기존 `FcmAdminController`에 과도하게 붙이지 않고 별도 컨트롤러로 분리한다.
- 공통 prefix는 `/api/admin/fcm/schedules`로 둔다.
- 보안은 기존 `/api/admin/**` 정책을 그대로 탄다.
- 기존 즉시 발송 API는 변경하지 않는다.
- 기존 `FcmAdminService`의 책임을 무리하게 확장하지 않고, 예약 알림 전용 controller/service를 둔다.

### 7단계: ErrorCode 추가

대상 파일:

- `backend/src/main/java/moadong/global/exception/ErrorCode.java`

추가 후보:

- `FCM_SCHEDULE_NOT_FOUND`
- `FCM_SCHEDULE_INVALID_TIME`
- `FCM_SCHEDULE_NOT_CANCELABLE`
- `FCM_SCHEDULE_INVALID_REQUEST`

권장 코드 대역:

- 기존 FCM이 `901-x`를 쓰므로 `901-4`부터 이어간다.

메시지:

- `FCM 예약 알림이 존재하지 않습니다.`
- `예약 시각은 현재 시각보다 이후여야 합니다.`
- `이미 발송 중이거나 처리 완료된 예약 알림은 취소할 수 없습니다.`
- `FCM 예약 알림 요청이 올바르지 않습니다.`

### 8단계: 개발자 포털 UI 연결

대상 파일:

- `backend/src/main/resources/static/dev/index.html`

구현 위치:

- 기존 `section id="fcm"` 내부
- 즉시 단건/전체 발송 아래에 예약 생성과 예약 목록을 추가한다.
- 기존 `fcmTokens`, `fcmFilteredTokens`, `loadFcmTokens` 계열 상태와 함수 이름을 유지하고 예약 기능은 `fcmSchedule` prefix를 사용한다.
- 기존 `headers()`, `parseFcmDataMap(...)`, `setMessageBox(...)`, `showToast(...)` 유틸을 재사용한다.

추가 상태 변수:

- `fcmSchedules = []`
- `fcmScheduleStatusFilter = ''`
- `fcmScheduleIsLoading = false`
- `fcmScheduleIsCreating = false`
- `fcmScheduleCancelingIds = new Set()`

추가 함수:

- `buildFcmSchedulePayload()`
- `loadFcmSchedules()`
- `renderFcmScheduleRows()`
- `createFcmSchedule()`
- `cancelFcmSchedule(scheduleId)`
- `resetFcmScheduleForm()`
- `formatFcmScheduleDateTime(value)`

UI API 호출:

- 생성: `POST API_BASE + '/api/admin/fcm/schedules'`
- 목록: `GET API_BASE + '/api/admin/fcm/schedules?status=' + status`
- 상세: `GET API_BASE + '/api/admin/fcm/schedules/' + id`
- 취소: `DELETE API_BASE + '/api/admin/fcm/schedules/' + id`

### 9단계: 회귀 확인

기존 즉시 발송은 변경하지 않는다.

회귀 확인 대상:

1. 토큰 목록 조회
2. 단건 즉시 발송
3. 전체 즉시 발송
4. FCM data JSON 파싱
5. 개발자 권한 403 처리

## 구현 순서

권장 커밋/작업 단위:

1. Red: 예약 생성/검증 서비스 테스트 작성
2. Green: 엔티티, enum, repository, create 구현
3. Red: 조회/취소 서비스 테스트 작성
4. Green: 목록/상세/취소 구현
5. Red: 선점 repository와 dispatcher 테스트 작성
6. Green: `findAndModify` 선점과 dispatcher 구현
7. Red: 관리자 API 테스트 작성
8. Green: controller와 request/response 연결
9. Red: 개발자 포털 payload/validation 흐름 확인
10. Green: 개발자 포털 UI 추가
11. Refactor: 중복 DTO 변환, 시간 변환, 메시지 정리
12. Regression: FCM 기존 즉시 발송 테스트 확인

## 위험 지점과 대응

### 중복 발송

위험:

- 다중 인스턴스, 스케줄러 중복 실행, 긴 Firebase 호출 때문에 같은 예약이 두 번 발송될 수 있다.

대응:

- 발송 전 `findAndModify`로 `SCHEDULED -> SENDING` 선점한다.
- 선점 실패 시 발송하지 않는다.
- ShedLock은 보조 방어선으로만 본다.

### 예약 시각 해석 오류

위험:

- 개발자 포털은 KST로 입력했는데 서버가 UTC 또는 로컬 JVM 시간으로 다르게 해석할 수 있다.

대응:

- 요청은 offset 포함 ISO 문자열로 보낸다.
- 서버는 `OffsetDateTime`으로 받고 `Instant`로 저장한다.
- 응답은 `Instant` 또는 offset 포함 문자열로 내려주고 UI에서 KST로 표시한다.

### 전체 발송 대상 기준

위험:

- 예약 생성 시점 토큰과 발송 시점 토큰이 다를 수 있다.

대응:

- 1차 구현은 발송 시점 최신 토큰을 사용한다.
- 이 정책을 UI 또는 상세 응답에 별도로 표시하지는 않는다.

### Firebase 장애

위험:

- Firebase 호출 예외 때문에 스케줄러 전체가 중단될 수 있다.

대응:

- 예약 단위로 try/catch 처리한다.
- 실패 예약은 `FAILED`로 남기고 다음 예약 처리를 계속한다.

### SENDING 고착

위험:

- `SCHEDULED -> SENDING` 선점 후 서버가 죽으면 예약이 `SENDING`에 고착될 수 있다.

1차 대응:

- 상세/목록에서 `SENDING` 상태를 노출한다.
- 운영자가 수동 확인할 수 있게 한다.

후속 과제:

- `SENDING` 상태가 일정 시간 이상 지속되면 `FAILED` 또는 `SCHEDULED`로 되돌리는 복구 배치를 추가한다.
- 1차 구현에서는 `sendingStartedAt`을 저장해 후속 복구 배치가 기준 시각으로 사용할 수 있게 한다.

## TDD 기준

### Red 1: 예약 생성 서비스

테스트 대상:

- `FcmScheduledNotificationService`

검증:

1. 유효한 단건 예약 요청을 저장하면 `SCHEDULED` 상태가 된다.
2. 유효한 전체 예약 요청을 저장하면 token 없이 저장된다.
3. 과거 시각 예약은 실패한다.
4. 단건 예약에서 token이 없으면 실패한다.
5. title/body가 공백이면 실패한다.

### Red 2: 예약 조회/취소 서비스

검증:

1. 예약 목록은 `scheduledAt DESC`로 반환된다.
2. `SCHEDULED` 예약은 취소할 수 있다.
3. 취소된 예약은 `CANCELED`와 `canceledAt`을 가진다.
4. `SENT`, `SENDING`, `FAILED`, `CANCELED` 예약은 취소할 수 없다.
5. 없는 예약을 조회하거나 취소하면 404에 해당하는 예외가 발생한다.
6. 취소는 `cancelIfScheduled` 원자 전환 성공 시에만 성공한다.

### Red 2.5: 원자적 Repository

테스트 대상:

- `FcmScheduledNotificationRepository`
- `FcmScheduledNotificationRepositoryCustom`

검증:

1. `claimForSending`은 due `SCHEDULED` 예약만 `SENDING`으로 전환한다.
2. `claimForSending`은 미래 예약을 전환하지 않는다.
3. `claimForSending`은 `CANCELED`, `SENDING`, `SENT`, `FAILED` 예약을 전환하지 않는다.
4. `claimForSending` 성공 시 `sendingStartedAt`과 `updatedAt`이 저장된다.
5. `cancelIfScheduled`는 `SCHEDULED` 예약만 `CANCELED`로 전환한다.
6. `cancelIfScheduled`는 `SENDING`, `SENT`, `FAILED`, `CANCELED` 예약을 전환하지 않는다.
7. `cancelIfScheduled` 성공 시 `canceledAt`과 `updatedAt`이 저장된다.

### Red 3: 예약 발송 스케줄러

검증:

1. due 예약만 발송한다.
2. 미래 예약은 발송하지 않는다.
3. 취소된 예약은 발송하지 않는다.
4. 단건 예약은 `sendToToken`을 호출한다.
5. 전체 예약은 `sendToTokens`를 호출한다.
6. 성공 시 `SENT`와 `sentAt`을 저장한다.
7. 실패 시 `FAILED`와 `failureReason`을 저장한다.
8. `SCHEDULED -> SENDING` 전이에 실패한 예약은 발송하지 않는다.

### Red 4: 관리자 API

테스트 대상:

- `FcmScheduledNotificationAdminControllerTest`

검증:

1. `POST /api/admin/fcm/schedules`가 예약을 생성한다.
2. `GET /api/admin/fcm/schedules`가 목록을 반환한다.
3. `GET /api/admin/fcm/schedules/{id}`가 상세를 반환한다.
4. `DELETE /api/admin/fcm/schedules/{id}`가 예약을 취소한다.
5. 개발자 권한이 없으면 `/api/admin/**` 보안 정책에 의해 거부된다.

### Red 5: 개발자 포털 UI

현재 정적 HTML 중심 구조이므로 우선 수동 검증 가능한 함수 단위로 작성한다.

검증:

1. 단건 예약 payload가 올바르게 만들어진다.
2. 전체 예약 payload에는 token이 포함되지 않는다.
3. 과거 예약 시각이면 요청을 보내지 않고 메시지를 표시한다.
4. 예약 생성 성공 후 목록을 다시 조회한다.
5. 취소 성공 후 목록을 다시 조회한다.

## SDD 체크리스트

스펙 확정 전 결정해야 할 항목:

1. 예약 시각 저장 타입을 `Instant`로 고정할지, 기존 코드의 `LocalDateTime` 관례를 따를지 결정한다.
2. `ALL_TOKENS` 발송 시 예약 생성 시점의 토큰 스냅샷을 저장할지, 발송 시점의 최신 토큰 목록을 사용할지 결정한다.
3. 발송 실패 예약을 재시도할지 결정한다.
4. 예약 상세에서 `failedTokens` 전체를 노출할지, 개수만 노출할지 결정한다.
5. 개발자 포털에서 상태 필터를 1차 범위에 포함할지 결정한다.

권장 기본안:

- 시간 저장은 `Instant`
- 전체 발송 대상은 발송 시점 최신 토큰
- 자동 재시도는 1차 범위 제외
- 상세 API에는 `failedTokens`를 포함
- UI 상태 필터는 1차에 포함하되 단순 select로 구현

## 비범위

아래 항목은 1차 구현 범위에 포함하지 않는다.

1. 반복 예약
2. 예약 수정
3. 예약 복제
4. 예약 발송 전 미리보기 푸시
5. 실패 예약 자동 재시도
6. 사용자 세그먼트별 발송
7. 동아리 topic 직접 선택 발송
8. 예약 생성자 이름 표시
9. 예약 알림 감사 로그 별도 저장

## 배포 전 검증 기준

아래 조건이 모두 만족되면 배포 가능하다.

1. 개발자 포털에서 단건 예약을 생성할 수 있다.
2. 개발자 포털에서 전체 예약을 생성할 수 있다.
3. 예약 목록에서 예약 상태를 확인할 수 있다.
4. `SCHEDULED` 예약을 취소할 수 있다.
5. 취소된 예약은 예약 시각이 지나도 발송되지 않는다.
6. 예약 시각이 지난 예약은 스케줄러에 의해 한 번만 발송된다.
7. 발송 성공/실패 결과가 예약 문서에 남는다.
8. `/api/admin/**` 권한 정책이 유지된다.
9. 기존 즉시 발송 기능은 회귀 없이 동작한다.
