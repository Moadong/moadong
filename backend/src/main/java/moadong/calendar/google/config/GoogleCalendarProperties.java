package moadong.calendar.google.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.calendar")
public record GoogleCalendarProperties(
        String clientId,
        String clientSecret,
        String redirectUri
) {
}
