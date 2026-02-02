package moadong.media.resolver;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Primary
@Component
@RequiredArgsConstructor
public class PreferWebpImageDisplayUrlResolver implements ImageDisplayUrlResolver {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.s3.view-endpoint}")
    private String viewEndpoint;

    private String normalizedViewEndpoint;

    @PostConstruct
    private void init() {
        if (viewEndpoint == null || viewEndpoint.isEmpty()) {
            throw new IllegalStateException("cloud.aws.s3.view-endpoint must be configured");
        }
        normalizedViewEndpoint = viewEndpoint.replaceAll("/+$", "");
    }

    @Override
    public String resolveDisplayUrl(String storedUrl) {
        if (storedUrl == null || storedUrl.isBlank()) {
            return storedUrl;
        }
        String key = extractKeyOrNull(storedUrl);
        if (key == null) {
            return storedUrl;
        }
        String webpKey = toWebpKey(key);
        try {
            HeadObjectRequest headReq = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(webpKey)
                    .build();
            s3Client.headObject(headReq);
            return normalizedViewEndpoint + "/" + webpKey;
        } catch (NoSuchKeyException e) {
            return storedUrl;
        } catch (S3Exception e) {
            log.warn("S3 HEAD failed for webp key={}, falling back to stored URL: {}", webpKey, e.getMessage());
            return storedUrl;
        } catch (Exception e) {
            log.warn("Unexpected error checking webp existence key={}, falling back to stored URL", webpKey, e);
            return storedUrl;
        }
    }

    /**
     * viewEndpoint 접두를 검증하고 S3 key를 추출한다.
     * CloudflareImageService와 동일 규칙.
     */
    private String extractKeyOrNull(String fileUrl) {
        String prefix = normalizedViewEndpoint + "/";
        if (!fileUrl.startsWith(prefix)) {
            return null;
        }
        return fileUrl.substring(prefix.length());
    }

    /**
     * key에서 webp key 유도: 확장자 있으면 .webp로 치환, 없으면 끝에 .webp 추가.
     */
    private static String toWebpKey(String key) {
        if (key == null || key.isEmpty()) {
            return key;
        }
        int lastDot = key.lastIndexOf('.');
        if (lastDot > 0) {
            return key.substring(0, lastDot) + ".webp";
        }
        return key + ".webp";
    }
}
