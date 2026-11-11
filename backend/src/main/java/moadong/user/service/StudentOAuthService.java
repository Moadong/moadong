package moadong.user.service;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import moadong.user.config.GoogleLoginProperties;
import moadong.user.config.KakaoLoginProperties;
import moadong.user.entity.RefreshToken;
import moadong.user.entity.StudentUser;
import moadong.user.entity.enums.SocialProvider;
import moadong.user.payload.response.RefreshResponse;
import moadong.user.payload.response.StudentLoginResponse;
import moadong.user.repository.StudentUserRepository;
import moadong.user.util.CookieMaker;
import moadong.user.util.NicknameGenerator;
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
    private final GoogleLoginProperties googleLoginProperties;

    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";
    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    public StudentLoginResponse loginWithKakao(String code, String redirectUri, HttpServletResponse response) {
        String kakaoAccessToken = exchangeKakaoToken(code, redirectUri);
        Map<String, Object> userInfo = fetchKakaoUserInfo(kakaoAccessToken);

        String socialId = String.valueOf(userInfo.get("id"));

        boolean[] isNew = {false};
        StudentUser student = studentUserRepository
                .findByProviderAndSocialId(SocialProvider.KAKAO, socialId)
                .orElseGet(() -> {
                    isNew[0] = true;
                    return buildStudentUser(SocialProvider.KAKAO, socialId);
                });

        return issueTokens(student, isNew[0], response);
    }

    public StudentLoginResponse loginWithGoogle(String code, String redirectUri, HttpServletResponse response) {
        String googleAccessToken = exchangeGoogleToken(code, redirectUri);
        Map<String, Object> userInfo = fetchGoogleUserInfo(googleAccessToken);

        String socialId = asString(userInfo.get("id"));

        boolean[] isNew = {false};
        StudentUser student = studentUserRepository
                .findByProviderAndSocialId(SocialProvider.GOOGLE, socialId)
                .orElseGet(() -> {
                    isNew[0] = true;
                    return buildStudentUser(SocialProvider.GOOGLE, socialId);
                });

        return issueTokens(student, isNew[0], response);
    }

    private String exchangeGoogleToken(String code, String redirectUri) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", googleLoginProperties.clientId());
        body.add("client_secret", googleLoginProperties.clientSecret());
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        try {
            ResponseEntity<Map<String, Object>> res = restTemplate.exchange(
                    GOOGLE_TOKEN_URL, HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    new ParameterizedTypeReference<>() {});
            String accessToken = asString(res.getBody() != null ? res.getBody().get("access_token") : null);
            if (!StringUtils.hasText(accessToken)) {
                throw new RestApiException(ErrorCode.SOCIAL_OAUTH_TOKEN_FAILED);
            }
            return accessToken;
        } catch (HttpStatusCodeException e) {
            log.warn("구글 토큰 교환 실패. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RestApiException(ErrorCode.SOCIAL_OAUTH_TOKEN_FAILED);
        }
    }

    private Map<String, Object> fetchGoogleUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        try {
            ResponseEntity<Map<String, Object>> res = restTemplate.exchange(
                    GOOGLE_USERINFO_URL, HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new ParameterizedTypeReference<>() {});
            if (res.getBody() == null) {
                throw new RestApiException(ErrorCode.SOCIAL_OAUTH_FAILED);
            }
            return res.getBody();
        } catch (HttpStatusCodeException e) {
            log.warn("구글 사용자 정보 조회 실패. status={}", e.getStatusCode());
            throw new RestApiException(ErrorCode.SOCIAL_OAUTH_FAILED);
        }
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

    private StudentUser buildStudentUser(SocialProvider provider, String socialId) {
        return StudentUser.builder()
                .provider(provider)
                .socialId(socialId)
                .nickname(NicknameGenerator.generate())
                .build();
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
        StudentUser student = studentUserRepository.findByRefreshTokens_Token(refreshToken)
                .orElseThrow(() -> new RestApiException(ErrorCode.STUDENT_USER_NOT_FOUND));
        student.removeRefreshToken(refreshToken);
        studentUserRepository.save(student);
    }

    public RefreshResponse refreshAccessToken(String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        jwtProvider.extractSubjectIfValid(refreshToken);

        StudentUser student = studentUserRepository.findByRefreshTokens_Token(refreshToken)
                .orElseThrow(() -> new RestApiException(ErrorCode.TOKEN_INVALID));

        String newAccessToken = jwtProvider.generateAccessToken(student.getId());
        RefreshToken newRefreshToken = jwtProvider.generateRefreshToken(student.getId());

        student.replaceRefreshToken(refreshToken, newRefreshToken);
        studentUserRepository.save(student);

        ResponseCookie cookie = cookieMaker.makeRefreshTokenCookie(newRefreshToken.getToken());
        response.addHeader("Set-Cookie", cookie.toString());

        return new RefreshResponse(newAccessToken);
    }

    private StudentLoginResponse issueTokens(StudentUser student, boolean isNewUser, HttpServletResponse response) {
        if (student.getId() == null) {
            student = studentUserRepository.save(student);
        }

        String accessToken = jwtProvider.generateAccessToken(student.getId());
        RefreshToken refreshToken = jwtProvider.generateRefreshToken(student.getId());

        student.addRefreshToken(refreshToken);
        studentUserRepository.save(student);

        ResponseCookie cookie = cookieMaker.makeRefreshTokenCookie(refreshToken.getToken());
        response.addHeader("Set-Cookie", cookie.toString());

        return new StudentLoginResponse(accessToken, isNewUser);
    }

    private String asString(Object value) {
        if (value instanceof String s && StringUtils.hasText(s)) {
            return s;
        }
        return null;
    }
}
