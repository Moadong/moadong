package moadong.feedback.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.RandomStringUtil;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import static moadong.media.util.ClubImageUtil.isImageExtension;

/**
 * 우체통 첨부 사진 업로드. 동아리 활동사진(`CloudflareImageService`)과 같은 presigned 방식이다.
 * 클라이언트가 R2로 직접 올린 뒤, 피드백 저장 시점에 서버가 전량을 다시 검증한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackImageService {

    /** 편지 1건당 첨부 가능한 사진 수. */
    private static final int MAX_IMAGE_COUNT = 4;
    private static final String KEY_ROOT = "feedback/";

    /**
     * {@code UploadUrlRequest}의 @Pattern은 {@code @Valid List<T>}에서 요소까지 내려가지 않아 동작하지 않는다.
     * 서명에 들어가는 값이라 서버에서 직접 막는다.
     */
    private static final Pattern ALLOWED_CONTENT_TYPE = Pattern.compile("^image/(jpeg|jpg|png|gif|bmp|webp)$");

    /**
     * 학생 토큰은 {@code /auth/student}로 누구나 무제한 발급받을 수 있다. 제한이 없으면 피드백을 만들지 않고도
     * presigned URL만 받아 공개 버킷에 임의 파일을 올릴 수 있어, studentId와 IP 양쪽에 창을 건다.
     */
    private static final String RATE_LIMIT_KEY_PREFIX = "feedback:image-upload-url:ratelimit:";
    private static final long RATE_LIMIT_WINDOW_SECONDS = 600L;
    /** 편지 한 건에 4장이므로 10분에 5번 작성할 수 있는 여유. 정상 사용은 닿지 않는다. */
    private static final long RATE_LIMIT_MAX_REQUESTS = 20L;
    private static final RedisScript<Long> RATE_LIMIT_SCRIPT = RedisScript.of(
            "local c = redis.call('INCR', KEYS[1])\n"
                    + "if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end\n"
                    + "return c",
            Long.class
    );

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final AwsProperties awsProperties;
    private final ServerProperties serverProperties;
    private final StringRedisTemplate stringRedisTemplate;

    private String normalizedViewEndpoint;

    @PostConstruct
    private void init() {
        String viewEndpoint = awsProperties.s3().viewEndpoint();
        if (viewEndpoint == null || viewEndpoint.isEmpty()) {
            throw new IllegalStateException("cloud.aws.s3.view-endpoint must be configured");
        }
        normalizedViewEndpoint = viewEndpoint.replaceAll("/+$", "");
    }

    /**
     * 동아리 활동사진({@code generateFeedUploadUrls})과 같은 부분 성공 응답을 돌려준다.
     * 한 건이 실패해도 나머지는 발급되고, 실패 항목은 success=false로 표시된다.
     */
    public List<PresignedUploadResponse> createUploadUrls(String studentId, List<UploadUrlRequest> requests,
                                                         String clientIp) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        int limit = Math.min(MAX_IMAGE_COUNT, requests.size());
        validateRateLimit(studentId, clientIp, limit);
        List<PresignedUploadResponse> results = new ArrayList<>(limit + 1);
        for (int i = 0; i < limit; i++) {
            try {
                results.add(createUploadUrl(studentId, requests.get(i)));
            } catch (RestApiException e) {
                results.add(errorResponse(e.getErrorCode()));
            }
        }
        if (requests.size() > limit) {
            results.add(errorResponse(ErrorCode.TOO_MANY_FILES));
        }
        return results;
    }

    /**
     * 발급하려는 장수만큼 카운트를 올린다. studentId는 새로 발급받아 우회할 수 있으므로 IP 창을 함께 건다.
     */
    private void validateRateLimit(String studentId, String clientIp, int issuedCount) {
        for (String key : List.of(rateLimitKey("student", studentId), rateLimitKey("ip", clientIp))) {
            Long count = null;
            for (int i = 0; i < issuedCount; i++) {
                count = stringRedisTemplate.execute(RATE_LIMIT_SCRIPT, List.of(key),
                        String.valueOf(RATE_LIMIT_WINDOW_SECONDS));
            }
            if (count != null && count > RATE_LIMIT_MAX_REQUESTS) {
                log.warn("Feedback image upload-url rate limited. key={}, count={}", key, count);
                throw new RestApiException(ErrorCode.FEEDBACK_IMAGE_UPLOAD_RATE_LIMITED);
            }
        }
    }

    private String rateLimitKey(String scope, String value) {
        return RATE_LIMIT_KEY_PREFIX + scope + ":" + (StringUtils.hasText(value) ? value : "unknown");
    }

    private PresignedUploadResponse errorResponse(ErrorCode errorCode) {
        return new PresignedUploadResponse(null, null, null, false, errorCode.getMessage());
    }

    private PresignedUploadResponse createUploadUrl(String studentId, UploadUrlRequest request) {
        if (!isImageExtension(request.fileName())) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        // contentType은 그대로 서명돼 R2가 응답 헤더로 되돌려준다. text/html이 통과하면
        // 업로드한 파일이 우리 CDN 도메인에서 그대로 실행된다.
        if (request.contentType() == null || !ALLOWED_CONTENT_TYPE.matcher(request.contentType()).matches()) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        String key = buildKey(studentId, request.fileName());
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(awsProperties.s3().bucket())
                .key(key)
                .contentType(request.contentType())
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(serverProperties.fileUrl().expirationTime()))
                .putObjectRequest(putObjectRequest)
                .build();

        String presignedUrl = s3Presigner.presignPutObject(presignRequest).url().toString();
        return new PresignedUploadResponse(
                presignedUrl,
                normalizedViewEndpoint + "/" + key,
                Map.of("Content-Type", request.contentType()),
                true,
                null);
    }

    /**
     * 피드백 저장 직전 최종 검증. 클라이언트가 준 URL을 그대로 믿지 않고
     * 장수 · 경로 소유자 · 실제 업로드 여부 · 용량을 R2에서 다시 확인한다.
     */
    public List<String> validateImages(String studentId, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return List.of();
        }
        if (imageUrls.size() > MAX_IMAGE_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }

        imageUrls.forEach(imageUrl -> validateImage(studentId, imageUrl));
        return List.copyOf(imageUrls);
    }

    private void validateImage(String studentId, String imageUrl) {
        if (imageUrl == null || imageUrl.length() > serverProperties.fileUrl().maxLength()) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }

        String key = extractKeyOrNull(imageUrl);
        if (key == null || !key.startsWith(KEY_ROOT + studentId + "/")) {
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

    private void deleteQuietly(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(awsProperties.s3().bucket())
                    .key(key)
                    .build());
        } catch (S3Exception e) {
            log.warn("Failed to delete oversized feedback image from R2: key={}, error={}", key, e.getMessage());
        }
    }

    /**
     * studentId는 학생 토큰의 sub로, {@code StudentJwtService}가 UUID 형식을 검증한 값이라 경로에 그대로 쓸 수 있다.
     */
    private String buildKey(String studentId, String fileName) {
        String extension = fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf("."))
                : "";
        return KEY_ROOT + studentId + "/" + RandomStringUtil.generateRandomString(10) + extension;
    }

    private String extractKeyOrNull(String imageUrl) {
        String prefix = normalizedViewEndpoint + "/";
        return imageUrl.startsWith(prefix) ? imageUrl.substring(prefix.length()) : null;
    }
}
