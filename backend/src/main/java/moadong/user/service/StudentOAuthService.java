package moadong.user.service;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import moadong.user.config.KakaoLoginProperties;
import moadong.user.entity.RefreshToken;
import moadong.user.entity.StudentUser;
import moadong.user.entity.enums.SocialProvider;
import moadong.user.payload.response.StudentLoginResponse;
import moadong.user.repository.StudentUserRepository;
import moadong.user.util.CookieMaker;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentOAuthService {

    private final RestTemplate restTemplate;
    private final StudentUserRepository studentUserRepository;
    private final JwtProvider jwtProvider;
    private final CookieMaker cookieMaker;
    private final KakaoLoginProperties kakaoLoginProperties;

    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";

    public StudentLoginResponse loginWithKakao(String code, String redirectUri, HttpServletResponse response) {
        String kakaoAccessToken = exchangeKakaoToken(code, redirectUri);
        Map<String, Object> userInfo = fetchKakaoUserInfo(kakaoAccessToken);

        String socialId = String.valueOf(userInfo.get("id"));
        Map<String, Object> props = asMap(userInfo.get("properties"));
        String nickname = asString(props != null ? props.get("nickname") : null);
        String profileImage = asString(props != null ? props.get("profile_image") : null);

        boolean[] isNew = {false};
        StudentUser student = studentUserRepository
                .findByProviderAndSocialId(SocialProvider.KAKAO, socialId)
                .orElseGet(() -> {
                    isNew[0] = true;
                    return buildStudentUser(SocialProvider.KAKAO, socialId, nickname, profileImage);
                });

        return issueTokens(student, isNew[0], response);
    }

    private String exchangeKakaoToken(String code, String redirectUri) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", kakaoLoginProperties.clientId());
        body.add("client_secret", kakaoLoginProperties.clientSecret());
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        try {
            ResponseEntity<Map<String, Object>> res = restTemplate.exchange(
                    KAKAO_TOKEN_URL, HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    new ParameterizedTypeReference<>() {});
            String accessToken = asString(res.getBody() != null ? res.getBody().get("access_token") : null);
            if (!StringUtils.hasText(accessToken)) {
                throw new RestApiException(ErrorCode.SOCIAL_OAUTH_TOKEN_FAILED);
            }
            return accessToken;
        } catch (HttpStatusCodeException e) {
            log.warn("카카오 토큰 교환 실패. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.SOCIAL_OAUTH_TOKEN_FAILED);
        }
    }

    private Map<String, Object> fetchKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        try {
            ResponseEntity<Map<String, Object>> res = restTemplate.exchange(
                    KAKAO_USERINFO_URL, HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new ParameterizedTypeReference<>() {});
            if (res.getBody() == null) {
                throw new RestApiException(ErrorCode.SOCIAL_OAUTH_FAILED);
            }
            return res.getBody();
        } catch (HttpStatusCodeException e) {
            log.warn("카카오 사용자 정보 조회 실패. status={}", e.getStatusCode());
            throw new RestApiException(ErrorCode.SOCIAL_OAUTH_FAILED);
        }
    }

    private StudentUser buildStudentUser(SocialProvider provider, String socialId, String nickname, String profileImageUrl) {
        return StudentUser.builder()
                .studentId(UUID.randomUUID().toString())
                .provider(provider)
                .socialId(socialId)
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .build();
    }

    private StudentLoginResponse issueTokens(StudentUser student, boolean isNewUser, HttpServletResponse response) {
        String accessToken = jwtProvider.generateAccessToken(student.getStudentId());
        RefreshToken refreshToken = jwtProvider.generateRefreshToken(student.getStudentId());

        student.addRefreshToken(refreshToken);
        studentUserRepository.save(student);

        ResponseCookie cookie = cookieMaker.makeRefreshTokenCookie(refreshToken.getToken());
        response.addHeader("Set-Cookie", cookie.toString());

        return new StudentLoginResponse(accessToken, isNewUser);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?>) {
            return (Map<String, Object>) value;
        }
        return null;
    }

    private String asString(Object value) {
        if (value instanceof String s && StringUtils.hasText(s)) {
            return s;
        }
        return null;
    }
}
