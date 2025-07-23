package moadong.user.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieMaker {
    @Value("${jwt.refresh.token.expiration.hour}")
    private int refreshTokenExpirationHour;

    @Value("${server.domain}")
    private String serverDomain;

    public ResponseCookie makeRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge((long) refreshTokenExpirationHour * 60 * 60)
                //safari에선 localhost에 쿠키를 저장하기위해선 secure를 꺼줘야 저장이된다
                .secure(!serverDomain.contains("localhost"))
                .domain(".moadong.com")
                .sameSite("None")
                .build();
    }
}
