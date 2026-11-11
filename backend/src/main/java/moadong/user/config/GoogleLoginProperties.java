package moadong.user.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.login")
public record GoogleLoginProperties(
        String clientId,
        String clientSecret
) {
}
