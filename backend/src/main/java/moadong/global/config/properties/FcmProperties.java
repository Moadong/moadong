package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "fcm.topic")
public record FcmProperties(
    @DefaultValue("5") int timeoutSeconds
) {}
