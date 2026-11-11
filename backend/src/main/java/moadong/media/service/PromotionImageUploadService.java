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

    /** 홍보 이미지 키의 뿌리. 구 키(promotion/articles/...)도 이 아래에 있다. */
    private static final String PROMOTION_KEY_ROOT = "promotion/";

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
        String key = buildPromotionImageKey(article.getClubId(), (file != null) ? file.getOriginalFilename() : null);
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
     * URL 발급만 하고 게시글은 건드리지 않는다. 이미지 반영은 게시글 저장 API의 images가 전담한다.
     *
     * <p>게시글이 아직 없어도 발급할 수 있도록 키를 동아리 기준으로 잡는다. 그래서 요청 수만
     * 상한으로 막고 저장된 사진 수는 보지 않는다. 활동사진({@code generateFeedUploadUrls})과
     * 같은 이유다 — 발급 시점에는 아직 저장되지 않은 삭제를 알 수 없어 기준으로 쓸 수 없고,
     * 최종 개수 검증은 게시글 저장이 담당한다.
     */
    public List<PresignedUploadResponse> createUploadUrls(String requestedClubId, List<UploadUrlRequest> requests,
                                                          CustomUserDetails user) {
        String clubId = resolveClubId(requestedClubId, user);
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }
        if (requests.size() > PromotionArticle.MAX_IMAGE_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }

        List<PresignedUploadResponse> results = new ArrayList<>(requests.size());
        for (UploadUrlRequest request : requests) {
            try {
                results.add(createUploadUrl(clubId, request));
            } catch (RestApiException e) {
                results.add(errorResponse(e.getErrorCode()));
            }
        }
        return results;
    }

    /**
     * 개발자는 요청의 clubId를 그대로 쓰고, 동아리 관리자는 요청값을 무시하고 본인 동아리로 강제한다.
     * ({@code PromotionArticleService.resolveClubId}와 같은 규칙)
     */
    private String resolveClubId(String requestedClubId, CustomUserDetails user) {
        String clubId = user.isDeveloper() ? requestedClubId : user.getClubId();
        if (!StringUtils.hasText(clubId)) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        return clubId;
    }

    private PresignedUploadResponse createUploadUrl(String clubId, UploadUrlRequest request) {
        if (!isImageExtension(request.fileName())) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (request.contentType() == null || !ALLOWED_CONTENT_TYPE.matcher(request.contentType()).matches()) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        String key = buildPromotionImageKey(clubId, request.fileName());
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
     * 구성한다. 둘이 어긋나면 정상 업로드가 막힌다. 동아리 기준이라 게시글이 아직 없는
     * 생성 요청에도 그대로 걸 수 있다.
     *
     * <p>이미 저장돼 있던 URL({@code previousImages})은 건너뛴다. 홍보는 검증이 없던 기간에
     * 상한을 넘는 이미지가 저장됐을 수 있는데, 그걸 다시 검사하면 제목만 고치는 수정에서도
     * 살아 있는 객체를 지우고 실패한다. R2에서 외부 요인으로 사라진 객체가 있으면 그 게시글이
     * 영영 수정 불가가 되기도 한다. 검증이 필요한 것은 이번에 새로 주장하는 URL뿐이다.
     */
    public void validateImages(String clubId, List<String> images, List<String> previousImages) {
        if (images == null || images.isEmpty()) {
            return;
        }
        List<String> retained = (previousImages == null) ? List.of() : previousImages;
        String keyPrefix = PROMOTION_KEY_ROOT + sanitizePathSegment(clubId, "club") + "/";
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
     * <p>키가 동아리 기준이 되면서 같은 동아리의 다른 게시글 이미지도 접두사가 일치한다.
     * 그래서 접두사는 홍보 경로인지만 보고, 실제 보호는 "다른 활성 게시글이 쓰고 있으면
     * 지우지 않는다"로 한다. 접두사를 게시글 단위로 좁히면 구 키(promotion/articles/...)로
     * 저장된 이미지를 영영 못 지워 고아로 남는다.
     *
     * <p>삭제 실패는 로그만 남긴다. 버킷 정리 때문에 게시글 수정이 막혀서는 안 된다.
     */
    public void deleteRemovedImages(String articleId, List<String> previousImages, List<String> newImages) {
        if (previousImages == null || previousImages.isEmpty()) {
            return;
        }
        List<String> retained = (newImages == null) ? List.of() : newImages;
        for (String imageUrl : previousImages) {
            if (retained.contains(imageUrl)) {
                continue;
            }
            String key = extractKeyOrNull(imageUrl);
            if (key == null || !key.startsWith(PROMOTION_KEY_ROOT)) {
                log.warn("Skip deleting image outside the promotion path: articleId={}, url={}", articleId, imageUrl);
                continue;
            }
            if (promotionArticleRepository.existsOtherActiveArticleWithImage(imageUrl, articleId)) {
                log.info("Skip deleting promotion image still used by another article: articleId={}, url={}", articleId, imageUrl);
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

    /**
     * 키를 게시글이 아니라 동아리 기준으로 잡는다. 게시글은 이미지와 같은 요청에서 태어날 수
     * 있어 발급 시점에 id가 없지만, 동아리는 항상 먼저 존재한다. 로고({@code {clubId}/logo/})·
     * 활동사진과 같은 축이다.
     */
    private String buildPromotionImageKey(String clubId, String originalFilename) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String filename = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        String sanitizedFilename = sanitizeFilename(StringUtils.getFilename(filename));
        String sanitizedClubId = sanitizePathSegment(clubId, "club");
        return PROMOTION_KEY_ROOT + sanitizedClubId
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
