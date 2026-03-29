package moadong.calendar.notion.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "notion")
public record NotionProperties(
        String clientId,
        String clientSecret,
        String redirectUri,
        String version
) {
    public NotionProperties {
        if (version == null || version.isBlank()) {
            version = "2022-06-28";
        }
    }
}
