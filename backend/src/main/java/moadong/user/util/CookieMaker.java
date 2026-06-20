package moadong.user.util;

import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.JwtProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieMaker {

    public static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
    private static final String REFRESH_TOKEN_COOKIE_DOMAIN = ".moadong.com";

    private final JwtProperties jwtProperties;

    public ResponseCookie makeRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge(jwtProperties.refreshToken().expiration().hour() * 60 * 60)
                .secure(true)
                .domain(REFRESH_TOKEN_COOKIE_DOMAIN)
                .sameSite("None")
                .build();
    }

    public ResponseCookie makeExpiredRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .secure(true)
                .domain(REFRESH_TOKEN_COOKIE_DOMAIN)
                .sameSite("None")
                .build();
    }
}
