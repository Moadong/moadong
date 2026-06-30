package moadong.media.util;

import java.net.URI;
import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.AwsProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
@RequiredArgsConstructor
public class S3Config {

    private final AwsProperties awsProperties;

    @Bean
    public S3Client s3Client() {
        validateCredentials();
        return S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(
                        awsProperties.credentials().accessKey(), 
                        awsProperties.credentials().secretKey()
                    )
                ))
                .endpointOverride(URI.create(awsProperties.s3().endpoint()))
                .region(Region.US_EAST_1)
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true) // Cloudflare R2에서 필수
                        .build())
                .build();
    }

    @Bean(destroyMethod = "close")
    public S3Presigner s3Presigner() {
        validateCredentials();
        return S3Presigner.builder()
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(
                            awsProperties.credentials().accessKey(), 
                            awsProperties.credentials().secretKey()
                        )
                ))
                .endpointOverride(URI.create(awsProperties.s3().endpoint()))
                .region(Region.US_EAST_1)
                .build();
    }
    
    private void validateCredentials() {
        if (awsProperties.credentials().accessKey() == null || awsProperties.credentials().accessKey().isEmpty() || 
            awsProperties.credentials().secretKey() == null || awsProperties.credentials().secretKey().isEmpty()) {
            throw new IllegalStateException("AWS credentials (accessKey, secretKey) must be configured");
        }
        if (awsProperties.s3().endpoint() == null || awsProperties.s3().endpoint().isEmpty()) {
            throw new IllegalStateException("AWS S3 endpoint must be configured");
        }
    }

}
