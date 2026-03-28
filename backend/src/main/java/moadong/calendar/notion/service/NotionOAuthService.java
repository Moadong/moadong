package moadong.calendar.notion.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.AESCipher;
import moadong.calendar.notion.config.NotionProperties;
import moadong.calendar.notion.entity.NotionConnection;
import moadong.calendar.notion.payload.dto.NotionTokenApiResponse;
import moadong.calendar.notion.payload.request.NotionTokenExchangeRequest;
import moadong.calendar.notion.payload.response.NotionTokenExchangeResponse;
import moadong.calendar.notion.repository.NotionConnectionRepository;
import moadong.club.entity.Club;
import moadong.club.payload.dto.ClubCalendarEventResult;
import moadong.club.repository.ClubRepository;
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
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotionOAuthService {

    private final RestTemplate restTemplate;
    private final NotionConnectionRepository notionConnectionRepository;
    private final MongoTemplate mongoTemplate;
    private final ClubRepository clubRepository;
    private final AESCipher cipher;
    private final NotionProperties notionProperties;

    private static final String NOTION_TOKEN_ENDPOINT = "https://api.notion.com/v1/oauth/token";
    private static final String NOTION_SEARCH_ENDPOINT = "https://api.notion.com/v1/search";
    private static final String NOTION_AUTHORIZE_ENDPOINT = "https://api.notion.com/v1/oauth/authorize";
    private static final String NOTION_DATABASE_QUERY_ENDPOINT = "https://api.notion.com/v1/databases/{databaseId}/query";

    public Map<String, String> getAuthorizeUrl(String state) {
        String notionClientId = notionProperties.clientId();
        String notionRedirectUri = notionProperties.redirectUri();

        if (!StringUtils.hasText(notionClientId)) {
            throw new RestApiException(ErrorCode.NOTION_CONFIG_MISSING);
        }
        if (!StringUtils.hasText(notionRedirectUri)) {
            throw new RestApiException(ErrorCode.NOTION_CONFIG_MISSING);
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(NOTION_AUTHORIZE_ENDPOINT)
                .queryParam("owner", "user")
                .queryParam("client_id", notionClientId)
                .queryParam("redirect_uri", notionRedirectUri)
                .queryParam("response_type", "code");

        if (StringUtils.hasText(state)) {
            builder.queryParam("state", state);
        }

        return Map.of("authorizeUrl", builder.build(true).toUriString());
    }

    public NotionTokenExchangeResponse exchangeCode(CustomUserDetails user, NotionTokenExchangeRequest request) {
        String clubId = requireAuthenticatedClubId(user);
        String notionClientId = notionProperties.clientId();
        String notionClientSecret = notionProperties.clientSecret();
        String notionRedirectUri = notionProperties.redirectUri();

        if (!StringUtils.hasText(notionClientId)) {
            throw new RestApiException(ErrorCode.NOTION_CONFIG_MISSING);
        }

        if (!StringUtils.hasText(notionClientSecret)) {
            throw new RestApiException(ErrorCode.NOTION_CONFIG_MISSING);
        }
        if (!StringUtils.hasText(notionRedirectUri)) {
            throw new RestApiException(ErrorCode.NOTION_CONFIG_MISSING);
        }

        String basicCredentials = Base64.getEncoder()
                .encodeToString((notionClientId + ":" + notionClientSecret)
                        .getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Basic " + basicCredentials);

        HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(
                Map.of(
                        "grant_type", "authorization_code",
                        "code", request.code(),
                        "redirect_uri", notionRedirectUri
                ),
                headers
        );

        try {
            ResponseEntity<NotionTokenApiResponse> response = restTemplate.exchange(
                    NOTION_TOKEN_ENDPOINT,
                    HttpMethod.POST,
                    httpEntity,
                    NotionTokenApiResponse.class
            );

            NotionTokenApiResponse body = response.getBody();
            if (body == null || !StringUtils.hasText(body.accessToken())) {
                throw new RestApiException(ErrorCode.NOTION_TOKEN_EMPTY);
            }

            saveNotionConnection(clubId, body);

            return new NotionTokenExchangeResponse(
                    body.workspaceName(),
                    body.workspaceId()
            );
        } catch (HttpStatusCodeException e) {
            log.warn("Notion 토큰 교환 실패. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.NOTION_TOKEN_EXCHANGE_FAILED);
        }
    }

    public Map<String, Object> getRecentPages(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);
        String notionAccessToken = getDecryptedAccessToken(clubId);
        String nextCursor = null;
        List<Object> allResults = new ArrayList<>();
        int requestCount = 0;
        boolean hasMore = false;
        boolean partial = false;

        while (true) {
            Map<String, Object> responseBody = searchNotionPages(notionAccessToken, nextCursor);
            requestCount++;

            Object resultsObj = responseBody.get("results");
            if (resultsObj instanceof List<?> resultList) {
                allResults.addAll(resultList);
            }

            hasMore = Boolean.TRUE.equals(responseBody.get("has_more"));
            Object cursorObj = responseBody.get("next_cursor");
            nextCursor = cursorObj instanceof String cursor && StringUtils.hasText(cursor) ? cursor : null;

            if (!hasMore || !StringUtils.hasText(nextCursor)) {
                break;
            }

            if (requestCount >= 50) {
                partial = true;
                log.warn("Notion 페이지 목록 페이지네이션 요청 상한 도달. clubId={}, collected={}", clubId, allResults.size());
                break;
            }
        }

        Map<String, Object> aggregated = new LinkedHashMap<>();
        aggregated.put("object", "list");
        aggregated.put("results", allResults);
        aggregated.put("has_more", partial && hasMore);
        aggregated.put("next_cursor", partial ? nextCursor : null);
        aggregated.put("total_results", allResults.size());
        if (partial) {
            aggregated.put("partial", true);
        }
        return aggregated;
    }

    public Map<String, Object> getDatabases(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);
        String notionAccessToken = getDecryptedAccessToken(clubId);
        String nextCursor = null;
        List<Object> allResults = new ArrayList<>();
        int requestCount = 0;
        boolean hasMore = false;
        boolean partial = false;

        while (true) {
            Map<String, Object> responseBody = searchNotionDatabases(notionAccessToken, nextCursor);
            requestCount++;

            Object resultsObj = responseBody.get("results");
            if (resultsObj instanceof List<?> resultList) {
                allResults.addAll(resultList);
            }

            hasMore = Boolean.TRUE.equals(responseBody.get("has_more"));
            Object cursorObj = responseBody.get("next_cursor");
            nextCursor = cursorObj instanceof String cursor && StringUtils.hasText(cursor) ? cursor : null;

            if (!hasMore || !StringUtils.hasText(nextCursor)) {
                break;
            }

            if (requestCount >= 50) {
                partial = true;
                log.warn("Notion DB 목록 페이지네이션 요청 상한 도달. clubId={}, collected={}", clubId, allResults.size());
                break;
            }
        }

        Map<String, Object> aggregated = new LinkedHashMap<>();
        aggregated.put("object", "list");
        aggregated.put("results", allResults);
        aggregated.put("has_more", partial && hasMore);
        aggregated.put("next_cursor", partial ? nextCursor : null);
        aggregated.put("total_results", allResults.size());
        if (partial) {
            aggregated.put("partial", true);
        }
        return aggregated;
    }

    public Map<String, Object> getDatabasePages(CustomUserDetails user, String databaseId, String dateProperty) {
        String clubId = requireAuthenticatedClubId(user);
        String notionAccessToken = getDecryptedAccessToken(clubId);

        if (!StringUtils.hasText(databaseId)) {
            throw new RestApiException(ErrorCode.NOTION_DATABASE_ID_REQUIRED);
        }

        String nextCursor = null;
        List<Object> allResults = new ArrayList<>();
        int requestCount = 0;
        boolean hasMore = false;
        boolean partial = false;

        while (true) {
            Map<String, Object> responseBody = queryNotionDatabase(notionAccessToken, databaseId, dateProperty, nextCursor);
            requestCount++;

            Object resultsObj = responseBody.get("results");
            if (resultsObj instanceof List<?> resultList) {
                allResults.addAll(resultList);
            }

            hasMore = Boolean.TRUE.equals(responseBody.get("has_more"));
            Object cursorObj = responseBody.get("next_cursor");
            nextCursor = cursorObj instanceof String cursor && StringUtils.hasText(cursor) ? cursor : null;

            if (!hasMore || !StringUtils.hasText(nextCursor)) {
                break;
            }

            if (requestCount >= 50) {
                partial = true;
                log.warn("Notion DB 페이지네이션 요청 상한 도달. clubId={}, databaseId={}, collected={}",
                        clubId, databaseId, allResults.size());
                break;
            }
        }

        saveDatabaseId(clubId, databaseId);

        Map<String, Object> aggregated = new LinkedHashMap<>();
        aggregated.put("object", "list");
        aggregated.put("results", allResults);
        aggregated.put("has_more", partial && hasMore);
        aggregated.put("next_cursor", partial ? nextCursor : null);
        aggregated.put("total_results", allResults.size());
        aggregated.put("database_id", databaseId);
        if (partial) {
            aggregated.put("partial", true);
        }
        if (StringUtils.hasText(dateProperty)) {
            aggregated.put("date_property", dateProperty);
        }
        return aggregated;
    }

    public List<ClubCalendarEventResult> getClubCalendarEvents(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            log.debug("클럽 상세 캘린더 이벤트 조회 스킵: clubId가 비어있습니다.");
            return List.of();
        }

        try {
            NotionConnection connection = getNotionConnection(clubId);
            if (!StringUtils.hasText(connection.getDatabaseId())) {
                log.debug("클럽 상세 캘린더 이벤트 조회 스킵. clubId={}, reason=databaseId 미설정", clubId);
                return List.of();
            }

            String notionAccessToken = getDecryptedAccessToken(clubId);
            String nextCursor = null;
            List<Object> allResults = new ArrayList<>();
            int requestCount = 0;

            while (true) {
                Map<String, Object> responseBody = queryNotionDatabase(
                        notionAccessToken,
                        connection.getDatabaseId(),
                        null,
                        nextCursor
                );
                requestCount++;

                Object resultsObj = responseBody.get("results");
                if (resultsObj instanceof List<?> resultList) {
                    allResults.addAll(resultList);
                }

                boolean hasMore = Boolean.TRUE.equals(responseBody.get("has_more"));
                Object cursorObj = responseBody.get("next_cursor");
                nextCursor = cursorObj instanceof String cursor && StringUtils.hasText(cursor) ? cursor : null;

                if (!hasMore || !StringUtils.hasText(nextCursor)) {
                    break;
                }

                if (requestCount >= 50) {
                    log.warn("클럽 상세 캘린더 이벤트 페이지네이션 상한 도달. clubId={}, databaseId={}, collected={}",
                            clubId, connection.getDatabaseId(), allResults.size());
                    break;
                }
            }

            List<ClubCalendarEventResult> mappedEvents = allResults.stream()
                    .map(this::mapToClubCalendarEvent)
                    .flatMap(Optional::stream)
                    .toList();

            log.debug("클럽 상세 캘린더 이벤트 조회 완료. clubId={}, databaseId={}, notionResults={}, mappedEvents={}",
                    clubId, connection.getDatabaseId(), allResults.size(), mappedEvents.size());
            return mappedEvents;
        } catch (IllegalStateException e) {
            log.debug("클럽 상세 캘린더 이벤트 미연동 상태. clubId={}, message={}", clubId, e.getMessage());
            return List.of();
        } catch (Exception e) {
            log.warn("클럽 상세 캘린더 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
            return List.of();
        }
    }

    private Map<String, Object> searchNotionPages(String notionAccessToken, String startCursor) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(notionAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Notion-Version", notionProperties.version());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("filter", Map.of("property", "object", "value", "page"));
        body.put("sort", Map.of("direction", "descending", "timestamp", "last_edited_time"));
        body.put("page_size", 100);
        if (StringUtils.hasText(startCursor)) {
            body.put("start_cursor", startCursor);
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    NOTION_SEARCH_ENDPOINT,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RestApiException(ErrorCode.NOTION_SEARCH_FAILED);
            }
            return responseBody;
        } catch (HttpStatusCodeException e) {
            log.warn("Notion 페이지 조회 실패 status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.NOTION_SEARCH_FAILED);
        }
    }

    private Map<String, Object> searchNotionDatabases(String notionAccessToken, String startCursor) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(notionAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Notion-Version", notionProperties.version());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("filter", Map.of("property", "object", "value", "database"));
        body.put("sort", Map.of("direction", "descending", "timestamp", "last_edited_time"));
        body.put("page_size", 100);
        if (StringUtils.hasText(startCursor)) {
            body.put("start_cursor", startCursor);
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    NOTION_SEARCH_ENDPOINT,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RestApiException(ErrorCode.NOTION_SEARCH_FAILED);
            }
            return responseBody;
        } catch (HttpStatusCodeException e) {
            log.warn("Notion DB 목록 조회 실패 status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.NOTION_SEARCH_FAILED);
        }
    }

    private Map<String, Object> queryNotionDatabase(String notionAccessToken,
                                                    String databaseId,
                                                    String dateProperty,
                                                    String startCursor) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(notionAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Notion-Version", notionProperties.version());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("page_size", 100);
        body.put("sorts", List.of(Map.of("timestamp", "last_edited_time", "direction", "descending")));
        if (StringUtils.hasText(startCursor)) {
            body.put("start_cursor", startCursor);
        }
        if (StringUtils.hasText(dateProperty)) {
            body.put("filter", Map.of(
                    "property", dateProperty,
                    "date", Map.of("is_not_empty", true)
            ));
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    NOTION_DATABASE_QUERY_ENDPOINT,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<>() {},
                    Map.of("databaseId", databaseId)
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RestApiException(ErrorCode.NOTION_DATABASE_QUERY_FAILED);
            }
            return responseBody;
        } catch (HttpStatusCodeException e) {
            log.warn("Notion DB 조회 실패 status={}, databaseId={}, body={}",
                    e.getStatusCode(), databaseId, e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.NOTION_DATABASE_QUERY_FAILED);
        }
    }

    private String requireAuthenticatedUserId(CustomUserDetails user) {
        if (user == null || !StringUtils.hasText(user.getId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        return user.getId();
    }

    private String requireAuthenticatedClubId(CustomUserDetails user) {
        String userId = requireAuthenticatedUserId(user);
        Club club = clubRepository.findClubByUserId(userId)
                .orElseThrow(() -> new RestApiException(ErrorCode.NOTION_CLUB_NOT_FOUND));

        if (!StringUtils.hasText(club.getId())) {
            throw new RestApiException(ErrorCode.NOTION_CLUB_NOT_FOUND);
        }
        return club.getId();
    }

    private void saveNotionConnection(String clubId, NotionTokenApiResponse body) {
        try {
            String encryptedAccessToken = cipher.encrypt(body.accessToken());
            Query query = Query.query(Criteria.where("_id").is(clubId));
            Update update = new Update()
                    .set("encryptedAccessToken", encryptedAccessToken)
                    .set("workspaceName", body.workspaceName())
                    .set("workspaceId", body.workspaceId())
                    .set("updatedAt", LocalDateTime.now());
            mongoTemplate.upsert(query, update, NotionConnection.class);
        } catch (Exception e) {
            log.error("Notion access token 암호화 저장 실패. clubId={}", clubId, e);
            throw new RestApiException(ErrorCode.NOTION_TOKEN_SAVE_FAILED);
        }
    }

    private String getDecryptedAccessToken(String clubId) {
        NotionConnection connection = getNotionConnection(clubId);

        if (!StringUtils.hasText(connection.getEncryptedAccessToken())) {
            throw new RestApiException(ErrorCode.NOTION_NOT_CONNECTED);
        }

        try {
            return cipher.decrypt(connection.getEncryptedAccessToken());
        } catch (Exception e) {
            log.error("Notion access token 복호화 실패. clubId={}", clubId, e);
            throw new RestApiException(ErrorCode.NOTION_TOKEN_DECRYPT_FAILED);
        }
    }

    private NotionConnection getNotionConnection(String clubId) {
        return notionConnectionRepository.findById(clubId)
                .or(() -> findLegacyNotionConnectionAndMigrate(clubId))
                .orElseThrow(() -> new RestApiException(ErrorCode.NOTION_NOT_CONNECTED));
    }

    private Optional<NotionConnection> findLegacyNotionConnectionAndMigrate(String clubId) {
        return clubRepository.findById(clubId)
                .map(Club::getUserId)
                .filter(StringUtils::hasText)
                .flatMap(notionConnectionRepository::findById)
                .map(legacy -> {
                    NotionConnection migrated = NotionConnection.builder()
                            .clubId(clubId)
                            .encryptedAccessToken(legacy.getEncryptedAccessToken())
                            .workspaceName(legacy.getWorkspaceName())
                            .workspaceId(legacy.getWorkspaceId())
                            .databaseId(legacy.getDatabaseId())
                            .updatedAt(legacy.getUpdatedAt())
                            .build();
                    return notionConnectionRepository.save(migrated);
                });
    }

    private void saveDatabaseId(String clubId, String databaseId) {
        Query query = Query.query(Criteria.where("_id").is(clubId));
        Update update = new Update()
                .set("databaseId", databaseId)
                .set("updatedAt", LocalDateTime.now());
        com.mongodb.client.result.UpdateResult result = mongoTemplate.updateFirst(query, update, NotionConnection.class);
        if (result.getMatchedCount() == 0) {
            throw new RestApiException(ErrorCode.NOTION_NOT_CONNECTED);
        }
    }

    @SuppressWarnings("unchecked")
    private Optional<ClubCalendarEventResult> mapToClubCalendarEvent(Object resultObj) {
        if (!(resultObj instanceof Map<?, ?> raw)) {
            return Optional.empty();
        }

        Map<String, Object> page = (Map<String, Object>) raw;
        String id = asString(page.get("id"));
        String url = asString(page.get("url"));

        Map<String, Object> properties = page.get("properties") instanceof Map<?, ?> propMap
                ? (Map<String, Object>) propMap
                : Map.of();

        String title = null;
        String description = null;
        String start = null;
        String end = null;

        for (Map.Entry<String, Object> entry : properties.entrySet()) {
            if (!(entry.getValue() instanceof Map<?, ?> valueMap)) {
                continue;
            }

            Map<String, Object> property = (Map<String, Object>) valueMap;
            String type = asString(property.get("type"));
            String propertyName = entry.getKey();

            if (!StringUtils.hasText(title) && "title".equals(type)) {
                title = extractPlainTextList(property.get("title"));
            }

            if (!StringUtils.hasText(description)
                    && StringUtils.hasText(propertyName)
                    && ("description".equalsIgnoreCase(propertyName) || propertyName.contains("설명"))
                    && "rich_text".equals(type)) {
                description = extractPlainTextList(property.get("rich_text"));
            }

            if (!StringUtils.hasText(start) && "date".equals(type) && property.get("date") instanceof Map<?, ?> dateMap) {
                start = asString(((Map<String, Object>) dateMap).get("start"));
                end = asString(((Map<String, Object>) dateMap).get("end"));
            }
        }

        if (!StringUtils.hasText(start)) {
            return Optional.empty();
        }

        String resolvedId = StringUtils.hasText(id) ? id : (StringUtils.hasText(url) ? url : "unknown");
        String resolvedTitle = StringUtils.hasText(title) ? title : "(제목 없음)";

        return Optional.of(new ClubCalendarEventResult(
                resolvedId,
                resolvedTitle,
                start,
                StringUtils.hasText(end) ? end : null,
                StringUtils.hasText(url) ? url : null,
                StringUtils.hasText(description) ? description : null
        ));
    }

    @SuppressWarnings("unchecked")
    private String extractPlainTextList(Object textListObj) {
        if (!(textListObj instanceof List<?> list) || list.isEmpty()) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        for (Object item : list) {
            if (!(item instanceof Map<?, ?> map)) {
                continue;
            }
            String plainText = asString(((Map<String, Object>) map).get("plain_text"));
            if (StringUtils.hasText(plainText)) {
                if (!sb.isEmpty()) {
                    sb.append(' ');
                }
                sb.append(plainText);
            }
        }
        return sb.isEmpty() ? null : sb.toString();
    }

    private String asString(Object value) {
        if (value instanceof String s && StringUtils.hasText(s)) {
            return s;
        }
        return null;
    }
}
