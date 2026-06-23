package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "dev.portal")
public record DevPortalProperties(
    String kakaoJavascriptKey
) {
}
