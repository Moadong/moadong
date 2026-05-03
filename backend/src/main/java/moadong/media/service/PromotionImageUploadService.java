package moadong.media.service;

import lombok.RequiredArgsConstructor;
import moadong.club.repository.PromotionArticleRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.config.properties.AwsProperties;
import moadong.media.dto.PromotionImageUploadResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PromotionImageUploadService {

    private final PromotionArticleRepository promotionArticleRepository;
    private final R2ImageUploadService r2ImageUploadService;
    private final AwsProperties awsProperties;

    public PromotionImageUploadResponse upload(String articleId, MultipartFile file) {
        ensurePromotionArticleExists(articleId);
        String key = buildPromotionImageKey(articleId, file);
        String imageUrl = r2ImageUploadService.upload(
            file,
            awsProperties.s3().bucket(),
            awsProperties.s3().viewEndpoint(),
            key
        );
        return new PromotionImageUploadResponse(imageUrl);
    }

    private void ensurePromotionArticleExists(String articleId) {
        if (!promotionArticleRepository.existsActiveById(articleId)) {
            throw new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND);
        }
    }

    private String buildPromotionImageKey(String articleId, MultipartFile file) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String originalFilename = (file != null) ? file.getOriginalFilename() : null;
        String filename = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        String sanitizedFilename = sanitizeFilename(StringUtils.getFilename(filename));
        String sanitizedArticleId = sanitizePathSegment(articleId, "article");
        return "promotion/articles/" + sanitizedArticleId
            + "/" + today.getYear()
            + "/" + String.format("%02d", today.getMonthValue())
            + "/" + UUID.randomUUID() + "-" + sanitizedFilename;
    }

    private String sanitizePathSegment(String value, String fallback) {
        String safeValue = StringUtils.hasText(value) ? value.trim() : fallback;
        return safeValue.replaceAll("[^A-Za-z0-9_-]", "_");
    }

    private String sanitizeFilename(String filename) {
        String safeName = StringUtils.hasText(filename) ? filename : "image";
        return safeName.replaceAll("[^A-Za-z0-9._-]", "_");
    }
}
