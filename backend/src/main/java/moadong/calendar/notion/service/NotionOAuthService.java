package moadong.calendar.notion.service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.util.AESCipher;
import moadong.calendar.notion.config.NotionProperties;
import moadong.calendar.notion.entity.NotionConnection;
import moadong.calendar.notion.payload.dto.NotionTokenApiResponse;
import moadong.calendar.notion.payload.request.NotionTokenExchangeRequest;
import moadong.calendar.notion.payload.response.NotionTokenExchangeResponse;
import moadong.calendar.notion.repository.NotionConnectionRepository;
import moadong.user.payload.CustomUserDetails;
import org.springframework.core.ParameterizedTypeReference;
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
            throw new IllegalStateException("NOTION_CLIENT_ID 서버 환경변수가 설정되지 않았습니다.");
        }
        if (!StringUtils.hasText(notionRedirectUri)) {
            throw new IllegalStateException("NOTION_REDIRECT_URI 서버 환경변수가 설정되지 않았습니다.");
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
        String userId = requireAuthenticatedUserId(user);
        String notionClientId = notionProperties.clientId();
        String notionClientSecret = notionProperties.clientSecret();
        String notionRedirectUri = notionProperties.redirectUri();

        if (!StringUtils.hasText(notionClientId)) {
            throw new IllegalStateException("NOTION_CLIENT_ID 서버 환경변수가 설정되지 않았습니다.");
        }

        if (!StringUtils.hasText(notionClientSecret)) {
            throw new IllegalStateException("NOTION_CLIENT_SECRET 서버 환경변수가 설정되지 않았습니다.");
        }
        if (!StringUtils.hasText(notionRedirectUri)) {
            throw new IllegalStateException("NOTION_REDIRECT_URI 서버 환경변수가 설정되지 않았습니다.");
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
                throw new IllegalStateException("Notion 토큰 응답이 비어있습니다.");
            }

            saveNotionConnection(userId, body);

            return new NotionTokenExchangeResponse(
                    body.workspaceName(),
                    body.workspaceId()
            );
        } catch (HttpStatusCodeException e) {
            throw new IllegalArgumentException("Notion 토큰 교환 실패: " + e.getResponseBodyAsString());
        }
    }

    public Map<String, Object> getRecentPages(CustomUserDetails user) {
        String userId = requireAuthenticatedUserId(user);
        NotionConnection connection = getNotionConnection(userId);
        String databaseId = connection.getDatabaseId();
        if (!StringUtils.hasText(databaseId)) {
            throw new IllegalStateException("저장된 Notion databaseId가 없습니다. 먼저 데이터베이스를 선택해주세요.");
        }

        return getDatabasePages(user, databaseId, null);
    }

    public Map<String, Object> getDatabases(CustomUserDetails user) {
        String userId = requireAuthenticatedUserId(user);
        String notionAccessToken = getDecryptedAccessToken(userId);
        String nextCursor = null;
        List<Object> allResults = new ArrayList<>();
        int requestCount = 0;

        while (true) {
            Map<String, Object> responseBody = searchNotionDatabases(notionAccessToken, nextCursor);
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
                log.warn("Notion DB 목록 페이지네이션 요청 상한 도달. userId={}, collected={}", userId, allResults.size());
                break;
            }
        }

        Map<String, Object> aggregated = new LinkedHashMap<>();
        aggregated.put("object", "list");
        aggregated.put("results", allResults);
        aggregated.put("has_more", false);
        aggregated.put("next_cursor", null);
        aggregated.put("total_results", allResults.size());
        return aggregated;
    }

    public Map<String, Object> getDatabasePages(CustomUserDetails user, String databaseId, String dateProperty) {
        String userId = requireAuthenticatedUserId(user);
        String notionAccessToken = getDecryptedAccessToken(userId);

        if (!StringUtils.hasText(databaseId)) {
            throw new IllegalArgumentException("databaseId가 필요합니다.");
        }

        saveDatabaseId(userId, databaseId);

        String nextCursor = null;
        List<Object> allResults = new ArrayList<>();
        int requestCount = 0;

        while (true) {
            Map<String, Object> responseBody = queryNotionDatabase(notionAccessToken, databaseId, dateProperty, nextCursor);
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
                log.warn("Notion DB 페이지네이션 요청 상한 도달. userId={}, databaseId={}, collected={}",
                        userId, databaseId, allResults.size());
                break;
            }
        }

        Map<String, Object> aggregated = new LinkedHashMap<>();
        aggregated.put("object", "list");
        aggregated.put("results", allResults);
        aggregated.put("has_more", false);
        aggregated.put("next_cursor", null);
        aggregated.put("total_results", allResults.size());
        aggregated.put("database_id", databaseId);
        if (StringUtils.hasText(dateProperty)) {
            aggregated.put("date_property", dateProperty);
        }
        return aggregated;
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
                throw new IllegalStateException("Notion 페이지 조회 응답이 비어있습니다.");
            }
            return responseBody;
        } catch (HttpStatusCodeException e) {
            log.warn("Notion 페이지 조회 실패 status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalArgumentException("Notion 페이지 조회 실패: " + e.getResponseBodyAsString());
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
                throw new IllegalStateException("Notion DB 목록 조회 응답이 비어있습니다.");
            }
            return responseBody;
        } catch (HttpStatusCodeException e) {
            log.warn("Notion DB 목록 조회 실패 status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new IllegalArgumentException("Notion DB 목록 조회 실패: " + e.getResponseBodyAsString());
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
                throw new IllegalStateException("Notion DB 조회 응답이 비어있습니다.");
            }
            return responseBody;
        } catch (HttpStatusCodeException e) {
            log.warn("Notion DB 조회 실패 status={}, databaseId={}, body={}",
                    e.getStatusCode(), databaseId, e.getResponseBodyAsString());
            throw new IllegalArgumentException("Notion DB 조회 실패: " + e.getResponseBodyAsString());
        }
    }

    private String requireAuthenticatedUserId(CustomUserDetails user) {
        if (user == null || !StringUtils.hasText(user.getId())) {
            throw new IllegalArgumentException("인증된 사용자 정보가 필요합니다.");
        }
        return user.getId();
    }

    private void saveNotionConnection(String userId, NotionTokenApiResponse body) {
        try {
            String encryptedAccessToken = cipher.encrypt(body.accessToken());
            NotionConnection connection = notionConnectionRepository.findById(userId)
                    .orElse(NotionConnection.builder().userId(userId).build());

            connection.updateConnection(encryptedAccessToken, body.workspaceName(), body.workspaceId());
            notionConnectionRepository.save(connection);
        } catch (Exception e) {
            log.error("Notion access token 암호화 저장 실패. userId={}", userId, e);
            throw new IllegalStateException("Notion 토큰 저장에 실패했습니다.");
        }
    }

    private String getDecryptedAccessToken(String userId) {
        NotionConnection connection = getNotionConnection(userId);

        if (!StringUtils.hasText(connection.getEncryptedAccessToken())) {
            throw new IllegalStateException("저장된 Notion access token이 없습니다.");
        }

        try {
            return cipher.decrypt(connection.getEncryptedAccessToken());
        } catch (Exception e) {
            log.error("Notion access token 복호화 실패. userId={}", userId, e);
            throw new IllegalStateException("Notion 토큰 복호화에 실패했습니다.");
        }
    }

    private NotionConnection getNotionConnection(String userId) {
        return notionConnectionRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Notion 연결 정보가 없습니다. 먼저 OAuth 연동을 진행해주세요."));
    }

    private void saveDatabaseId(String userId, String databaseId) {
        NotionConnection connection = getNotionConnection(userId);
        connection.updateDatabaseId(databaseId);
        notionConnectionRepository.save(connection);
    }
}
