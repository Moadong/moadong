package moadong.media.webhook;

import jakarta.annotation.PostConstruct;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.media.webhook.dto.WebpMigrationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebpMigrationService {

    private static final String URL_PREFIX_SUFFIX = "/";

    private final ClubRepository clubRepository;
    private final S3Client s3Client;
    private final ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

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

    /**
     * DB에 존재하는 모든 동아리의 이미지 URL을 수집한 뒤,
     * 각 URL에 대해 R2에 .webp 버전이 있으면 해당 URL을 .webp URL로 갱신합니다.
     */
    public WebpMigrationResult migrateAllClubsToWebp() {
        String prefix = normalizedViewEndpoint + URL_PREFIX_SUFFIX;
        Set<String> imageUrls = collectImageUrls(prefix);
        log.info("WebP migration: prefix={}, collectedUrlCount={}", prefix, imageUrls.size());
        int updated = 0;
        int skipped = 0;

        for (String fullUrlOld : imageUrls) {
            try {
                if (fullUrlOld.endsWith(".webp")) {
                    skipped++;
                    continue;
                }
                String key = extractKeyFromUrl(fullUrlOld, prefix);
                if (key == null) {
                    log.info("Skip (key=null, URL이 prefix로 시작하지 않음): url={}", fullUrlOld);
                    skipped++;
                    continue;
                }
                String destKey = toWebpKey(key);
                if (destKey == null) {
                    log.info("Skip (destKey=null): url={}, extractedKey={}", fullUrlOld, key);
                    skipped++;
                    continue;
                }
                if (!headObjectExists(destKey)) {
                    log.debug("WebP object not found in R2, skipping: key={}", destKey);
                    skipped++;
                    continue;
                }
                String fullUrlNew = normalizedViewEndpoint + URL_PREFIX_SUFFIX + destKey;
                imageConversionCompletedWebhookService.updateClubsForImageReplacement(fullUrlOld, fullUrlNew);
                updated++;
            } catch (Exception e) {
                log.debug("Failed to migrate URL: url={}", fullUrlOld, e);
                skipped++;
            }
        }

        return new WebpMigrationResult(updated, skipped);
    }

    private Set<String> collectImageUrls(String prefix) {
        Set<String> urls = new HashSet<>();
        List<Club> clubs = clubRepository.findAll();
        int clubsWithInfo = 0;
        String sampleUrlFromDb = null; // prefix 불일치 원인 확인용
        for (Club club : clubs) {
            ClubRecruitmentInformation info = club.getClubRecruitmentInformation();
            if (info == null) {
                continue;
            }
            clubsWithInfo++;
            if (info.getLogo() != null) {
                if (info.getLogo().startsWith(prefix)) {
                    urls.add(info.getLogo());
                } else if (sampleUrlFromDb == null) {
                    sampleUrlFromDb = info.getLogo();
                }
            }
            if (info.getCover() != null) {
                if (info.getCover().startsWith(prefix)) {
                    urls.add(info.getCover());
                } else if (sampleUrlFromDb == null) {
                    sampleUrlFromDb = info.getCover();
                }
            }
            List<String> feedImages = info.getFeedImages();
            if (feedImages != null) {
                for (String url : feedImages) {
                    if (url != null) {
                        if (url.startsWith(prefix)) {
                            urls.add(url);
                        } else if (sampleUrlFromDb == null) {
                            sampleUrlFromDb = url;
                        }
                    }
                }
            }
        }
        log.info("WebP migration collect: totalClubs={}, clubsWithRecruitmentInfo={}, collectedUrlCount={}, prefix={}",
                clubs.size(), clubsWithInfo, urls.size(), prefix);
        if (urls.isEmpty() && sampleUrlFromDb != null) {
            log.info("WebP migration: 수집된 URL이 0건입니다. DB에 저장된 URL 예시(prefix와 비교용): {}", sampleUrlFromDb);
        }
        return urls;
    }

    /**
     * fullUrl이 normalizedViewEndpoint + "/" 로 시작하면 접두어를 제거한 key 반환, 아니면 null.
     */
    private String extractKeyFromUrl(String fullUrl, String prefix) {
        if (fullUrl == null || !fullUrl.startsWith(prefix)) {
            return null;
        }
        String key = fullUrl.substring(prefix.length());
        return key.isEmpty() ? null : key;
    }

    /**
     * key 정규화 후 확장자를 .webp로 치환. 확장자 없으면 끝에 .webp 붙임.
     * ".." 포함 시 null 반환.
     */
    private String toWebpKey(String key) {
        if (key == null) {
            return null;
        }
        String k = key.trim();
        if (k.isEmpty()) {
            return null;
        }
        if (k.contains("..")) {
            return null;
        }
        while (k.startsWith("/")) {
            k = k.substring(1);
        }
        if (k.isEmpty()) {
            return null;
        }
        int lastDot = k.lastIndexOf('.');
        if (lastDot > 0) {
            k = k.substring(0, lastDot) + ".webp";
        } else {
            k = k + ".webp";
        }
        return k;
    }

    private boolean headObjectExists(String destKey) {
        try {
            HeadObjectRequest request = HeadObjectRequest.builder()
                    .bucket(bucket)
                    .key(destKey)
                    .build();
            log.info("R2 HEAD request: bucket={}, key={}", bucket, destKey);
            s3Client.headObject(request);
            return true;
        } catch (NoSuchKeyException e) {
            log.info("R2 HEAD 404 (no such key): bucket={}, key={}", bucket, destKey);
            return false;
        } catch (S3Exception e) {
            log.info("R2 HEAD failed: bucket={}, key={}, error={}", bucket, destKey, e.getMessage());
            return false;
        }
    }
}
