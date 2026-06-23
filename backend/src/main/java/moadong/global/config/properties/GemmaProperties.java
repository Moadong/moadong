package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "gemma")
public record GemmaProperties(Server server) {
    public record Server(String host, int port) {}
}
