# Google Calendar 연동 설계

## 개요

기존 Notion Calendar와 함께 Google Calendar를 동시에 연동하여 통합 뷰로 이벤트를 제공한다.

### 요구사항

- Google Calendar와 Notion Calendar 이벤트를 하나의 목록으로 병합 (출처 표시)
- 사용자가 Google 계정의 여러 캘린더 중 하나를 선택
- 읽기 전용 (이벤트 조회만)
- 기존 `NotionConnection` 엔티티는 유지하고 `GoogleConnection` 별도 생성

## 아키텍처

### 패키지 구조

```
src/main/java/moadong/calendar/
├── google/                              # 신규: Google Calendar 모듈
│   ├── config/GoogleCalendarProperties.java
│   ├── controller/GoogleOAuthController.java
│   ├── entity/GoogleConnection.java
│   ├── repository/GoogleConnectionRepository.java
│   ├── service/GoogleOAuthService.java
│   └── payload/
│       ├── dto/GoogleTokenApiResponse.java
│       ├── request/GoogleTokenExchangeRequest.java
│       └── response/GoogleTokenExchangeResponse.java
├── notion/                              # 기존 유지 (변경 없음)
└── service/                             # 신규: 캘린더 집계 서비스
    └── CalendarAggregationService.java
```

### 의존성 흐름

```
ClubProfileController
        │
        ▼
ClubProfileService
        │
        ▼
CalendarAggregationService  ◄── 신규
        │
    ┌───┴───┐
    ▼       ▼
NotionOAuthService    GoogleOAuthService ◄── 신규
```

### 설정 (application.yml)

```yaml
google:
  calendar:
    client-id: ${GOOGLE_CALENDAR_CLIENT_ID}
    client-secret: ${GOOGLE_CALENDAR_CLIENT_SECRET}
    redirect-uri: ${GOOGLE_CALENDAR_REDIRECT_URI}
```

## 데이터 모델

### GoogleConnection 엔티티

```java
@Document("google_connections")
public class GoogleConnection {
    @Id
    private String clubId;                    // 동아리 ID (PK)

    private String encryptedAccessToken;      // AES 암호화된 access token
    private String encryptedRefreshToken;     // AES 암호화된 refresh token
    private String calendarId;                // 선택한 캘린더 ID
    private String calendarName;              // 캘린더 이름
    private String email;                     // Google 계정 이메일
    private LocalDateTime tokenExpiresAt;     // 토큰 만료 시간
    private LocalDateTime updatedAt;
}
```

### ClubCalendarEventResult 수정

```java
public record ClubCalendarEventResult(
    String id,
    String title,
    String start,
    String end,
    String url,
    String description,
    String source          // 추가: "GOOGLE" 또는 "NOTION"
) {}
```

### Notion vs Google 비교

| 항목 | Notion | Google |
|------|--------|--------|
| 토큰 | access token만 | access + refresh token |
| 만료 | 없음 | 1시간 (자동 갱신 필요) |
| 선택 대상 | database | calendar |

## API 엔드포인트

### Google OAuth

```
GET  /api/integration/google/oauth/authorize      # OAuth URL 생성
POST /api/integration/google/oauth/token          # 인증 코드 → 토큰 교환
```

### Google Calendar 조회

```
GET  /api/integration/google/calendars               # 캘린더 목록 조회
POST /api/integration/google/calendars/{id}/select   # 캘린더 선택
DELETE /api/integration/google/connection            # 연결 해제
```

### 통합 이벤트 조회

```
GET  /api/clubs/{clubId}/calendar-events          # Notion + Google 병합된 이벤트
```

## OAuth 플로우

```
[프론트엔드]                    [백엔드]                      [Google]
    │                              │                            │
    │─── 1. OAuth URL 요청 ───────▶│                            │
    │◀── 2. authorize URL 반환 ────│                            │
    │                              │                            │
    │─── 3. Google 로그인 ─────────┼───────────────────────────▶│
    │◀── 4. redirect + code ───────┼────────────────────────────│
    │                              │                            │
    │─── 5. code 전달 ────────────▶│                            │
    │                              │─── 6. token 요청 ─────────▶│
    │                              │◀── 7. access/refresh ──────│
    │                              │                            │
    │                              │─── (AES 암호화 저장) ───    │
    │◀── 8. 성공 응답 ─────────────│                            │
```

### Google OAuth 스코프

```
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/userinfo.email
```

## 캘린더 집계 서비스

### CalendarAggregationService

```java
@Service
@RequiredArgsConstructor
public class CalendarAggregationService {

    private final NotionOAuthService notionOAuthService;
    private final GoogleOAuthService googleOAuthService;

    public List<ClubCalendarEventResult> getAggregatedEvents(String clubId) {
        List<ClubCalendarEventResult> allEvents = new ArrayList<>();

        // Notion 이벤트 조회 (실패해도 계속 진행)
        try {
            allEvents.addAll(notionOAuthService.getClubCalendarEvents(clubId));
        } catch (Exception e) {
            log.warn("Notion 이벤트 조회 실패: clubId={}", clubId);
        }

        // Google 이벤트 조회 (실패해도 계속 진행)
        try {
            allEvents.addAll(googleOAuthService.getClubCalendarEvents(clubId));
        } catch (Exception e) {
            log.warn("Google 이벤트 조회 실패: clubId={}", clubId);
        }

        // 시작 날짜 기준 정렬
        return allEvents.stream()
            .sorted(Comparator.comparing(ClubCalendarEventResult::start))
            .toList();
    }

    public boolean hasAnyCalendarConnection(String clubId) {
        return notionOAuthService.hasCalendarConnection(clubId)
            || googleOAuthService.hasCalendarConnection(clubId);
    }
}
```

### ClubProfileService 수정

```java
// 기존
private final NotionOAuthService notionOAuthService;

// 변경
private final CalendarAggregationService calendarAggregationService;

// getClubDetail() 내부
hasCalendarEvents = calendarAggregationService.hasAnyCalendarConnection(clubId);

// getClubCalendarEvents() 내부
return calendarAggregationService.getAggregatedEvents(clubId);
```

### 이벤트 병합 정책

- 두 소스 모두 실패 시에만 빈 리스트 반환
- 한 소스만 실패해도 나머지 이벤트는 정상 반환
- 시작 날짜(`start`) 기준 오름차순 정렬

## 에러 처리

### 신규 ErrorCode

```java
GOOGLE_CONFIG_MISSING(HttpStatus.INTERNAL_SERVER_ERROR, "GOOGLE_CONFIG_MISSING", "Google Calendar 설정이 누락되었습니다"),
GOOGLE_TOKEN_EXCHANGE_FAILED(HttpStatus.BAD_REQUEST, "GOOGLE_TOKEN_EXCHANGE_FAILED", "Google 토큰 교환에 실패했습니다"),
GOOGLE_TOKEN_REFRESH_FAILED(HttpStatus.BAD_REQUEST, "GOOGLE_TOKEN_REFRESH_FAILED", "Google 토큰 갱신에 실패했습니다"),
GOOGLE_NOT_CONNECTED(HttpStatus.NOT_FOUND, "GOOGLE_NOT_CONNECTED", "Google Calendar가 연결되지 않았습니다"),
GOOGLE_CALENDAR_NOT_SELECTED(HttpStatus.BAD_REQUEST, "GOOGLE_CALENDAR_NOT_SELECTED", "캘린더가 선택되지 않았습니다"),
GOOGLE_API_FAILED(HttpStatus.BAD_GATEWAY, "GOOGLE_API_FAILED", "Google API 호출에 실패했습니다"),
```

### 토큰 자동 갱신

```java
private String getValidAccessToken(String clubId) {
    GoogleConnection connection = getGoogleConnection(clubId);

    // 만료 5분 전이면 갱신
    if (connection.getTokenExpiresAt().isBefore(LocalDateTime.now().plusMinutes(5))) {
        return refreshAccessToken(connection);
    }

    return cipher.decrypt(connection.getEncryptedAccessToken());
}

private String refreshAccessToken(GoogleConnection connection) {
    String refreshToken = cipher.decrypt(connection.getEncryptedRefreshToken());

    // Google token refresh 요청
    GoogleTokenApiResponse response = requestTokenRefresh(refreshToken);

    // 새 토큰 암호화 저장
    updateAccessToken(connection.getClubId(), response);

    return response.accessToken();
}
```

## 테스트 전략

### 유닛 테스트

```java
@UnitTest
class GoogleOAuthServiceTest {
    // OAuth URL 생성 테스트
    // 토큰 교환 테스트 (RestTemplate mock)
    // 토큰 갱신 테스트
    // 캘린더 목록 조회 테스트
    // 이벤트 조회 테스트
    // 암호화/복호화 테스트
}

@UnitTest
class CalendarAggregationServiceTest {
    // Notion만 연결된 경우
    // Google만 연결된 경우
    // 둘 다 연결된 경우 (병합 및 정렬)
    // Notion 실패 시 Google만 반환
    // Google 실패 시 Notion만 반환
    // 둘 다 실패 시 빈 리스트
}
```

### 통합 테스트

```java
@IntegrationTest
class GoogleOAuthControllerTest {
    // OAuth 플로우 전체 테스트
    // 캘린더 선택 테스트
    // 연결 해제 테스트
}
```

### 테스트 픽스처

```java
// src/test/java/moadong/fixture/GoogleConnectionFixture.java
public class GoogleConnectionFixture {
    public static GoogleConnection create(String clubId) { ... }
    public static GoogleConnection withExpiredToken(String clubId) { ... }
}
```

## 기존 코드 변경 사항

### 변경 필요 파일

1. `ClubCalendarEventResult.java` - `source` 필드 추가
2. `NotionOAuthService.java` - `mapToClubCalendarEvent()`에서 source를 "NOTION"으로 설정
3. `ClubProfileService.java` - `CalendarAggregationService` 의존성으로 교체
4. `ErrorCode.java` - Google 관련 에러 코드 추가
5. `application.yml` - Google Calendar 설정 추가 (Infisical)

### 변경 없는 파일

- `NotionConnection.java`
- `NotionConnectionRepository.java`
- `NotionOAuthController.java`
- `NotionProperties.java`
