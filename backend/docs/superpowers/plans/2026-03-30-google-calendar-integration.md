# Google Calendar 연동 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Google Calendar와 Notion Calendar를 동시에 연동하여 통합 뷰로 이벤트를 제공한다.

**Architecture:** Notion과 동일한 패턴으로 `calendar/google/` 패키지를 생성하고, `CalendarAggregationService`를 추가하여 두 소스의 이벤트를 병합한다. 기존 Notion 코드는 최소한으로 수정한다.

**Tech Stack:** Spring Boot 3.3.8, Java 17, MongoDB, Google Calendar API v3, AES 암호화

---

## 파일 구조

### 신규 생성 파일

```
src/main/java/moadong/calendar/
├── google/
│   ├── config/GoogleCalendarProperties.java
│   ├── entity/GoogleConnection.java
│   ├── repository/GoogleConnectionRepository.java
│   ├── service/GoogleOAuthService.java
│   ├── controller/GoogleOAuthController.java
│   └── payload/
│       ├── dto/GoogleTokenApiResponse.java
│       ├── request/GoogleTokenExchangeRequest.java
│       ├── request/GoogleCalendarSelectRequest.java
│       └── response/GoogleTokenExchangeResponse.java
└── service/CalendarAggregationService.java

src/test/java/moadong/
├── fixture/GoogleConnectionFixture.java
└── calendar/
    ├── google/service/GoogleOAuthServiceTest.java
    └── service/CalendarAggregationServiceTest.java
```

### 수정 파일

```
src/main/java/moadong/
├── global/exception/ErrorCode.java                    # Google 에러 코드 추가
├── club/payload/dto/ClubCalendarEventResult.java      # source 필드 추가
├── calendar/notion/service/NotionOAuthService.java    # source 설정 추가
└── club/service/ClubProfileService.java               # CalendarAggregationService로 교체
```

---

## Task 1: ErrorCode에 Google 관련 에러 코드 추가

**Files:**
- Modify: `src/main/java/moadong/global/exception/ErrorCode.java:88`

- [ ] **Step 1: ErrorCode.java에 Google 에러 코드 추가**

`ErrorCode.java`의 88번 줄 `;` 앞에 다음 코드를 추가:

```java
    // 960xx: Google Calendar 연동 오류
    GOOGLE_CONFIG_MISSING(HttpStatus.INTERNAL_SERVER_ERROR, "960-1", "Google Calendar 설정이 누락되었습니다."),
    GOOGLE_TOKEN_EXCHANGE_FAILED(HttpStatus.BAD_REQUEST, "960-2", "Google 토큰 교환에 실패했습니다."),
    GOOGLE_TOKEN_REFRESH_FAILED(HttpStatus.BAD_REQUEST, "960-3", "Google 토큰 갱신에 실패했습니다."),
    GOOGLE_NOT_CONNECTED(HttpStatus.NOT_FOUND, "960-4", "Google Calendar가 연결되지 않았습니다."),
    GOOGLE_CALENDAR_NOT_SELECTED(HttpStatus.BAD_REQUEST, "960-5", "캘린더가 선택되지 않았습니다."),
    GOOGLE_API_FAILED(HttpStatus.BAD_GATEWAY, "960-6", "Google API 호출에 실패했습니다."),
    GOOGLE_CLUB_NOT_FOUND(HttpStatus.BAD_REQUEST, "960-7", "연동할 동아리 정보를 찾을 수 없습니다.")
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/global/exception/ErrorCode.java
git commit -m "feat: Google Calendar 연동 에러 코드 추가"
```

---

## Task 2: ClubCalendarEventResult에 source 필드 추가

**Files:**
- Modify: `src/main/java/moadong/club/payload/dto/ClubCalendarEventResult.java`

- [ ] **Step 1: ClubCalendarEventResult.java 수정**

기존 파일을 다음으로 교체:

```java
package moadong.club.payload.dto;

public record ClubCalendarEventResult(
        String id,
        String title,
        String start,
        String end,
        String url,
        String description,
        String source
) {
    public static ClubCalendarEventResult ofNotion(
            String id, String title, String start, String end, String url, String description) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "NOTION");
    }

    public static ClubCalendarEventResult ofGoogle(
            String id, String title, String start, String end, String url, String description) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "GOOGLE");
    }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/club/payload/dto/ClubCalendarEventResult.java
git commit -m "feat: ClubCalendarEventResult에 source 필드 추가"
```

---

## Task 3: NotionOAuthService에서 source 필드 설정

**Files:**
- Modify: `src/main/java/moadong/calendar/notion/service/NotionOAuthService.java:613`

- [ ] **Step 1: mapToClubCalendarEvent 메서드 수정**

`NotionOAuthService.java`의 613번 줄 근처 `return Optional.of(new ClubCalendarEventResult(` 부분을 다음으로 변경:

```java
        return Optional.of(ClubCalendarEventResult.ofNotion(
                resolvedId,
                resolvedTitle,
                start,
                StringUtils.hasText(end) ? end : null,
                StringUtils.hasText(url) ? url : null,
                StringUtils.hasText(description) ? description : null
        ));
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/notion/service/NotionOAuthService.java
git commit -m "refactor: NotionOAuthService에서 source를 NOTION으로 설정"
```

---

## Task 4: GoogleCalendarProperties 설정 클래스 생성

**Files:**
- Create: `src/main/java/moadong/calendar/google/config/GoogleCalendarProperties.java`

- [ ] **Step 1: GoogleCalendarProperties.java 생성**

```java
package moadong.calendar.google.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.calendar")
public record GoogleCalendarProperties(
        String clientId,
        String clientSecret,
        String redirectUri
) {
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/google/config/GoogleCalendarProperties.java
git commit -m "feat: GoogleCalendarProperties 설정 클래스 추가"
```

---

## Task 5: GoogleConnection 엔티티 생성

**Files:**
- Create: `src/main/java/moadong/calendar/google/entity/GoogleConnection.java`

- [ ] **Step 1: GoogleConnection.java 생성**

```java
package moadong.calendar.google.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("google_connections")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleConnection {

    @Id
    private String clubId;

    private String encryptedAccessToken;

    private String encryptedRefreshToken;

    private String calendarId;

    private String calendarName;

    private String email;

    private LocalDateTime tokenExpiresAt;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public void updateTokens(String encryptedAccessToken, String encryptedRefreshToken,
                             String email, LocalDateTime tokenExpiresAt) {
        this.encryptedAccessToken = encryptedAccessToken;
        this.encryptedRefreshToken = encryptedRefreshToken;
        this.email = email;
        this.tokenExpiresAt = tokenExpiresAt;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateAccessToken(String encryptedAccessToken, LocalDateTime tokenExpiresAt) {
        this.encryptedAccessToken = encryptedAccessToken;
        this.tokenExpiresAt = tokenExpiresAt;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateCalendar(String calendarId, String calendarName) {
        this.calendarId = calendarId;
        this.calendarName = calendarName;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isTokenExpired() {
        if (tokenExpiresAt == null) {
            return true;
        }
        return tokenExpiresAt.isBefore(LocalDateTime.now().plusMinutes(5));
    }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/google/entity/GoogleConnection.java
git commit -m "feat: GoogleConnection 엔티티 추가"
```

---

## Task 6: GoogleConnectionRepository 생성

**Files:**
- Create: `src/main/java/moadong/calendar/google/repository/GoogleConnectionRepository.java`

- [ ] **Step 1: GoogleConnectionRepository.java 생성**

```java
package moadong.calendar.google.repository;

import moadong.calendar.google.entity.GoogleConnection;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GoogleConnectionRepository extends MongoRepository<GoogleConnection, String> {
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/google/repository/GoogleConnectionRepository.java
git commit -m "feat: GoogleConnectionRepository 추가"
```

---

## Task 7: Google Payload DTOs 생성

**Files:**
- Create: `src/main/java/moadong/calendar/google/payload/dto/GoogleTokenApiResponse.java`
- Create: `src/main/java/moadong/calendar/google/payload/request/GoogleTokenExchangeRequest.java`
- Create: `src/main/java/moadong/calendar/google/payload/request/GoogleCalendarSelectRequest.java`
- Create: `src/main/java/moadong/calendar/google/payload/response/GoogleTokenExchangeResponse.java`

- [ ] **Step 1: GoogleTokenApiResponse.java 생성**

```java
package moadong.calendar.google.payload.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GoogleTokenApiResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("refresh_token") String refreshToken,
        @JsonProperty("expires_in") Integer expiresIn,
        @JsonProperty("token_type") String tokenType,
        @JsonProperty("scope") String scope
) {
}
```

- [ ] **Step 2: GoogleTokenExchangeRequest.java 생성**

```java
package moadong.calendar.google.payload.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleTokenExchangeRequest(
        @NotBlank String code
) {
}
```

- [ ] **Step 3: GoogleCalendarSelectRequest.java 생성**

```java
package moadong.calendar.google.payload.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleCalendarSelectRequest(
        @NotBlank String calendarId,
        String calendarName
) {
}
```

- [ ] **Step 4: GoogleTokenExchangeResponse.java 생성**

```java
package moadong.calendar.google.payload.response;

public record GoogleTokenExchangeResponse(
        String email
) {
}
```

- [ ] **Step 5: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 6: 커밋**

```bash
git add src/main/java/moadong/calendar/google/payload/
git commit -m "feat: Google Calendar payload DTOs 추가"
```

---

## Task 8: GoogleConnectionFixture 테스트 픽스처 생성

**Files:**
- Create: `src/test/java/moadong/fixture/GoogleConnectionFixture.java`

- [ ] **Step 1: GoogleConnectionFixture.java 생성**

```java
package moadong.fixture;

import java.time.LocalDateTime;
import moadong.calendar.google.entity.GoogleConnection;

public class GoogleConnectionFixture {

    public static final String DEFAULT_CLUB_ID = "test-club-id";
    public static final String DEFAULT_CALENDAR_ID = "primary";
    public static final String DEFAULT_CALENDAR_NAME = "기본 캘린더";
    public static final String DEFAULT_EMAIL = "test@gmail.com";

    public static GoogleConnection create(String clubId) {
        return GoogleConnection.builder()
                .clubId(clubId)
                .encryptedAccessToken("encrypted-access-token")
                .encryptedRefreshToken("encrypted-refresh-token")
                .calendarId(DEFAULT_CALENDAR_ID)
                .calendarName(DEFAULT_CALENDAR_NAME)
                .email(DEFAULT_EMAIL)
                .tokenExpiresAt(LocalDateTime.now().plusHours(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static GoogleConnection createWithoutCalendar(String clubId) {
        return GoogleConnection.builder()
                .clubId(clubId)
                .encryptedAccessToken("encrypted-access-token")
                .encryptedRefreshToken("encrypted-refresh-token")
                .email(DEFAULT_EMAIL)
                .tokenExpiresAt(LocalDateTime.now().plusHours(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static GoogleConnection createWithExpiredToken(String clubId) {
        return GoogleConnection.builder()
                .clubId(clubId)
                .encryptedAccessToken("encrypted-access-token")
                .encryptedRefreshToken("encrypted-refresh-token")
                .calendarId(DEFAULT_CALENDAR_ID)
                .calendarName(DEFAULT_CALENDAR_NAME)
                .email(DEFAULT_EMAIL)
                .tokenExpiresAt(LocalDateTime.now().minusMinutes(10))
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/test/java/moadong/fixture/GoogleConnectionFixture.java
git commit -m "test: GoogleConnectionFixture 테스트 픽스처 추가"
```

---

## Task 9: GoogleOAuthService 생성

**Files:**
- Create: `src/main/java/moadong/calendar/google/service/GoogleOAuthService.java`

- [ ] **Step 1: GoogleOAuthService.java 생성**

```java
package moadong.calendar.google.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.calendar.google.config.GoogleCalendarProperties;
import moadong.calendar.google.entity.GoogleConnection;
import moadong.calendar.google.payload.dto.GoogleTokenApiResponse;
import moadong.calendar.google.payload.request.GoogleCalendarSelectRequest;
import moadong.calendar.google.payload.request.GoogleTokenExchangeRequest;
import moadong.calendar.google.payload.response.GoogleTokenExchangeResponse;
import moadong.calendar.google.repository.GoogleConnectionRepository;
import moadong.club.entity.Club;
import moadong.club.payload.dto.ClubCalendarEventResult;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.AESCipher;
import moadong.user.payload.CustomUserDetails;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final RestTemplate restTemplate;
    private final GoogleConnectionRepository googleConnectionRepository;
    private final MongoTemplate mongoTemplate;
    private final ClubRepository clubRepository;
    private final AESCipher cipher;
    private final GoogleCalendarProperties googleProperties;

    private static final String GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_AUTHORIZE_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo";
    private static final String GOOGLE_CALENDAR_LIST_ENDPOINT = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
    private static final String GOOGLE_CALENDAR_EVENTS_ENDPOINT = "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events";

    private static final String CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
    private static final String USERINFO_SCOPE = "https://www.googleapis.com/auth/userinfo.email";

    public Map<String, String> getAuthorizeUrl(String state) {
        validateConfig();

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(GOOGLE_AUTHORIZE_ENDPOINT)
                .queryParam("client_id", googleProperties.clientId())
                .queryParam("redirect_uri", googleProperties.redirectUri())
                .queryParam("response_type", "code")
                .queryParam("scope", CALENDAR_SCOPE + " " + USERINFO_SCOPE)
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent");

        if (StringUtils.hasText(state)) {
            builder.queryParam("state", state);
        }

        return Map.of("authorizeUrl", builder.build(true).toUriString());
    }

    public GoogleTokenExchangeResponse exchangeCode(CustomUserDetails user, GoogleTokenExchangeRequest request) {
        String clubId = requireAuthenticatedClubId(user);
        validateConfig();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", request.code());
        body.add("client_id", googleProperties.clientId());
        body.add("client_secret", googleProperties.clientSecret());
        body.add("redirect_uri", googleProperties.redirectUri());
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<GoogleTokenApiResponse> response = restTemplate.exchange(
                    GOOGLE_TOKEN_ENDPOINT,
                    HttpMethod.POST,
                    httpEntity,
                    GoogleTokenApiResponse.class
            );

            GoogleTokenApiResponse tokenResponse = response.getBody();
            if (tokenResponse == null || !StringUtils.hasText(tokenResponse.accessToken())) {
                throw new RestApiException(ErrorCode.GOOGLE_TOKEN_EXCHANGE_FAILED);
            }

            String email = fetchUserEmail(tokenResponse.accessToken());
            saveGoogleConnection(clubId, tokenResponse, email);

            return new GoogleTokenExchangeResponse(email);
        } catch (HttpStatusCodeException e) {
            log.warn("Google 토큰 교환 실패. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.GOOGLE_TOKEN_EXCHANGE_FAILED);
        }
    }

    public Map<String, Object> getCalendars(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);
        String accessToken = getValidAccessToken(clubId);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    GOOGLE_CALENDAR_LIST_ENDPOINT,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            return response.getBody() != null ? response.getBody() : Map.of();
        } catch (HttpStatusCodeException e) {
            log.warn("Google 캘린더 목록 조회 실패. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.GOOGLE_API_FAILED);
        }
    }

    public void selectCalendar(CustomUserDetails user, String calendarId, GoogleCalendarSelectRequest request) {
        String clubId = requireAuthenticatedClubId(user);

        Query query = Query.query(Criteria.where("_id").is(clubId));
        Update update = new Update()
                .set("calendarId", calendarId)
                .set("calendarName", request.calendarName())
                .set("updatedAt", LocalDateTime.now());

        var result = mongoTemplate.updateFirst(query, update, GoogleConnection.class);
        if (result.getMatchedCount() == 0) {
            throw new RestApiException(ErrorCode.GOOGLE_NOT_CONNECTED);
        }
    }

    public void deleteConnection(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);
        googleConnectionRepository.deleteById(clubId);
    }

    public List<ClubCalendarEventResult> getClubCalendarEvents(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return List.of();
        }

        try {
            GoogleConnection connection = googleConnectionRepository.findById(clubId).orElse(null);
            if (connection == null || !StringUtils.hasText(connection.getCalendarId())) {
                return List.of();
            }

            String accessToken = getValidAccessToken(clubId);
            return fetchCalendarEvents(accessToken, connection.getCalendarId());
        } catch (Exception e) {
            log.warn("Google 캘린더 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
            return List.of();
        }
    }

    public boolean hasCalendarConnection(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return false;
        }
        return googleConnectionRepository.findById(clubId)
                .map(connection -> StringUtils.hasText(connection.getCalendarId()))
                .orElse(false);
    }

    @SuppressWarnings("unchecked")
    private List<ClubCalendarEventResult> fetchCalendarEvents(String accessToken, String calendarId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        String url = UriComponentsBuilder.fromHttpUrl(GOOGLE_CALENDAR_EVENTS_ENDPOINT)
                .queryParam("maxResults", 100)
                .queryParam("orderBy", "startTime")
                .queryParam("singleEvents", true)
                .queryParam("timeMin", LocalDateTime.now().minusMonths(1).toString() + "Z")
                .buildAndExpand(calendarId)
                .toUriString();

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            Map<String, Object> body = response.getBody();
            if (body == null) {
                return List.of();
            }

            Object itemsObj = body.get("items");
            if (!(itemsObj instanceof List<?> items)) {
                return List.of();
            }

            List<ClubCalendarEventResult> results = new ArrayList<>();
            for (Object item : items) {
                if (!(item instanceof Map<?, ?> eventMap)) {
                    continue;
                }
                Map<String, Object> event = (Map<String, Object>) eventMap;
                ClubCalendarEventResult mapped = mapToClubCalendarEvent(event);
                if (mapped != null) {
                    results.add(mapped);
                }
            }
            return results;
        } catch (HttpStatusCodeException e) {
            log.warn("Google 캘린더 이벤트 조회 실패. calendarId={}, status={}", calendarId, e.getStatusCode());
            throw new RestApiException(ErrorCode.GOOGLE_API_FAILED);
        }
    }

    @SuppressWarnings("unchecked")
    private ClubCalendarEventResult mapToClubCalendarEvent(Map<String, Object> event) {
        String id = asString(event.get("id"));
        String title = asString(event.get("summary"));
        String description = asString(event.get("description"));
        String url = asString(event.get("htmlLink"));

        String start = null;
        String end = null;

        Object startObj = event.get("start");
        if (startObj instanceof Map<?, ?> startMap) {
            Map<String, Object> startMapTyped = (Map<String, Object>) startMap;
            start = asString(startMapTyped.get("dateTime"));
            if (!StringUtils.hasText(start)) {
                start = asString(startMapTyped.get("date"));
            }
        }

        Object endObj = event.get("end");
        if (endObj instanceof Map<?, ?> endMap) {
            Map<String, Object> endMapTyped = (Map<String, Object>) endMap;
            end = asString(endMapTyped.get("dateTime"));
            if (!StringUtils.hasText(end)) {
                end = asString(endMapTyped.get("date"));
            }
        }

        if (!StringUtils.hasText(start)) {
            return null;
        }

        return ClubCalendarEventResult.ofGoogle(
                StringUtils.hasText(id) ? id : "unknown",
                StringUtils.hasText(title) ? title : "(제목 없음)",
                start,
                end,
                url,
                description
        );
    }

    private String getValidAccessToken(String clubId) {
        GoogleConnection connection = googleConnectionRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.GOOGLE_NOT_CONNECTED));

        if (connection.isTokenExpired()) {
            return refreshAccessToken(connection);
        }

        try {
            return cipher.decrypt(connection.getEncryptedAccessToken());
        } catch (Exception e) {
            log.error("Google access token 복호화 실패. clubId={}", clubId, e);
            throw new RestApiException(ErrorCode.GOOGLE_API_FAILED);
        }
    }

    private String refreshAccessToken(GoogleConnection connection) {
        String refreshToken;
        try {
            refreshToken = cipher.decrypt(connection.getEncryptedRefreshToken());
        } catch (Exception e) {
            log.error("Google refresh token 복호화 실패. clubId={}", connection.getClubId(), e);
            throw new RestApiException(ErrorCode.GOOGLE_TOKEN_REFRESH_FAILED);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", googleProperties.clientId());
        body.add("client_secret", googleProperties.clientSecret());
        body.add("refresh_token", refreshToken);
        body.add("grant_type", "refresh_token");

        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<GoogleTokenApiResponse> response = restTemplate.exchange(
                    GOOGLE_TOKEN_ENDPOINT,
                    HttpMethod.POST,
                    httpEntity,
                    GoogleTokenApiResponse.class
            );

            GoogleTokenApiResponse tokenResponse = response.getBody();
            if (tokenResponse == null || !StringUtils.hasText(tokenResponse.accessToken())) {
                throw new RestApiException(ErrorCode.GOOGLE_TOKEN_REFRESH_FAILED);
            }

            String encryptedAccessToken = cipher.encrypt(tokenResponse.accessToken());
            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(
                    tokenResponse.expiresIn() != null ? tokenResponse.expiresIn() : 3600
            );

            Query query = Query.query(Criteria.where("_id").is(connection.getClubId()));
            Update update = new Update()
                    .set("encryptedAccessToken", encryptedAccessToken)
                    .set("tokenExpiresAt", expiresAt)
                    .set("updatedAt", LocalDateTime.now());
            mongoTemplate.updateFirst(query, update, GoogleConnection.class);

            return tokenResponse.accessToken();
        } catch (HttpStatusCodeException e) {
            log.warn("Google 토큰 갱신 실패. clubId={}, status={}", connection.getClubId(), e.getStatusCode());
            throw new RestApiException(ErrorCode.GOOGLE_TOKEN_REFRESH_FAILED);
        }
    }

    private String fetchUserEmail(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    GOOGLE_USERINFO_ENDPOINT,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            Map<String, Object> body = response.getBody();
            if (body != null) {
                return asString(body.get("email"));
            }
            return null;
        } catch (HttpStatusCodeException e) {
            log.warn("Google 사용자 정보 조회 실패. status={}", e.getStatusCode());
            return null;
        }
    }

    private void saveGoogleConnection(String clubId, GoogleTokenApiResponse tokenResponse, String email) {
        try {
            String encryptedAccessToken = cipher.encrypt(tokenResponse.accessToken());
            String encryptedRefreshToken = StringUtils.hasText(tokenResponse.refreshToken())
                    ? cipher.encrypt(tokenResponse.refreshToken())
                    : null;

            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(
                    tokenResponse.expiresIn() != null ? tokenResponse.expiresIn() : 3600
            );

            Query query = Query.query(Criteria.where("_id").is(clubId));
            Update update = new Update()
                    .set("encryptedAccessToken", encryptedAccessToken)
                    .set("email", email)
                    .set("tokenExpiresAt", expiresAt)
                    .set("updatedAt", LocalDateTime.now());

            if (encryptedRefreshToken != null) {
                update.set("encryptedRefreshToken", encryptedRefreshToken);
            }

            mongoTemplate.upsert(query, update, GoogleConnection.class);
        } catch (Exception e) {
            log.error("Google access token 암호화 저장 실패. clubId={}", clubId, e);
            throw new RestApiException(ErrorCode.GOOGLE_TOKEN_EXCHANGE_FAILED);
        }
    }

    private void validateConfig() {
        if (!StringUtils.hasText(googleProperties.clientId()) ||
            !StringUtils.hasText(googleProperties.clientSecret()) ||
            !StringUtils.hasText(googleProperties.redirectUri())) {
            throw new RestApiException(ErrorCode.GOOGLE_CONFIG_MISSING);
        }
    }

    private String requireAuthenticatedClubId(CustomUserDetails user) {
        if (user == null || !StringUtils.hasText(user.getId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.GOOGLE_CLUB_NOT_FOUND));

        if (!StringUtils.hasText(club.getId())) {
            throw new RestApiException(ErrorCode.GOOGLE_CLUB_NOT_FOUND);
        }
        return club.getId();
    }

    private String asString(Object value) {
        if (value instanceof String s && StringUtils.hasText(s)) {
            return s;
        }
        return null;
    }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/google/service/GoogleOAuthService.java
git commit -m "feat: GoogleOAuthService 구현"
```

---

## Task 10: GoogleOAuthController 생성

**Files:**
- Create: `src/main/java/moadong/calendar/google/controller/GoogleOAuthController.java`

- [ ] **Step 1: GoogleOAuthController.java 생성**

```java
package moadong.calendar.google.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.calendar.google.payload.request.GoogleCalendarSelectRequest;
import moadong.calendar.google.payload.request.GoogleTokenExchangeRequest;
import moadong.calendar.google.payload.response.GoogleTokenExchangeResponse;
import moadong.calendar.google.service.GoogleOAuthService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integration/google")
@RequiredArgsConstructor
@Tag(name = "Google Calendar Integration", description = "Google Calendar OAuth 연동 API")
public class GoogleOAuthController {

    private final GoogleOAuthService googleOAuthService;

    @GetMapping("/oauth/authorize")
    @Operation(summary = "Google OAuth 인가 URL 생성", description = "Google OAuth 인가 페이지로 이동할 URL을 생성합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getAuthorizeUrl(@RequestParam(required = false) String state) {
        return Response.ok(googleOAuthService.getAuthorizeUrl(state));
    }

    @PostMapping("/oauth/token")
    @Operation(summary = "Google OAuth code 교환", description = "Google authorization code를 access token으로 교환합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> exchangeToken(@CurrentUser CustomUserDetails user,
                                           @RequestBody @Valid GoogleTokenExchangeRequest request) {
        GoogleTokenExchangeResponse response = googleOAuthService.exchangeCode(user, request);
        return Response.ok(response);
    }

    @GetMapping("/calendars")
    @Operation(summary = "Google 캘린더 목록 조회", description = "Google 계정의 캘린더 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getCalendars(@CurrentUser CustomUserDetails user) {
        return Response.ok(googleOAuthService.getCalendars(user));
    }

    @PostMapping("/calendars/{calendarId}/select")
    @Operation(summary = "Google 캘린더 선택", description = "이벤트를 가져올 캘린더를 선택합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> selectCalendar(@CurrentUser CustomUserDetails user,
                                            @PathVariable String calendarId,
                                            @RequestBody @Valid GoogleCalendarSelectRequest request) {
        googleOAuthService.selectCalendar(user, calendarId, request);
        return Response.ok("캘린더가 선택되었습니다.");
    }

    @DeleteMapping("/connection")
    @Operation(summary = "Google Calendar 연결 해제", description = "Google Calendar 연결을 해제합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteConnection(@CurrentUser CustomUserDetails user) {
        googleOAuthService.deleteConnection(user);
        return Response.ok("Google Calendar 연결이 해제되었습니다.");
    }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/google/controller/GoogleOAuthController.java
git commit -m "feat: GoogleOAuthController 추가"
```

---

## Task 11: CalendarAggregationService 생성

**Files:**
- Create: `src/main/java/moadong/calendar/service/CalendarAggregationService.java`

- [ ] **Step 1: CalendarAggregationService.java 생성**

```java
package moadong.calendar.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.calendar.google.service.GoogleOAuthService;
import moadong.calendar.notion.service.NotionOAuthService;
import moadong.club.payload.dto.ClubCalendarEventResult;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Slf4j
@RequiredArgsConstructor
public class CalendarAggregationService {

    private final NotionOAuthService notionOAuthService;
    private final GoogleOAuthService googleOAuthService;

    public List<ClubCalendarEventResult> getAggregatedEvents(String clubId) {
        List<ClubCalendarEventResult> allEvents = new ArrayList<>();

        try {
            List<ClubCalendarEventResult> notionEvents = notionOAuthService.getClubCalendarEvents(clubId);
            allEvents.addAll(notionEvents);
            log.debug("Notion 이벤트 조회 성공. clubId={}, count={}", clubId, notionEvents.size());
        } catch (Exception e) {
            log.warn("Notion 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
        }

        try {
            List<ClubCalendarEventResult> googleEvents = googleOAuthService.getClubCalendarEvents(clubId);
            allEvents.addAll(googleEvents);
            log.debug("Google 이벤트 조회 성공. clubId={}, count={}", clubId, googleEvents.size());
        } catch (Exception e) {
            log.warn("Google 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
        }

        return allEvents.stream()
                .sorted(Comparator.comparing(
                        ClubCalendarEventResult::start,
                        Comparator.nullsLast(String::compareTo)
                ))
                .toList();
    }

    public boolean hasAnyCalendarConnection(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return false;
        }

        boolean hasNotion = false;
        boolean hasGoogle = false;

        try {
            hasNotion = notionOAuthService.hasCalendarConnection(clubId);
        } catch (Exception e) {
            log.debug("Notion 연결 상태 확인 실패. clubId={}", clubId);
        }

        try {
            hasGoogle = googleOAuthService.hasCalendarConnection(clubId);
        } catch (Exception e) {
            log.debug("Google 연결 상태 확인 실패. clubId={}", clubId);
        }

        return hasNotion || hasGoogle;
    }
}
```

- [ ] **Step 2: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 커밋**

```bash
git add src/main/java/moadong/calendar/service/CalendarAggregationService.java
git commit -m "feat: CalendarAggregationService 구현"
```

---

## Task 12: ClubProfileService를 CalendarAggregationService로 교체

**Files:**
- Modify: `src/main/java/moadong/club/service/ClubProfileService.java`

- [ ] **Step 1: import 수정**

`ClubProfileService.java`의 5번 줄 import를 다음으로 변경:

```java
import moadong.calendar.service.CalendarAggregationService;
```

- [ ] **Step 2: 필드 수정**

40번 줄의 필드를 다음으로 변경:

```java
    private final CalendarAggregationService calendarAggregationService;
```

- [ ] **Step 3: getClubDetail 메서드 수정**

93번 줄을 다음으로 변경:

```java
        boolean hasCalendarEvents = calendarAggregationService.hasAnyCalendarConnection(club.getId());
```

- [ ] **Step 4: getClubDetailByClubName 메서드 수정**

102번 줄을 다음으로 변경:

```java
        boolean hasCalendarEvents = calendarAggregationService.hasAnyCalendarConnection(club.getId());
```

- [ ] **Step 5: getClubCalendarEvents 메서드 수정**

112번 줄을 다음으로 변경:

```java
        List<ClubCalendarEventResult> calendarEvents = calendarAggregationService.getAggregatedEvents(club.getId());
```

- [ ] **Step 6: getClubCalendarEventsByClubName 메서드 수정**

120번 줄을 다음으로 변경:

```java
        List<ClubCalendarEventResult> calendarEvents = calendarAggregationService.getAggregatedEvents(club.getId());
```

- [ ] **Step 7: 빌드 확인**

Run: `./gradlew compileJava`
Expected: BUILD SUCCESSFUL

- [ ] **Step 8: 커밋**

```bash
git add src/main/java/moadong/club/service/ClubProfileService.java
git commit -m "refactor: ClubProfileService에서 CalendarAggregationService 사용"
```

---

## Task 13: CalendarAggregationServiceTest 작성

**Files:**
- Create: `src/test/java/moadong/calendar/service/CalendarAggregationServiceTest.java`

- [ ] **Step 1: CalendarAggregationServiceTest.java 생성**

```java
package moadong.calendar.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import moadong.calendar.google.service.GoogleOAuthService;
import moadong.calendar.notion.service.NotionOAuthService;
import moadong.club.payload.dto.ClubCalendarEventResult;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

@UnitTest
class CalendarAggregationServiceTest {

    @Mock
    private NotionOAuthService notionOAuthService;

    @Mock
    private GoogleOAuthService googleOAuthService;

    private CalendarAggregationService calendarAggregationService;

    private static final String CLUB_ID = "test-club-id";

    @BeforeEach
    void setUp() {
        calendarAggregationService = new CalendarAggregationService(notionOAuthService, googleOAuthService);
    }

    @Test
    @DisplayName("Notion과 Google 이벤트를 병합하여 시작일 기준 정렬한다")
    void getAggregatedEvents_mergesAndSortsByStart() {
        ClubCalendarEventResult notionEvent = ClubCalendarEventResult.ofNotion(
                "notion-1", "Notion 이벤트", "2026-04-02", null, null, null);
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-01", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(notionEvent));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).source()).isEqualTo("GOOGLE");
        assertThat(results.get(1).source()).isEqualTo("NOTION");
    }

    @Test
    @DisplayName("Notion 조회 실패 시 Google 이벤트만 반환한다")
    void getAggregatedEvents_notionFails_returnsGoogleOnly() {
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-01", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Notion 오류"));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).source()).isEqualTo("GOOGLE");
    }

    @Test
    @DisplayName("Google 조회 실패 시 Notion 이벤트만 반환한다")
    void getAggregatedEvents_googleFails_returnsNotionOnly() {
        ClubCalendarEventResult notionEvent = ClubCalendarEventResult.ofNotion(
                "notion-1", "Notion 이벤트", "2026-04-01", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(notionEvent));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Google 오류"));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).source()).isEqualTo("NOTION");
    }

    @Test
    @DisplayName("둘 다 실패 시 빈 리스트를 반환한다")
    void getAggregatedEvents_bothFail_returnsEmpty() {
        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Notion 오류"));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Google 오류"));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).isEmpty();
    }

    @Test
    @DisplayName("Notion만 연결된 경우 true를 반환한다")
    void hasAnyCalendarConnection_notionOnly_returnsTrue() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(true);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Google만 연결된 경우 true를 반환한다")
    void hasAnyCalendarConnection_googleOnly_returnsTrue() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(true);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("둘 다 연결되지 않은 경우 false를 반환한다")
    void hasAnyCalendarConnection_noneConnected_returnsFalse() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isFalse();
    }
}
```

- [ ] **Step 2: 테스트 실행**

Run: `./gradlew test --tests "moadong.calendar.service.CalendarAggregationServiceTest" -i`
Expected: BUILD SUCCESSFUL, 7 tests passed

- [ ] **Step 3: 커밋**

```bash
git add src/test/java/moadong/calendar/service/CalendarAggregationServiceTest.java
git commit -m "test: CalendarAggregationServiceTest 추가"
```

---

## Task 14: 전체 빌드 및 테스트 검증

**Files:**
- None (verification only)

- [ ] **Step 1: 전체 빌드**

Run: `./gradlew build -x test`
Expected: BUILD SUCCESSFUL

- [ ] **Step 2: 유닛 테스트 실행**

Run: `./gradlew unitTest`
Expected: BUILD SUCCESSFUL

- [ ] **Step 3: 최종 커밋**

```bash
git add -A
git commit -m "feat: Google Calendar 연동 구현 완료

- GoogleConnection 엔티티 및 레포지토리 추가
- GoogleOAuthService 구현 (OAuth, 토큰 갱신, 이벤트 조회)
- GoogleOAuthController API 엔드포인트 추가
- CalendarAggregationService로 Notion/Google 이벤트 통합
- ClubCalendarEventResult에 source 필드 추가
- Google Calendar 관련 ErrorCode 추가
- CalendarAggregationServiceTest 테스트 추가"
```

---

## 구현 후 필요 작업

### Infisical 설정 추가

다음 환경변수를 Infisical에 추가해야 합니다:

```
GOOGLE_CALENDAR_CLIENT_ID=<Google Cloud Console에서 발급>
GOOGLE_CALENDAR_CLIENT_SECRET=<Google Cloud Console에서 발급>
GOOGLE_CALENDAR_REDIRECT_URI=<프론트엔드 콜백 URL>
```

### Google Cloud Console 설정

1. Google Cloud Console에서 프로젝트 생성
2. Google Calendar API 활성화
3. OAuth 2.0 클라이언트 ID 생성 (웹 애플리케이션 유형)
4. 승인된 리디렉션 URI에 `GOOGLE_CALENDAR_REDIRECT_URI` 추가
