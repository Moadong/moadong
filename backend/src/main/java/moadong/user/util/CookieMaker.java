package moadong.user.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieMaker {
    @Value("${jwt.refresh.token.expiration.hour}")
    private int refreshTokenExpirationHour;

    public ResponseCookie makeRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge((long) refreshTokenExpirationHour * 60 * 60)
                .secure(true)
                .domain(".moadong.com")
                .sameSite("None")
                .build();
    }
}
