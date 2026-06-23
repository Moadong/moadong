package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cloud.aws")
public record AwsProperties(
    Credentials credentials,
    S3 s3
) {
    public record Credentials(String accessKey, String secretKey) {}
    public record S3(String bucket, String endpoint, String viewEndpoint) {}
}
