package moadong.user.util;

import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.JwtProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieMaker {

    private final JwtProperties jwtProperties;

    public ResponseCookie makeRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge(jwtProperties.refreshToken().expiration().hour() * 60 * 60)
                .secure(true)
                .domain(".moadong.com")
                .sameSite("None")
                .build();
    }
}
