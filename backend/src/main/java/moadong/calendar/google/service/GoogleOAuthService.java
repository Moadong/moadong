package moadong.calendar.google.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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
    private static final int MAX_GOOGLE_PAGE_REQUESTS = 30;

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

        return Map.of("authorizeUrl", builder.build().encode().toUriString());
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
            Map<String, Object> result = new java.util.HashMap<>();
            List<Object> allCalendarItems = new ArrayList<>();
            String pageToken = null;

            for (int page = 0; page < MAX_GOOGLE_PAGE_REQUESTS; page++) {
                String requestUrl = UriComponentsBuilder.fromHttpUrl(GOOGLE_CALENDAR_LIST_ENDPOINT)
                        .queryParam("maxResults", 250)
                        .queryParamIfPresent("pageToken", java.util.Optional.ofNullable(pageToken))
                        .toUriString();

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                        requestUrl,
                        HttpMethod.GET,
                        entity,
                        new ParameterizedTypeReference<>() {}
                );

                Map<String, Object> body = response.getBody();
                if (body == null) {
                    break;
                }
                if (result.isEmpty()) {
                    result.putAll(body);
                }

                Object itemsObj = body.get("items");
                if (itemsObj instanceof List<?> items) {
                    allCalendarItems.addAll(items);
                }

                String nextPageToken = asString(body.get("nextPageToken"));
                if (!StringUtils.hasText(nextPageToken)) {
                    break;
                }
                pageToken = nextPageToken;
            }

            if (pageToken != null) {
                log.warn("Google 캘린더 목록 페이지 상한 도달. clubId={}, maxPages={}", clubId, MAX_GOOGLE_PAGE_REQUESTS);
            }

            result.put("items", allCalendarItems);
            result.remove("nextPageToken");

            // 현재 선택된 캘린더 정보 추가
            GoogleConnection connection = googleConnectionRepository.findById(clubId).orElse(null);
            if (connection != null && StringUtils.hasText(connection.getCalendarId())) {
                result.put("selectedCalendarId", connection.getCalendarId());
                if (StringUtils.hasText(connection.getCalendarName())) {
                    result.put("selectedCalendarName", connection.getCalendarName());
                }
            }

            return result;
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

    public List<ClubCalendarEventResult> getCalendarEvents(CustomUserDetails user, String calendarId, String timeMin, String timeMax) {
        String clubId = requireAuthenticatedClubId(user);

        GoogleConnection connection = googleConnectionRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.GOOGLE_NOT_CONNECTED));
        if (!StringUtils.hasText(connection.getCalendarId()) || !connection.getCalendarId().equals(calendarId)) {
            throw new RestApiException(ErrorCode.GOOGLE_NOT_CONNECTED);
        }

        validateTimeParameters(timeMin, timeMax);

        String accessToken = getValidAccessToken(clubId);

        return fetchCalendarEvents(accessToken, calendarId, timeMin, timeMax);
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
            String timeMin = OffsetDateTime.now(ZoneOffset.UTC).minusMonths(1).toString();
            return fetchCalendarEvents(accessToken, connection.getCalendarId(), timeMin, null);
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
    private List<ClubCalendarEventResult> fetchCalendarEvents(String accessToken, String calendarId, String timeMin, String timeMax) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            List<ClubCalendarEventResult> results = new ArrayList<>();
            String pageToken = null;

            for (int page = 0; page < MAX_GOOGLE_PAGE_REQUESTS; page++) {
                UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(GOOGLE_CALENDAR_EVENTS_ENDPOINT)
                        .queryParam("maxResults", 100)
                        .queryParam("orderBy", "startTime")
                        .queryParam("singleEvents", true);

                if (StringUtils.hasText(timeMin)) {
                    builder.queryParam("timeMin", timeMin);
                }
                if (StringUtils.hasText(timeMax)) {
                    builder.queryParam("timeMax", timeMax);
                }
                if (pageToken != null) {
                    builder.queryParam("pageToken", pageToken);
                }

                String url = builder.buildAndExpand(calendarId).toUriString();

                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        new ParameterizedTypeReference<>() {}
                );

                Map<String, Object> body = response.getBody();
                if (body == null) {
                    break;
                }

                Object itemsObj = body.get("items");
                if (itemsObj instanceof List<?> items) {
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
                }

                String nextPageToken = asString(body.get("nextPageToken"));
                if (!StringUtils.hasText(nextPageToken)) {
                    break;
                }
                pageToken = nextPageToken;
            }
            
            if (pageToken != null) {
                log.warn("Google 이벤트 페이지 상한 도달. calendarId={}, maxPages={}", calendarId, MAX_GOOGLE_PAGE_REQUESTS);
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
        } catch (Exception e) {
            log.error("Google 토큰 갱신 중 암호화 실패. clubId={}", connection.getClubId(), e);
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

    private void validateTimeParameters(String timeMin, String timeMax) {
        OffsetDateTime parsedTimeMin = null;
        OffsetDateTime parsedTimeMax = null;

        if (StringUtils.hasText(timeMin)) {
            try {
                parsedTimeMin = OffsetDateTime.parse(timeMin);
            } catch (Exception e) {
                throw new RestApiException(ErrorCode.GOOGLE_INVALID_TIME_FORMAT);
            }
        }

        if (StringUtils.hasText(timeMax)) {
            try {
                parsedTimeMax = OffsetDateTime.parse(timeMax);
            } catch (Exception e) {
                throw new RestApiException(ErrorCode.GOOGLE_INVALID_TIME_FORMAT);
            }
        }

        if (parsedTimeMin != null && parsedTimeMax != null && parsedTimeMin.isAfter(parsedTimeMax)) {
            throw new RestApiException(ErrorCode.GOOGLE_INVALID_TIME_RANGE);
        }
    }

    private String asString(Object value) {
        if (value instanceof String s && StringUtils.hasText(s)) {
            return s;
        }
        return null;
    }
}
