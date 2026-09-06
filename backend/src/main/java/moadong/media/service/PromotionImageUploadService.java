package moadong.media.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.PromotionArticle;
import moadong.club.repository.PromotionArticleRepository;
import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.PromotionImageUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

import static moadong.media.util.ClubImageUtil.isImageExtension;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromotionImageUploadService {

    /**
     * {@code UploadUrlRequest}의 @Pattern은 {@code @Valid List<T>}에서 요소까지 내려가지 않아 동작하지 않는다.
     * 서명에 들어가는 값이라 서버에서 직접 막는다. (우체통 {@code FeedbackImageService}와 동일)
     */
    private static final Pattern ALLOWED_CONTENT_TYPE = Pattern.compile("^image/(jpeg|jpg|png|gif|bmp|webp)$");

    private final PromotionArticleRepository promotionArticleRepository;
    private final R2ImageUploadService r2ImageUploadService;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final AwsProperties awsProperties;
    private final ServerProperties serverProperties;

    private String normalizedViewEndpoint;

    @PostConstruct
    private void init() {
        String viewEndpoint = awsProperties.s3().viewEndpoint();
        if (viewEndpoint == null || viewEndpoint.isEmpty()) {
            throw new IllegalStateException("cloud.aws.s3.view-endpoint must be configured");
        }
        normalizedViewEndpoint = viewEndpoint.replaceAll("/+$", "");
    }

    public PromotionImageUploadResponse upload(String articleId, MultipartFile file, CustomUserDetails user) {
        PromotionArticle article = getAuthorizedArticle(articleId, user);
        if (imageCountOf(article) >= PromotionArticle.MAX_IMAGE_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
        String key = buildPromotionImageKey(articleId, (file != null) ? file.getOriginalFilename() : null);
        String imageUrl = r2ImageUploadService.upload(
            file,
            awsProperties.s3().bucket(),
            awsProperties.s3().viewEndpoint(),
            key
        );
        promotionArticleRepository.addImageToActiveArticle(articleId, imageUrl);
        return new PromotionImageUploadResponse(imageUrl);
    }

    /**
     * 동아리 활동사진({@code generateFeedUploadUrls})·우체통 첨부와 같은 부분 성공 응답을 돌려준다.
     * 한 건이 실패해도 나머지는 발급되고, 실패 항목은 success=false로 표시된다.
     * 이미 담긴 이미지를 뺀 잔여분까지만 발급하고, 초과분에는 TOO_MANY_FILES를 덧붙인다.
     * URL 발급만 하고 게시글은 건드리지 않는다. 이미지 반영은 게시글 수정 API의 images가 전담한다.
     */
    public List<PresignedUploadResponse> createUploadUrls(String articleId, List<UploadUrlRequest> requests,
                                                          CustomUserDetails user) {
        PromotionArticle article = getAuthorizedArticle(articleId, user);
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        int remaining = PromotionArticle.MAX_IMAGE_COUNT - imageCountOf(article);
        if (remaining <= 0) {
            return List.of(errorResponse(ErrorCode.TOO_MANY_FILES));
        }

        int limit = Math.min(remaining, requests.size());
        List<PresignedUploadResponse> results = new ArrayList<>(limit + 1);
        for (int i = 0; i < limit; i++) {
            try {
                results.add(createUploadUrl(articleId, requests.get(i)));
            } catch (RestApiException e) {
                results.add(errorResponse(e.getErrorCode()));
            }
        }
        if (requests.size() > limit) {
            results.add(errorResponse(ErrorCode.TOO_MANY_FILES));
        }
        return results;
    }

    private PresignedUploadResponse createUploadUrl(String articleId, UploadUrlRequest request) {
        if (!isImageExtension(request.fileName())) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (request.contentType() == null || !ALLOWED_CONTENT_TYPE.matcher(request.contentType()).matches()) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        String key = buildPromotionImageKey(articleId, request.fileName());
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(awsProperties.s3().bucket())
            .key(key)
            .contentType(request.contentType())
            .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(serverProperties.fileUrl().expirationTime()))
            .putObjectRequest(putObjectRequest)
            .build();

        return new PresignedUploadResponse(
            s3Presigner.presignPutObject(presignRequest).url().toString(),
            normalizedViewEndpoint + "/" + key,
            Map.of("Content-Type", request.contentType()),
            true,
            null
        );
    }

    /**
     * 게시글에서 빠진 이미지를 R2에서 지운다. 활동사진({@code deleteFeedImages})과 같은
     * "저장 검증을 통과한 뒤 누락분만 삭제" 경계다.
     *
     * <p>수정 요청의 images는 URL 형식을 검증하지 않으므로, 남의 동아리 이미지 URL을
     * 넣었다 빼는 식으로 임의 객체를 지울 수 있다. 그래서 이 게시글의 키 접두사에
     * 속한 객체만 지운다.
     *
     * <p>삭제 실패는 로그만 남긴다. 버킷 정리 때문에 게시글 수정이 막혀서는 안 된다.
     */
    public void deleteRemovedImages(String articleId, List<String> previousImages, List<String> newImages) {
        if (previousImages == null || previousImages.isEmpty()) {
            return;
        }
        List<String> retained = (newImages == null) ? List.of() : newImages;
        String articleKeyPrefix = "promotion/articles/" + sanitizePathSegment(articleId, "article") + "/";
        for (String imageUrl : previousImages) {
            if (retained.contains(imageUrl)) {
                continue;
            }
            String key = extractKeyOrNull(imageUrl);
            if (key == null || !key.startsWith(articleKeyPrefix)) {
                log.warn("Skip deleting promotion image outside the article prefix: articleId={}, url={}", articleId, imageUrl);
                continue;
            }
            deleteQuietly(key);
        }
    }

    private String extractKeyOrNull(String imageUrl) {
        String prefix = normalizedViewEndpoint + "/";
        return (imageUrl != null && imageUrl.startsWith(prefix)) ? imageUrl.substring(prefix.length()) : null;
    }

    private void deleteQuietly(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(awsProperties.s3().bucket())
                .key(key)
                .build());
        } catch (S3Exception e) {
            log.warn("Failed to delete promotion image from R2: key={}, error={}", key, e.getMessage());
        }
    }

    private PresignedUploadResponse errorResponse(ErrorCode errorCode) {
        return new PresignedUploadResponse(null, null, null, false, errorCode.getMessage());
    }

    private PromotionArticle getAuthorizedArticle(String articleId, CustomUserDetails user) {
        PromotionArticle article = promotionArticleRepository.findActiveById(articleId)
            .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));
        if (!user.isDeveloper() && !user.getClubId().equals(article.getClubId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        return article;
    }

    private int imageCountOf(PromotionArticle article) {
        return (article.getImages() == null) ? 0 : article.getImages().size();
    }

    private String buildPromotionImageKey(String articleId, String originalFilename) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
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
