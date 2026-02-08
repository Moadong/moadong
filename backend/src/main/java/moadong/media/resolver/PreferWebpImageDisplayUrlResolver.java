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
        if (key.toLowerCase().endsWith(".webp")) {
            return storedUrl;
        }
        String webpKey = toWebpKey(key);
        try {
            String foundKey = headWebpOrAlternate(webpKey);
            if (foundKey != null) {
                return normalizedViewEndpoint + "/" + foundKey;
            }
            return storedUrl;
        } catch (S3Exception e) {
            log.warn("S3 HEAD failed for webp key={}, bucket={}, falling back to stored URL: {}",
                    webpKey, bucketName, e.getMessage());
            return storedUrl;
        } catch (Exception e) {
            log.warn("Unexpected error checking webp existence key={}, bucket={}, falling back to stored URL",
                    webpKey, bucketName, e);
            return storedUrl;
        }
    }

    /**
     * webpKey로 HEAD 시도. 없으면 R2 대문자 경로(feed→FEED 등)로 한 번 더 시도.
     * 존재하는 key를 반환하고, 둘 다 없으면 null.
     */
    private String headWebpOrAlternate(String webpKey) {
        try {
            s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(webpKey)
                    .build());
            return webpKey;
        } catch (NoSuchKeyException e) {
            String alternateKey = toAlternatePathKey(webpKey);
            if (alternateKey.equals(webpKey)) {
                log.debug("[WebpResolver] S3에 webp 없음. webpKey={}", webpKey);
                return null;
            }
            try {
                s3Client.headObject(HeadObjectRequest.builder()
                        .bucket(bucketName)
                        .key(alternateKey)
                        .build());
                return alternateKey;
            } catch (NoSuchKeyException e2) {
                log.debug("[WebpResolver] S3에 webp 없음(대문자 경로도 시도). webpKey={}, alternateKey={}", webpKey, alternateKey);
                return null;
            }
        }
    }

    /** 경로 세그먼트 feed/logo/cover 를 대문자 FEED/LOGO/COVER 로 바꾼 key 반환. */
    private static String toAlternatePathKey(String key) {
        if (key == null || key.isEmpty()) return key;
        String k = key;
        if (k.contains("/feed/")) return k.replace("/feed/", "/FEED/");
        if (k.contains("/logo/")) return k.replace("/logo/", "/LOGO/");
        if (k.contains("/cover/")) return k.replace("/cover/", "/COVER/");
        return k;
    }

    /**
     * viewEndpoint 접두를 검증하고 S3 key를 추출한다.
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
