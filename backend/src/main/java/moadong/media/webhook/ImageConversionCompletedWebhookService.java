package moadong.media.webhook;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.media.webhook.dto.ImageConversionCompletedRequest;
import moadong.media.webhook.dto.ImageEntry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageConversionCompletedWebhookService {

    private final ClubRepository clubRepository;

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
     * DB에 저장된 동아리 이미지 URL 중 fullUrlOld를 fullUrlNew로 일괄 치환합니다.
     * (WebP 마이그레이션·웹훅 배치 등에서 공통 사용)
     */
    public void updateClubsForImageReplacement(String fullUrlOld, String fullUrlNew) {
        List<Club> clubs = clubRepository
                .findByClubRecruitmentInformation_LogoOrClubRecruitmentInformation_CoverOrClubRecruitmentInformation_FeedImagesContaining(
                        fullUrlOld, fullUrlOld, fullUrlOld);
        for (Club club : clubs) {
            updateClubImageUrls(club, fullUrlOld, fullUrlNew);
            clubRepository.save(club);
        }
    }

    public void processImageConversionCompleted(ImageConversionCompletedRequest request) {
        if (request.images() == null || request.images().isEmpty()) {
            return;
        }
        for (ImageEntry image : request.images()) {
            try {
                String source = normalizeKey(image.source());
                String destination = normalizeKey(image.destination());
                if (source == null || destination == null) {
                    log.debug("Skipping image with invalid key: source={}, destination={}", image.source(), image.destination());
                    continue;
                }
                String fullUrlOld = normalizedViewEndpoint + "/" + source;
                String fullUrlNew = normalizedViewEndpoint + "/" + destination;
                updateClubsForImageReplacement(fullUrlOld, fullUrlNew);
            } catch (Exception e) {
                log.warn("Failed to update club image URLs for source={}, destination={}",
                        image.source(), image.destination(), e);
            }
        }
    }

    private void updateClubImageUrls(Club club, String fullUrlOld, String fullUrlNew) {
        ClubRecruitmentInformation info = club.getClubRecruitmentInformation();
        if (info == null) {
            return;
        }
        if (fullUrlOld.equals(info.getLogo())) {
            club.updateLogo(fullUrlNew);
        }
        if (fullUrlOld.equals(info.getCover())) {
            club.updateCover(fullUrlNew);
        }
        List<String> feedImages = info.getFeedImages();
        if (feedImages != null && feedImages.contains(fullUrlOld)) {
            List<String> updated = new ArrayList<>(feedImages);
            for (int i = 0; i < updated.size(); i++) {
                if (fullUrlOld.equals(updated.get(i))) {
                    updated.set(i, fullUrlNew);
                }
            }
            club.updateFeedImages(updated);
        }
    }

    /**
     * R2 key 정규화: trim, 선행/후행 슬래시 제거, ".." 포함 시 null 반환(path traversal 방지).
     */
    private String normalizeKey(String key) {
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
        while (k.endsWith("/")) {
            k = k.substring(0, k.length() - 1);
        }
        return k.isEmpty() ? null : k;
    }
}
