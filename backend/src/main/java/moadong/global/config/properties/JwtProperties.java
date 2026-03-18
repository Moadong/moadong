package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
    String secretKey,
    AccessToken accessToken,
    RefreshToken refreshToken
) {
    public record AccessToken(Expiration expiration) {}
    public record RefreshToken(Expiration expiration) {}
    public record Expiration(long min, long hour) {}
}
