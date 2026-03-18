package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "server")
public record ServerProperties(
    String domain,
    Feed feed,
    Image image,
    FileUrl fileUrl
) {
    public record Feed(int maxCount) {}
    public record Image(DataSize maxSize) {}
    public record FileUrl(
        @DefaultValue("200") int maxLength,
        @DefaultValue("10") int expirationTime
    ) {}
}
