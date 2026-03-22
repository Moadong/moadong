package moadong.integration.notion.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.util.AESCipher;
import moadong.integration.notion.entity.NotionConnection;
import moadong.integration.notion.payload.dto.NotionTokenApiResponse;
import moadong.integration.notion.payload.request.NotionTokenExchangeRequest;
import moadong.integration.notion.payload.response.NotionTokenExchangeResponse;
import moadong.integration.notion.repository.NotionConnectionRepository;
import moadong.user.payload.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${NOTION_CLIENT_SECRET:}")
    private String notionClientSecret;

    @Value("${NOTION_CLIENT_ID:}")
    private String notionClientId;

    @Value("${NOTION_VERSION:2022-06-28}")
    private String notionVersion;

    @Value("${NOTION_REDIRECT_URI:}")
    private String notionRedirectUri;

    private static final String NOTION_TOKEN_ENDPOINT = "https://api.notion.com/v1/oauth/token";
    private static final String NOTION_SEARCH_ENDPOINT = "https://api.notion.com/v1/search";
    private static final String NOTION_AUTHORIZE_ENDPOINT = "https://api.notion.com/v1/oauth/authorize";

    public Map<String, String> getAuthorizeUrl(String state) {
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
        String notionAccessToken = getDecryptedAccessToken(userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(notionAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Notion-Version", notionVersion);

        Map<String, Object> body = Map.of(
                "filter", Map.of("property", "object", "value", "page"),
                "sort", Map.of("direction", "descending", "timestamp", "last_edited_time"),
                "page_size", 10
        );

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
        NotionConnection connection = notionConnectionRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Notion 연결 정보가 없습니다. 먼저 OAuth 연동을 진행해주세요."));

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
}
