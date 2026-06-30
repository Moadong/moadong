package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.core.io.Resource;

@ConfigurationProperties(prefix = "firebase.config")
public record FirebaseProperties(
    @DefaultValue("classpath:firebase.json") Resource path
) {}
