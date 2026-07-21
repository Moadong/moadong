# 동아리 관리자 통계 백엔드 구현 계획

## 목표

동아리 관리자 페이지에서 클럽별 통계를 그래프로 표시할 수 있도록 백엔드 집계 API를 제공한다.

기본 방향은 다음과 같다.

```text
과거 데이터 1회 보정: Mixpanel Export API backfill
신규 데이터: 기존 백엔드 API 처리 흐름 안에서 직접 집계
통계 조회: MongoDB 집계 컬렉션 조회
```

Mixpanel은 운영 중 계속 동기화하는 주 데이터 소스로 쓰지 않는다. 초기 데이터 이관 또는 운영자가 요청한 기간 보정에만 사용한다.

## 1차 제공 지표

- 클럽별 상세 페이지 조회수
- 클럽별 상세 페이지 평균 체류 시간. 단, 신규 실시간 집계가 아니라 Mixpanel backfill 기반 과거 데이터
- 클럽별 지원자 수 추이
- 전체 주요 검색 키워드

카드 노출수는 1차 구현 범위에서 제외한다. 노출 이벤트는 발생 빈도가 높고 프론트/네트워크 부담이 크며, 이번 관리자 통계의 필수 지표가 아니라고 판단한다.
카드 클릭수도 1차 구현 범위에서 제외한다. 인증 없는 행동 수집 API를 만들지 않기로 했으므로, 신규 카드 클릭을 서버가 정확하게 관측할 수 없다. 상세 페이지 조회수로 실제 관심도를 판단한다.

`ClubDetailPage Visited` Mixpanel 과거 이벤트에는 현재 `club_id`가 없으므로, backfill 시에는 `clubName`으로 기존 `clubs.name`에 매핑한다. backfill 이후 신규 상세 조회는 기존 백엔드 조회 흐름에서 확인된 `clubId`로 기록한다.

## 최종 백엔드 흐름

### 초기 backfill

```text
운영자 수동 요청
  |
  v
POST /api/admin/statistics/mixpanel/backfill?from=&to=
  |
  v
MixpanelExportClient
  - 날짜별 Export API 호출
  - JSONL 라인 단위 파싱
  |
  v
MixpanelBackfillService
  - $insert_id 기준 in-memory dedup
  - ClubDetailPage Visited/Duration: clubName -> clubId 매핑
  - Search Executed: keyword 집계
  |
  v
MongoDB 집계 컬렉션에 $set 또는 $inc 저장
```

### 신규 데이터 수집

```text
사용자-facing 백엔드 API 호출
  |
  v
ClubProfileController / ClubSearchController / ClubApplyPublicService
  |
  v
ClubAnalyticsRecordService
  - clubId 검증
  - 날짜 계산
  - club_analytics_daily에 $inc
  - club_search_keyword_daily에 $inc
  |
  v
관리자 통계 API는 MongoDB만 조회
```

## 현재 확인된 Mixpanel 데이터

### Export API

실제 서비스 계정 인증으로 `data.mixpanel.com` Export API 호출이 가능하다.

```text
GET https://data.mixpanel.com/api/2.0/export
```

필수 설정:

```text
project_id=3611536
from_date=yyyy-MM-dd
to_date=yyyy-MM-dd
Authorization: Basic base64(serviceAccountUsername:serviceAccountSecret)
```

주의:

- Secret은 코드와 문서에 저장하지 않는다.
- 운영 환경에서는 환경변수 또는 Infisical로 주입한다.
- Export API 응답은 JSONL이다. 한 줄마다 JSON 객체 하나가 온다.
- Mixpanel raw export는 중복 제거가 적용되지 않는다. `$insert_id` 기준 dedup이 필요하다.
- Raw Data Export API rate limit은 공식 문서 기준 `60 queries/hour`, `3 queries/second`, `100 concurrent queries`다.
- `limit` 파라미터 최대값은 `100000`이다.
- Mixpanel 서버 기준 `to_date`는 오늘보다 클 수 없다. 수동 backfill API는 UTC 오늘을 초과하지 못하게 제한한다.

### Backfill 대상 이벤트

```text
ClubDetailPage Visited
- clubName
- recruitmentStatus
- referrer
- url
- time
```

```text
ClubDetailPage Duration
- clubName
- duration
- duration_seconds
- recruitmentStatus
- time
```

```text
Search Executed
- inputValue
- page
- time
```

`ClubCard Viewed`는 backfill 대상에서도 제외한다.

## 기존 MongoDB 데이터

지원자 수 추이는 Mixpanel이 아니라 기존 DB에서 계산한다.

- `club_application_forms.clubId`
- `club_applicants.formId`
- `club_applicants.createdAt`

단, 외부 지원폼은 실제 지원자 문서가 저장되지 않으므로 내부 지원폼 제출만 정확히 집계된다.

## 패키지 설계

추가 패키지:

```text
backend/src/main/java/moadong/analytics
backend/src/main/java/moadong/analytics/config
backend/src/main/java/moadong/analytics/controller
backend/src/main/java/moadong/analytics/entity
backend/src/main/java/moadong/analytics/enums
backend/src/main/java/moadong/analytics/payload/request
backend/src/main/java/moadong/analytics/payload/response
backend/src/main/java/moadong/analytics/repository
backend/src/main/java/moadong/analytics/service
backend/src/main/java/moadong/analytics/support
```

`analytics` 최상위 패키지로 분리한다. Mixpanel backfill과 통계 수집은 동아리 조회/지원 도메인과 분리된 운영 분석 기능이다.

## 설정

### MixpanelProperties

파일:

```text
backend/src/main/java/moadong/analytics/config/MixpanelProperties.java
```

```java
@ConfigurationProperties(prefix = "mixpanel")
public record MixpanelProperties(
    boolean enabled,
    String server,
    String projectId,
    ServiceAccount serviceAccount,
    Backfill backfill
) {
    public record ServiceAccount(String username, String secret) {}

    public record Backfill(
        int requestLimit,
        int maxRangeDays
    ) {}
}
```

권장 운영값:

```text
mixpanel.enabled=true
mixpanel.server=data.mixpanel.com
mixpanel.project-id=3611536
mixpanel.service-account.username=${MIXPANEL_SERVICE_ACCOUNT_USERNAME}
mixpanel.service-account.secret=${MIXPANEL_SERVICE_ACCOUNT_SECRET}
mixpanel.backfill.request-limit=100000
mixpanel.backfill.max-range-days=31
```

스케줄러 설정은 두지 않는다. Mixpanel은 수동 backfill 전용이다.

## 컬렉션 설계

### ClubAnalyticsDaily

컬렉션:

```text
club_analytics_daily
```

필드:

```java
@Document("club_analytics_daily")
@CompoundIndex(name = "date_club_unique", def = "{'date': 1, 'clubId': 1}", unique = true)
public class ClubAnalyticsDaily {
    @Id
    private String id;

    @Indexed
    private LocalDate date;

    @Indexed
    private String clubId;

    private String clubName;

    private long detailViewCount;
    private long detailDurationSumSeconds;
    private long detailDurationCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

파생 지표:

```text
averageDetailDurationSeconds = detailDurationSumSeconds / detailDurationCount
```

카드 클릭률은 카드 노출수와 카드 클릭수를 제외하므로 1차 응답에 포함하지 않는다.

### ClubSearchKeywordDaily

컬렉션:

```text
club_search_keyword_daily
```

필드:

```java
@Document("club_search_keyword_daily")
@CompoundIndex(name = "date_keyword_unique", def = "{'date': 1, 'normalizedKeyword': 1}", unique = true)
public class ClubSearchKeywordDaily {
    @Id
    private String id;

    @Indexed
    private LocalDate date;

    private String keyword;
    private String normalizedKeyword;
    private long count;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

정책:

- `keyword == null` 또는 blank는 저장하지 않는다.
- `trim()` 후 길이가 1 이상인 값만 저장한다.
- `normalizedKeyword`는 `trim().toLowerCase()`로 시작한다.
- 1차 API는 전체 주요 검색어만 제공한다. "내 클럽 유입 검색어"는 제외한다.

### MixpanelBackfilledEvent

초기 backfill 중복 집계를 막기 위한 컬렉션이다.

컬렉션:

```text
mixpanel_backfilled_events
```

필드:

```java
@Document("mixpanel_backfilled_events")
public class MixpanelBackfilledEvent {
    @Id
    private String insertId;

    @Indexed
    private String eventName;

    @Indexed
    private LocalDate eventDate;

    private LocalDateTime backfilledAt;
}
```

정책:

- `$insert_id`가 있는 이벤트는 `$insert_id`를 `_id`로 저장한다.
- `$insert_id`가 없는 이벤트는 `eventName + distinct_id + time + url` 조합으로 fallback key를 만든다.
- 같은 기간 backfill을 다시 실행해도 이미 처리한 이벤트는 skip한다.
- backfill은 과거 보정용이므로 기본 동작은 `$inc` + dedup이다.
- 운영자가 특정 기간을 완전히 재생성해야 하면 별도 reset 옵션을 2차로 검토한다.

## 이벤트 타입

파일:

```text
backend/src/main/java/moadong/analytics/enums/AnalyticsEventType.java
```

```java
public enum AnalyticsEventType {
    CLUB_DETAIL_VIEWED,
    SEARCH_EXECUTED
}
```

`CLUB_CARD_VIEWED`는 만들지 않는다.
`CLUB_CARD_CLICKED`는 만들지 않는다.
`CLUB_DETAIL_DURATION_RECORDED`도 신규 백엔드 자체 집계에서는 만들지 않는다. 인증 없는 duration 수집 API를 만들지 않는 이상 서버가 체류 시간을 알 수 없다. 과거 체류 시간은 Mixpanel backfill로만 보정한다.

## 신규 데이터 집계 지점

별도의 공개 통계 이벤트 수집 API는 만들지 않는다. 통계 수집 API를 공개하면 남용 방지, 인증, 위조 이벤트 문제가 커진다. 대신 이미 존재하는 백엔드 API 처리 흐름 안에서 서버가 직접 집계한다.

### 상세 조회

대상:

```text
GET /api/club/{clubId}
GET /api/club/@{clubName}
```

처리 위치:

```text
ClubProfileService.getClubDetail
ClubProfileService.getClubDetailByClubName
```

정책:

- 클럽 조회가 성공한 뒤 `CLUB_DETAIL_VIEWED`를 기록한다.
- 존재하지 않는 클럽 조회는 기록하지 않는다.
- `clubName` 조회도 최종적으로 찾은 `club.getId()` 기준으로 기록한다.

### 상세 체류 시간

상세 체류 시간은 서버가 기존 API만으로 알 수 없다. 별도 이벤트 API를 만들려면 사용자 브라우저에서 호출해야 하고, 인증 요구사항과 충돌한다.

1차 구현에서는 신규 상세 체류 시간 실시간 집계는 제외한다. 과거 체류 시간은 Mixpanel backfill로만 제공한다.

2차 개선안:

- 관리자 인증이 필요한 통계 조회와 별개로, 공개 duration 수집 API를 둘지 별도 보안 검토 후 결정한다.
- 또는 프론트가 Mixpanel에는 계속 duration을 보내고, 운영자가 필요할 때 backfill로 보정한다.

### 검색어

대상:

```text
GET /api/club/search/
```

처리 위치:

```text
ClubSearchService.searchClubsByKeyword
```

정책:

- 검색어가 blank가 아닐 때만 `SEARCH_EXECUTED`를 기록한다.
- 검색 결과가 0건이어도 검색어 통계는 기록한다.
- 검색어는 전체 주요 검색어 통계로만 제공한다.

## 이벤트별 집계 정책

### CLUB_DETAIL_VIEWED

필수:

```text
eventType
clubId
```

처리:

```text
club_analytics_daily.detailViewCount += 1
```

### SEARCH_EXECUTED

필수:

```text
eventType
keyword
```

처리:

```text
club_search_keyword_daily.count += 1
```

blank keyword는 skipped로 처리한다.

## 실시간 집계 서비스

서비스:

```text
ClubAnalyticsRecordService
```

처리 흐름:

```text
1. 기존 서비스 로직이 성공한 뒤 기록 메서드 호출
2. eventType별 필수 필드 검증
3. clubId가 필요한 이벤트는 이미 조회된 Club 또는 ClubRepository로 존재 확인
4. 서버 현재 시각을 KST LocalDate로 변환
5. MongoTemplate updateFirst(upsert=true)로 집계 컬렉션 $inc
```

집계 실패가 사용자-facing API 실패로 번지면 안 된다. 통계 기록 실패는 warn/error 로그를 남기고 기존 API 응답은 유지한다.

## Mixpanel Backfill

### MixpanelExportClient

책임:

```text
- 날짜 단위 Export API 호출
- event 파라미터에 backfill 대상 이벤트만 지정
- JSONL 응답을 MixpanelRawEvent 목록으로 변환
- 인증/HTTP 오류를 명확한 로그와 예외로 변환
```

요청 이벤트:

```java
List.of(
    "ClubDetailPage Visited",
    "ClubDetailPage Duration",
    "Search Executed"
)
```

DTO:

```java
public record MixpanelRawEvent(
    String event,
    Map<String, Object> properties
) {
}
```

파싱 정책:

- `RestTemplate.exchange(..., String.class)`로 응답 본문을 문자열로 받는다.
- `\n` 기준으로 줄 단위 분리한다.
- blank line은 무시한다.
- 각 줄을 `ObjectMapper.readValue(line, MixpanelRawEvent.class)`로 파싱한다.
- 한 줄 파싱 실패는 전체 실패로 보지 않고 warn 로그 후 skip한다.

### MixpanelBackfillService

수동 API:

```http
POST /api/admin/statistics/mixpanel/backfill?from=2026-07-01&to=2026-07-08
```

정책:

- 일반 동아리 관리자에게 노출하지 않는다.
- 반드시 개발자 페이지에서만 호출한다.
- `/api/admin/**`는 기존 `SecurityConfig`에서 `hasRole("DEVELOPER")`로 제한되어 있으므로 backfill API는 `/api/admin/statistics/mixpanel/backfill` 경로를 유지한다.
- 컨트롤러에도 `@PreAuthorize("hasRole('DEVELOPER')")`를 명시해 의도를 드러낸다.
- 최대 기간은 `mixpanel.backfill.max-range-days`로 제한한다. 기본 31일.
- `to`는 UTC 오늘을 넘을 수 없다.
- 날짜별 1 request로 호출한다.
- 응답 line 수가 `requestLimit`과 같으면 warn 로그를 남긴다.

backfill 처리:

```text
1. 날짜별 Mixpanel 이벤트 fetch
2. $insert_id 또는 fallback key로 MixpanelBackfilledEvent insert 시도
3. 중복이면 skip
4. 이벤트별로 실시간 수집과 같은 집계 컬렉션에 $inc
```

Mixpanel 과거 이벤트 매핑:

```text
ClubDetailPage Visited
- clubName으로 clubs.name 매핑

ClubDetailPage Duration
- clubName으로 clubs.name 매핑
- duration_seconds 집계

Search Executed
- inputValue 집계
```

중복 이름 정책:

- `ClubRepository.findAll()` 결과를 `name -> club` map으로 만들 때 같은 name이 2개 이상이면 ambiguous로 분리한다.
- ambiguous clubName 상세 이벤트는 저장하지 않는다.
- warn 로그에 clubName만 남긴다. distinct_id, url 등 사용자 식별 가능 값은 로그에 남기지 않는다.

## Repository 설계

### ClubAnalyticsDailyRepository

```java
public interface ClubAnalyticsDailyRepository extends MongoRepository<ClubAnalyticsDaily, String> {
    List<ClubAnalyticsDaily> findByClubIdAndDateBetweenOrderByDateAsc(
        String clubId,
        LocalDate from,
        LocalDate to
    );
}
```

집계 upsert는 `MongoTemplate` 사용을 권장한다.

```java
Query query = Query.query(
    Criteria.where("date").is(date).and("clubId").is(clubId)
);

Update update = new Update()
    .set("clubName", clubName)
    .inc("detailViewCount", detailViewDelta)
    .inc("detailDurationSumSeconds", durationSumDelta)
    .inc("detailDurationCount", durationCountDelta)
    .set("updatedAt", now)
    .setOnInsert("createdAt", now);
```

실시간 집계와 backfill 모두 `$inc`를 사용한다. Backfill은 `MixpanelBackfilledEvent` dedup으로 같은 Mixpanel 이벤트를 반복 실행해도 중복 누적을 막는다.

주의: backfill 기간은 서버 자체 통계 수집을 배포하기 전 과거 기간으로 제한해야 한다. 배포 이후 실시간 수집이 이미 동작한 날짜를 Mixpanel로 다시 backfill하면, Mixpanel 이벤트와 서버 조회 이벤트가 서로 다른 원천으로 더해져 같은 행동이 중복 집계될 수 있다.

### ClubSearchKeywordDailyRepository

```java
public interface ClubSearchKeywordDailyRepository extends MongoRepository<ClubSearchKeywordDaily, String> {
    List<ClubSearchKeywordDaily> findByDateBetweenOrderByCountDesc(LocalDate from, LocalDate to);
}
```

여러 날짜 합산 top N은 `MongoTemplate` aggregation을 사용한다.

### MixpanelBackfilledEventRepository

```java
public interface MixpanelBackfilledEventRepository extends MongoRepository<MixpanelBackfilledEvent, String> {
}
```

## 관리자 통계 조회 API

컨트롤러:

```text
backend/src/main/java/moadong/analytics/controller/ClubStatisticsAdminController.java
```

Base path:

```text
/api/club/statistics
```

기존 동아리 관리자 API가 `/api/club/application`, `/api/club/apply/info/{applicationFormId}`처럼 로그인한 관리자 clubId를 기준으로 동작하므로 같은 패턴을 따른다.

모든 조회 API:

```java
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "BearerAuth")
```

권한 정책:

- 요청에서 `clubId`를 받지 않는다.
- 항상 `@CurrentUser CustomUserDetails user`의 `user.getClubId()` 기준으로 조회한다.
- 로그인한 동아리 관리자는 자기 동아리 통계만 볼 수 있다.
- 다른 동아리 통계를 조회하는 개발자용 API는 1차 구현 범위에서 만들지 않는다.

### Overview

```http
GET /api/club/statistics/overview?from=2026-07-01&to=2026-07-31
```

응답:

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

### Trend

```http
GET /api/club/statistics/trend?from=2026-07-01&to=2026-07-31
```

응답:

```java
public record ClubStatisticsTrendResponse(
    String clubId,
    LocalDate from,
    LocalDate to,
    List<ClubStatisticsDailyPoint> points
) {
}

public record ClubStatisticsDailyPoint(
    LocalDate date,
    long detailViews,
    long averageDetailDurationSeconds,
    long applicants
) {
}
```

프론트 그래프는 이 API 하나로 주요 시계열을 그릴 수 있다.

### Search Keywords

```http
GET /api/club/statistics/search-keywords?from=2026-07-01&to=2026-07-31&limit=10
```

응답:

```java
public record SearchKeywordStatisticsResponse(
    LocalDate from,
    LocalDate to,
    List<SearchKeywordRankItem> keywords
) {
}

public record SearchKeywordRankItem(
    String keyword,
    long count
) {
}
```

이 API는 "내 클럽 유입 키워드"가 아니라 "전체 주요 검색 키워드"다. API 설명에 명확히 적는다.

## 지원자 집계

서비스:

```text
ClubApplicantStatisticsService
```

책임:

```text
1. club_application_forms에서 clubId의 formId 목록 조회
2. club_applicants에서 formId in (...) + createdAt between 조회
3. createdAt KST LocalDate 기준으로 group
4. 일자별 count 반환
```

권장 구현:

- 일자별 집계는 `MongoTemplate` aggregation으로 구현한다.
- `club_applicants.formId`, `club_applicants.createdAt` 인덱스를 추가한다.

인덱스:

```java
@CompoundIndex(name = "form_created_at_idx", def = "{'formId': 1, 'createdAt': 1}")
```

기존 `ClubApplicant`에 추가한다.

## 날짜 검증

공통 정책:

- `from`, `to`는 필수.
- `from > to`이면 400.
- 통계 조회 최대 기간은 370일.
- 수동 backfill 최대 기간은 기본 31일.
- 응답 날짜는 KST 기준 `LocalDate`.
- 조회 API에서 `to`가 오늘 이후여도 허용할 수 있지만, 데이터가 없을 뿐이다.
- 수동 Mixpanel backfill API는 `to`가 UTC 오늘을 넘으면 400으로 제한한다.

## 에러 처리

추가 ErrorCode:

```text
MIXPANEL_EXPORT_FAILED
STATISTICS_DATE_RANGE_INVALID
STATISTICS_BACKFILL_RANGE_TOO_LONG
```

관리자 통계 조회 API는 Mixpanel 장애와 무관하게 집계 컬렉션을 읽기 때문에 안정적이다. Mixpanel 장애는 backfill API에서만 드러난다.

## 로그 정책

허용 로그:

- backfill 시작/종료 날짜
- 날짜별 가져온 이벤트 수
- 날짜별 저장된 이벤트 수
- 매핑 실패한 clubName
- Mixpanel HTTP status
- 실시간 서버 내부 통계 기록 실패/성공 count

금지 로그:

- distinct_id
- `$device_id`
- `$user_id`
- 전체 url query string
- 검색어 raw list 대량 출력
- 서비스 계정 secret

## 테스트 계획

### 단위 테스트

`ClubAnalyticsRecordServiceTest`

- 상세 조회 기록 시 `detailViewCount`를 증가시킨다.
- 검색어 기록 시 keyword count를 증가시킨다.
- blank keyword는 기록하지 않는다.
- 존재하지 않는 clubId는 기록하지 않는다.
- 집계 기록 실패가 기존 사용자-facing 서비스 응답 실패로 전파되지 않도록 예외를 흡수하고 로그를 남긴다.

`MixpanelExportClientTest`

- Basic Auth 헤더 생성 검증
- event 파라미터 JSON array 인코딩 검증
- JSONL 2줄 파싱 검증
- malformed JSON line skip 검증

`MixpanelBackfillServiceTest`

- `ClubDetailPage Visited`가 clubName으로 clubId를 찾아 `detailViewCount`를 증가시킨다.
- 상세 이벤트 clubName 매핑 실패 시 skip한다.
- 상세 이벤트 clubName이 중복이면 skip한다.
- `ClubDetailPage Duration.duration_seconds`가 sum/count로 집계된다.
- `Search Executed.inputValue`가 keyword로 집계된다.
- `$insert_id` 중복 이벤트는 두 번 집계하지 않는다.
- 처리 실패 시 dedup 키를 롤백해 같은 기간을 재시도할 수 있다.
- backfill이 비활성화되어 있으면 실패한다.

`ClubStatisticsAdminServiceTest`

- overview 합산값 계산
- trend에서 누락 날짜를 0으로 채움
- 지원자 수와 analytics 집계가 같은 daily point로 합쳐짐
- averageDetailDurationSeconds에서 count 0이면 0 반환

`ClubApplicantStatisticsServiceTest`

- clubId의 formId 목록 기준 지원자를 일자별로 집계
- form이 없으면 빈 map 반환
- 기간 밖 지원자는 제외

### 컨트롤러 테스트

`ClubStatisticsAdminControllerTest`

- 인증 필요
- `@CurrentUser`의 `clubId` 기준으로만 조회한다.
- 요청 파라미터로 다른 clubId를 받을 수 없다.
- from/to 누락 시 400
- from > to 시 400
- overview 응답 shape 검증
- trend 응답 shape 검증
- search-keywords limit 기본값/상한 검증

`MixpanelBackfillAdminControllerTest`

- `hasRole('DEVELOPER')` 권한 필요
- `/api/admin/**` 경로로만 제공한다.
- 기간 초과 시 400
- UTC 오늘 이후 to 요청 시 400
- 정상 요청 시 backfill service 호출

### 수동 검증

개발 환경에서 서비스 계정 설정 후:

```text
1. POST /api/admin/statistics/mixpanel/backfill?from=2026-07-01&to=2026-07-08
2. MongoDB club_analytics_daily 생성 확인
3. GET /api/club/{clubId} 호출 후 detailViewCount 증가 확인
4. GET /api/club/search/?keyword=축구 호출 후 검색어 count 증가 확인
5. GET /api/club/statistics/overview?from=2026-07-01&to=2026-07-08
6. GET /api/club/statistics/trend?from=2026-07-01&to=2026-07-08
7. GET /api/club/statistics/search-keywords?from=2026-07-01&to=2026-07-08&limit=10
```

## 구현 순서

1. `MixpanelProperties` 추가
2. analytics enum/entity/repository 추가
3. `ClubAnalyticsRecordService` 구현
4. `ClubProfileService` 상세 조회 성공 후 record 호출 추가
5. `ClubSearchService` 검색어 record 호출 추가
6. `MixpanelExportClient` 구현
7. `MixpanelBackfillService` 구현
8. `MixpanelBackfillAdminController` 구현
9. `ClubApplicantStatisticsService` 구현
10. `ClubStatisticsAdminService` 구현
11. `ClubStatisticsAdminController` 구현
12. 단위 테스트/컨트롤러 테스트 추가
13. 개발자 페이지에서 backfill 버튼/API 연결
14. 운영 설정값 추가
15. 수동 backfill 후 실제 응답 확인

## 1차 구현에서 제외할 것

- 카드 노출수
- 카드 클릭수
- 카드 클릭률
- 클럽별 유입 검색어
- Mixpanel 주기 스케줄링
- 별도 공개 통계 이벤트 수집 API
- 실시간 Mixpanel proxy API
- Mixpanel Query API/JQL 사용
- 상세 페이지 이벤트의 `club_id` 보강
- 데이터 웨어하우스 파이프라인
- 검색어 개인정보 필터링 고도화

## 자체 리뷰

### 리뷰 1. 신규 구조가 이전 구조보다 나은 점

이전 계획은 Mixpanel Export API를 주기적으로 호출해 최근 며칠을 재동기화했다. 이 방식은 rate limit, dedup, 지연, 장애 영향을 계속 받는다.

새 구조는 Mixpanel을 초기 backfill로만 사용한다. 이후 신규 통계는 백엔드가 직접 수집하므로 관리자 페이지가 더 빠르고 실시간에 가깝다.

### 리뷰 2. 카드 노출수/카드 클릭수 제외 영향

카드 노출수와 카드 클릭수를 제외하면 클릭률을 계산할 수 없다. 대신 1차 지표는 서버가 직접 관측 가능한 상세 조회수, 검색어, 지원자 수에 집중한다.

노출수나 클릭수가 추후 필요해지면 별도 이벤트 수집 API와 인증/남용 방지 정책을 함께 설계해 추가한다.

### 리뷰 3. 별도 이벤트 수집 API를 만들지 않는 이유

문제:

인증 없는 이벤트 수집 API는 외부에서 호출될 수 있고, 인증을 요구하면 일반 사용자 행동을 수집할 수 없다.

보완:

- 1차 구현에서는 별도 공개 이벤트 수집 API를 만들지 않는다.
- 기존 백엔드 API 성공 흐름 안에서 서버가 직접 기록할 수 있는 지표만 실시간 집계한다.
- 통계 조회 API는 인증 필수이며 `@CurrentUser.clubId` 기준으로만 응답한다.

### 리뷰 4. 실시간 기록 실패 처리

문제:

상세 조회/검색 API 내부에서 통계 기록이 실패할 수 있다.

보완:

- 통계 기록 실패가 사용자-facing API 실패로 전파되지 않도록 한다.
- 실패 로그를 남기고 기존 응답은 유지한다.
- 통계 정확도보다 사용자 API 안정성을 우선한다.

### 리뷰 5. Mixpanel 상세 조회수 매핑 안정성

문제:

과거 Mixpanel 상세 이벤트는 `club_id`가 없고 `clubName`만 있다.

보완:

- backfill에서만 `clubs.name`으로 매핑한다.
- 매핑 실패/중복 이름은 skip한다.
- 신규 상세 조회는 기존 백엔드가 조회한 `Club`의 `id`를 직접 사용하므로 이 문제가 없다.

### 리뷰 6. 지원자 삭제와 과거 통계

문제:

지원자 수 추이는 live `club_applicants` 기준이다. 지원서 폼 삭제 시 지원자도 삭제되어 과거 지원자 통계가 사라진다.

보완:

- 1차는 현재 DB 상태 기준 지원자 수라고 명시한다.
- 과거 지원자 수 보존이 필요하면 지원 제출 시점에 analytics 컬렉션으로 별도 적재한다.

### 리뷰 7. 실제 구현 가능성 판정

이 계획은 다음 이유로 바로 구현 가능하다.

- Mixpanel 인증과 Export API 접근 가능성이 확인됐다.
- 필요한 과거 이벤트명과 필드가 실제 데이터에서 확인됐다.
- 신규 데이터는 기존 백엔드 API가 조회한 `Club`의 `id` 또는 로그인 사용자의 `clubId`를 사용하므로 클럽별 집계가 안정적이다.
- 기존 프로젝트에 `RestTemplate`, `ObjectMapper`, MongoDB가 있다.
- 지원자 집계에 필요한 기존 엔티티 필드가 있다.
- 컬렉션, API 계약, 검증 정책, 테스트 항목이 정의되어 있다.

남은 외부 의존성은 운영 설정값 주입이다.
