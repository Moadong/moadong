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
import org.springframework.stereotype.Service;
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

    /**
     * 동아리 활동사진({@code generateFeedUploadUrls})과 같은 부분 성공 응답을 돌려준다.
     * 한 건이 실패해도 나머지는 발급되고, 실패 항목은 success=false로 표시된다.
     */
    public List<PresignedUploadResponse> createUploadUrls(String studentId, List<UploadUrlRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return List.of();
        }

        int limit = Math.min(MAX_IMAGE_COUNT, requests.size());
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

    private PresignedUploadResponse errorResponse(ErrorCode errorCode) {
        return new PresignedUploadResponse(null, null, null, false, errorCode.getMessage());
    }

    private PresignedUploadResponse createUploadUrl(String studentId, UploadUrlRequest request) {
        if (!isImageExtension(request.fileName())) {
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
