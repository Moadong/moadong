package moadong.global.config.properties;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    String devRegistrationSecret,
    Encryption encryption,
    Cors cors
) {
    public record Encryption(String key, String iv) {}
    public record Cors(List<String> allowedOrigins) {}
}
