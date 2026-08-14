# 동아리 상세 체류 시간 자체 수집 스펙

## 목적

동아리 관리자 통계에서 평균 체류 시간이 Mixpanel backfill 없이는 `0초`로 표시되는 문제를 해결한다.

상세 조회수는 기존 백엔드 조회 흐름에서 직접 집계되지만, 체류 시간은 Mixpanel `ClubDetailPage Duration` 이벤트를 수동 backfill해야만 집계된다.
이 스펙은 백엔드 자체 체류 시간 수집 API와 관리자 통계 overview 확장 계약을 정의한다.

## 대상 범위

- 동아리 상세 페이지 체류 시간 수집 API
- 체류 시간 원시 세션 저장 컬렉션
- 방문자 일별 집계 컬렉션
- 기존 `club_analytics_daily` duration 집계 확장
- 관리자 통계 overview 응답 확장
- 백엔드 단위/컨트롤러 테스트

프론트 `sendBeacon` 연결과 관리자 통계 화면 UI 변경은 이 스펙의 구현 범위가 아니다.

## 사용자 시나리오

1. 사용자가 동아리 상세 페이지에 진입한다.
2. 프론트는 상세 페이지 진입마다 `sessionId`를 생성한다.
3. 프론트는 브라우저에 저장된 익명 `visitorId`를 함께 사용한다.
4. 사용자가 페이지를 이탈하거나 페이지가 숨겨지면 체류 시간을 계산한다.
5. 프론트는 백엔드 수집 API로 `clubId`, `sessionId`, `visitorId`, `durationSeconds`를 전송한다.
6. 백엔드는 중복 세션이 아니면 원시 세션을 저장하고 일별 통계를 증가시킨다.
7. 관리자는 통계 overview에서 평균 체류 시간과 인당 평균 체류 시간을 조회한다.

## 지표 정의

### 평균 체류 시간

방문 세션 1회당 평균 체류 시간이다.

```text
averageDetailDurationSeconds
  = detailDurationSumSeconds / detailDurationCount
```

기존 응답 필드명을 유지한다.

### 고유 상세 방문자 수

선택 기간 내 같은 동아리 상세 페이지를 방문한 고유 방문자 수다.

```text
uniqueDetailVisitors
  = count(distinct visitorId)
```

집계 기준은 `club_detail_visitor_daily`를 기간 내 `visitorId`로 group한 결과다.

### 인당 평균 체류 시간

선택 기간 내 고유 방문자 1명당 평균 누적 체류 시간이다.

```text
averageDetailDurationSecondsPerVisitor
  = 기간 내 전체 durationSumSeconds / uniqueDetailVisitors
```

예:

```text
A 방문자: 10초 + 20초
B 방문자: 30초

방문 세션 평균 = 60초 / 3세션 = 20초
인당 평균 = 60초 / 2명 = 30초
```

## API 스펙

### 체류 시간 수집

`POST /api/analytics/club-detail/duration`

권한:

- 인증 없음
- 일반 사용자 상세 페이지에서 호출하는 공개 수집 API

요청:

```json
{
  "clubId": "club-id",
  "clubName": "동아리명",
  "sessionId": "uuid",
  "visitorId": "uuid",
  "enteredAt": "2026-08-06T01:00:00Z",
  "leftAt": "2026-08-06T01:00:35Z",
  "durationSeconds": 35
}
```

필수 필드:

- `clubId`
- `sessionId`
- `visitorId`
- `durationSeconds`

선택 필드:

- `clubName`
- `enteredAt`
- `leftAt`

성공 응답:

- HTTP `200`
- 공통 `Response<T>` 래퍼(`statuscode`, `message`, `data`)를 사용한다.

중복 세션 응답:

- HTTP `200`
- 이미 처리한 `sessionId + clubId`는 다시 집계하지 않는다.

실패 응답:

- HTTP `400`
  - 에러 코드: `903-4`
  - 메시지: `통계 이벤트 요청이 올바르지 않습니다.`
- HTTP `429`
  - 에러 코드: `903-5`
  - 메시지: `통계 이벤트 요청이 너무 많습니다.`
- HTTP `404`
  - 에러 코드: `600-1`
  - 메시지: `동아리가 존재하지 않습니다.`

검증:

- `clubId`, `sessionId`, `visitorId`는 blank일 수 없고 64자를 넘을 수 없다.
- `durationSeconds`는 `1` 이상 `3600` 이하이다.
- `enteredAt`과 `leftAt`이 모두 있으면 `leftAt`은 `enteredAt`보다 이전일 수 없다.
- `clubId`는 존재하는 동아리여야 한다.

요청 제한:

- Redis window counter로 `clubId + clientIp` 단위 요청 수를 제한한다.
- 기준값은 60초당 120회다.
- `X-Forwarded-For`가 있으면 첫 번째 IP를 사용하고, 없거나 IP 길이(45자)를 넘으면 `remoteAddr`를 사용한다.
- `X-Forwarded-For`는 호출자가 조작할 수 있으므로, 인그레스에서 이 헤더를 덮어쓰도록 설정되어 있어야 요청 제한이 실제로 동작한다.

날짜 기준:

- `leftAt`이 있으면 `leftAt`을 KST 날짜로 변환해 집계 날짜로 사용한다.
- `leftAt`이 없으면 서버 현재 KST 날짜를 사용한다.

## 관리자 통계 API 확장

대상 API:

`GET /api/club/statistics/overview?from=yyyy-MM-dd&to=yyyy-MM-dd`

기존 응답:

```java
public record ClubStatisticsOverviewResponse(
    String clubId,
    String clubName,
    LocalDate from,
    LocalDate to,
    long totalDetailViews,
    long averageDetailDurationSeconds,
    long totalApplicants
) {
}
```

변경 후 응답:

```java
public record ClubStatisticsOverviewResponse(
    String clubId,
    String clubName,
    LocalDate from,
    LocalDate to,
    long totalDetailViews,
    long averageDetailDurationSeconds,
    long uniqueDetailVisitors,
    long averageDetailDurationSecondsPerVisitor,
    long totalApplicants
) {
}
```

정책:

- `averageDetailDurationSeconds`는 기존 의미를 유지한다.
- `uniqueDetailVisitors`와 `averageDetailDurationSecondsPerVisitor`는 overview에만 추가한다.
- trend API 응답은 이 스펙에서 변경하지 않는다.
- visitor 데이터가 없으면 `uniqueDetailVisitors = 0`, `averageDetailDurationSecondsPerVisitor = 0`이다.

## 데이터 스펙

### club_detail_duration_sessions

원시 체류 세션 컬렉션이다.

엔티티:

- `ClubDetailDurationSession`

컬렉션:

- `club_detail_duration_sessions`

필드:

- `id`
- `sessionId`
- `visitorId`
- `clubId`
- `clubName`
- `date`
- `enteredAt`
- `leftAt`
- `durationSeconds`
- `createdAt`

인덱스:

- unique `{ sessionId: 1, clubId: 1 }`
- `{ clubId: 1, date: 1 }`
- single `sessionId`
- single `visitorId`
- single `clubId`
- single `date`

정책:

- 원시 세션 upsert에서 신규 insert가 발생한 경우에만 집계를 증가시킨다.
- 기존 문서가 있으면 이미 처리된 세션으로 보고 성공 응답한다.
- 이 컬렉션은 디버깅과 재집계 원본이다.
- 관리자 통계 조회는 이 컬렉션을 직접 scan하지 않는다.

### club_detail_visitor_daily

방문자별 일별 체류 시간 집계 컬렉션이다.

엔티티:

- `ClubDetailVisitorDaily`

컬렉션:

- `club_detail_visitor_daily`

필드:

- `id`
- `date`
- `clubId`
- `visitorId`
- `durationSumSeconds`
- `sessionCount`
- `createdAt`
- `updatedAt`

인덱스:

- unique `{ clubId: 1, date: 1, visitorId: 1 }`
- single `date`
- single `clubId`
- single `visitorId`

정책:

- 같은 날짜, 같은 동아리, 같은 방문자의 여러 세션은 하나의 문서에 누적한다.
- overview의 고유 방문자 수는 기간 내 이 컬렉션을 `visitorId` 기준으로 group해서 계산한다.
- overview의 인당 평균 체류 시간은 기간 내 visitor별 duration 합계를 다시 합산해 계산한다.

### club_analytics_daily

기존 일별 통계 컬렉션이다.

변경:

- 기존 duration 필드 사용
  - `detailDurationSumSeconds`
  - `detailDurationCount`
- 조회 최적화 인덱스 추가
  - `{ clubId: 1, date: 1 }`

정책:

- 체류 시간 수집 성공 시 `detailDurationSumSeconds += durationSeconds`
- 체류 시간 수집 성공 시 `detailDurationCount += 1`
- 기존 `{ date: 1, clubId: 1 }` unique index는 유지한다.

## 처리 흐름

정상 수집:

```text
POST /api/analytics/club-detail/duration
  |
  v
ClubDetailDurationService.record
  |
  v
요청 검증
  |
  v
clubId 존재 확인
  |
  v
Mongo transaction 시작
  |
  v
club_detail_duration_sessions upsert
  |
  v
신규 세션이면 다음 집계 진행
  |
  v
club_analytics_daily duration sum/count 증가
  |
  v
club_detail_visitor_daily duration/session count 증가
  |
  v
Mongo transaction commit
  |
  v
204 No Content
```

중복 수집:

```text
club_detail_duration_sessions upsert
  |
  v
기존 sessionId + clubId 문서 확인
  |
  v
집계 증가 없이 204 No Content
```

집계 실패:

```text
daily 또는 visitor 집계 실패
  |
  v
Mongo transaction rollback
  |
  v
예외 전파
```

세션 저장, `club_analytics_daily` 증가, `club_detail_visitor_daily` 증가는 하나의 MongoDB 트랜잭션 안에서 처리한다.
따라서 중간 write 성공 후 예외가 발생해도 부분 집계가 남지 않아야 한다.

## 부하와 확장성

정상 수집 1건당 MongoDB 쓰기:

1. `club_detail_duration_sessions` insert
2. `club_analytics_daily` upsert + `$inc`
3. `club_detail_visitor_daily` upsert + `$inc`

관리자 overview 조회:

1. 최대 370일치 `club_analytics_daily` 문서를 조회해 애플리케이션에서 합산한다.
2. `club_detail_visitor_daily`를 기간 내 `visitorId` 기준으로 aggregation한다.
3. 원시 세션 컬렉션은 조회하지 않는다.

현재 평균 체류 시간 계산은 최대 370개 일별 문서를 합산하므로 실무 부하로 충분히 가볍다.
성능 보완은 계산식 변경이 아니라 자체 수집과 적절한 집계 컬렉션 유지로 해결한다.

큐나 스트림은 1차 범위에 포함하지 않는다.
아래 조건이 관측되면 후속으로 비동기 집계를 검토한다.

- duration 수집 API p95 latency가 지속적으로 높다.
- 특정 `club_analytics_daily` 문서에 `$inc`가 집중되어 hot document 문제가 나타난다.
- 수집 이벤트가 초당 수백 건 이상 안정적으로 발생한다.

## 보안 정책

수집 API는 공개 API이므로 완전한 위조 방지는 어렵다.
1차 방어는 아래 수준으로 제한한다.

- 존재하는 `clubId`만 기록한다.
- `durationSeconds`는 1초 이상 3600초 이하만 허용한다.
- `sessionId + clubId` unique index로 중복 집계를 막는다.
- Redis 기반 `clubId + clientIp` rate limit을 적용한다.
- 사용자 식별 정보, IP, user-agent 원문, full URL은 저장하지 않는다.

`visitorId`는 프론트가 생성한 익명 UUID를 전제로 한다.

## Mixpanel backfill과의 관계

Mixpanel backfill은 과거 보정과 검증 용도로 유지한다.

주의:

- 자체 수집 배포 이후 기간에 Mixpanel duration backfill을 실행하면 중복 집계될 수 있다.
- 자체 수집 배포일 이후 기간은 백엔드 자체 수집 데이터를 기준으로 본다.
- 운영에서는 duration backfill cutoff 정책을 별도로 두는 것을 권장한다.

## 테스트 스펙

### ClubDetailDurationServiceTest

검증:

1. 정상 요청이면 세션을 저장하고 daily 및 visitor 집계를 증가시킨다.
2. 중복 세션이면 daily와 visitor 집계를 증가시키지 않는다.
3. daily 집계 실패 시 트랜잭션에 예외를 전파한다.
4. visitor 집계 실패 시 트랜잭션에 예외를 전파한다.
5. duration이 0이거나 3600초를 넘으면 실패한다.
6. `leftAt`이 `enteredAt`보다 이전이면 실패한다.
7. 요청 제한을 초과하면 `STATISTICS_EVENT_RATE_LIMITED` 예외가 발생한다.

### ClubDetailDurationControllerTest

검증:

1. 체류 시간 기록 요청은 service를 호출한다.
2. 정상 요청은 `204 No Content`를 반환한다.

### ClubStatisticsAdminServiceTest

검증:

1. overview에서 기존 방문 세션 평균 체류 시간을 계산한다.
2. overview에서 고유 방문자 수를 계산한다.
3. overview에서 인당 평균 체류 시간을 계산한다.
4. 지원자 수 합산과 기존 상세 조회수 합산은 유지된다.

## 배포 전 검증 기준

아래 조건이 모두 만족되면 백엔드 배포 가능하다.

1. `POST /api/analytics/club-detail/duration` 정상 요청이 `204`를 반환한다.
2. 같은 `sessionId + clubId` 요청을 두 번 보내도 한 번만 집계된다.
3. invalid duration 요청은 `400`을 반환한다.
4. rate limit 초과 요청은 `429`를 반환한다.
5. 없는 `clubId` 요청은 `404`를 반환한다.
6. `club_analytics_daily.detailDurationSumSeconds`와 `detailDurationCount`가 증가한다.
7. `club_detail_visitor_daily`에 visitor별 일별 집계가 누적된다.
8. overview 응답에 `uniqueDetailVisitors`와 `averageDetailDurationSecondsPerVisitor`가 포함된다.
9. `./gradlew.bat unitTest`가 통과한다.
