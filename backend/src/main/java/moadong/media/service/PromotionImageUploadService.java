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
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
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
        // 위 사전 검사와 저장 사이에 다른 업로드가 끼어들 수 있어, 상한은 Mongo 조건부 갱신으로 한 번 더 막는다.
        if (promotionArticleRepository.addImageToActiveArticle(articleId, imageUrl) == 0) {
            deleteQuietly(key);
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
        return new PromotionImageUploadResponse(imageUrl);
    }

    /**
     * 동아리 활동사진({@code generateFeedUploadUrls})·우체통 첨부와 같은 부분 성공 응답을 돌려준다.
     * 한 건이 실패해도 나머지는 발급되고, 실패 항목은 success=false로 표시된다.
     * 이미 담긴 이미지를 뺀 잔여분까지만 발급하고, 초과분에는 TOO_MANY_FILES를 채운다.
     * 발급에 실패한 요청은 잔여분을 쓰지 않으므로, 응답 길이 == requests.size()가 유지되고 순서도 요청과 1:1로 맞는다.
     * URL 발급만 하고 게시글은 건드리지 않는다. 이미지 반영은 게시글 수정 API의 images가 전담한다.
     */
    public List<PresignedUploadResponse> createUploadUrls(String articleId, List<UploadUrlRequest> requests,
                                                          CustomUserDetails user) {
        PromotionArticle article = getAuthorizedArticle(articleId, user);
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        int remaining = PromotionArticle.MAX_IMAGE_COUNT - imageCountOf(article);
        int issued = 0;
        List<PresignedUploadResponse> results = new ArrayList<>(requests.size());
        for (UploadUrlRequest request : requests) {
            if (issued >= remaining) {
                results.add(errorResponse(ErrorCode.TOO_MANY_FILES));
                continue;
            }
            try {
                results.add(createUploadUrl(articleId, request));
                issued++;
            } catch (RestApiException e) {
                results.add(errorResponse(e.getErrorCode()));
            }
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
     * 게시글에 저장하려는 이미지 URL을 전량 검증한다. 활동사진({@code validateFileConstraints})·
     * 우체통({@code FeedbackImageService#validateImages})과 같은 "클라이언트가 준 URL은 믿지 않는다" 경계다.
     * 이 게시글 경로에 실제로 올라온 객체만 통과시킨다.
     *
     * <p>접두사는 키를 만들 때({@code buildPromotionImageKey})와 같은 {@code sanitizePathSegment}로
     * 구성한다. 둘이 어긋나면 정상 업로드가 막힌다.
     *
     * <p>이미 저장돼 있던 URL({@code previousImages})은 건너뛴다. 홍보는 검증이 없던 기간에
     * 상한을 넘는 이미지가 저장됐을 수 있는데, 그걸 다시 검사하면 제목만 고치는 수정에서도
     * 살아 있는 객체를 지우고 실패한다. R2에서 외부 요인으로 사라진 객체가 있으면 그 게시글이
     * 영영 수정 불가가 되기도 한다. 검증이 필요한 것은 이번에 새로 주장하는 URL뿐이다.
     */
    public void validateImages(String articleId, List<String> images, List<String> previousImages) {
        if (images == null || images.isEmpty()) {
            return;
        }
        List<String> retained = (previousImages == null) ? List.of() : previousImages;
        String keyPrefix = "promotion/articles/" + sanitizePathSegment(articleId, "article") + "/";
        for (String imageUrl : images) {
            if (retained.contains(imageUrl)) {
                continue;
            }
            validateImage(keyPrefix, imageUrl);
        }
    }

    private void validateImage(String keyPrefix, String imageUrl) {
        if (imageUrl == null || imageUrl.length() > serverProperties.fileUrl().maxLength()) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }
        String key = extractKeyOrNull(imageUrl);
        if (key == null || !key.startsWith(keyPrefix)) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }

        long contentLength;
        try {
            contentLength = s3Client.headObject(HeadObjectRequest.builder()
                .bucket(awsProperties.s3().bucket())
                .key(key)
                .build()).contentLength();
        } catch (NoSuchKeyException e) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        } catch (S3Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }

        if (contentLength > serverProperties.image().maxSize().toBytes()) {
            deleteQuietly(key);
            throw new RestApiException(ErrorCode.FILE_TOO_LARGE);
        }
    }

    /**
     * 게시글에서 빠진 이미지를 R2에서 지운다. 활동사진({@code deleteFeedImages})과 같은
     * "저장 검증을 통과한 뒤 누락분만 삭제" 경계다.
     *
     * <p>이제는 {@code validateImages}가 저장 시점에 접두사를 막지만, 검증이 없던 시절에
     * 저장된 행이 previousImages로 들어올 수 있다. 그래서 이 게시글의 키 접두사에
     * 속한 객체만 지우는 가드를 그대로 둔다.
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
