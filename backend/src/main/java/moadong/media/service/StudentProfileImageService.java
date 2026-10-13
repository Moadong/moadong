package moadong.media.service;

import static moadong.media.util.ClubImageUtil.isImageExtension;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.RandomStringUtil;
import moadong.media.dto.PresignedUploadResponse;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentProfileImageService {

    private static final String KEY_PREFIX = "student-profiles/";

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

    public PresignedUploadResponse generateUploadUrl(String studentId, String fileName, String contentType) {
        if (fileName == null || fileName.isEmpty() || !isImageExtension(fileName)) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        String extension = fileName.contains(".")
                ? fileName.substring(fileName.lastIndexOf("."))
                : "";
        String key = KEY_PREFIX + studentId + "/" + RandomStringUtil.generateRandomString(10) + extension;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(awsProperties.s3().bucket())
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(serverProperties.fileUrl().expirationTime()))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        String finalUrl = normalizedViewEndpoint + "/" + key;

        Map<String, String> requiredHeaders = new HashMap<>();
        requiredHeaders.put("Content-Type", contentType);

        return new PresignedUploadResponse(presignedRequest.url().toString(), finalUrl, requiredHeaders, true, null);
    }

    public void validateImageUrl(String studentId, String imageUrl) {
        if (imageUrl == null || imageUrl.length() > serverProperties.fileUrl().maxLength()) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }

        String key = extractKeyOrNull(imageUrl);
        String expectedPrefix = KEY_PREFIX + studentId + "/";
        if (key == null || !key.startsWith(expectedPrefix)) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }

        try {
            HeadObjectRequest headReq = HeadObjectRequest.builder()
                    .bucket(awsProperties.s3().bucket())
                    .key(key)
                    .build();
            long contentLength = s3Client.headObject(headReq).contentLength();
            if (contentLength > serverProperties.image().maxSize().toBytes()) {
                deleteQuietly(key);
                throw new RestApiException(ErrorCode.FILE_TOO_LARGE);
            }
        } catch (NoSuchKeyException e) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        } catch (S3Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    public void deleteImageQuietly(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        String key = extractKeyOrNull(imageUrl);
        if (key == null) {
            log.warn("deleteImageQuietly: invalid imageUrl format: {}", imageUrl);
            return;
        }
        deleteQuietly(key);
    }

    private void deleteQuietly(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(awsProperties.s3().bucket())
                    .key(key)
                    .build());
        } catch (Exception e) {
            log.warn("Failed to delete student profile image from S3: key={}, error={}", key, e.getMessage());
        }
    }

    private String extractKeyOrNull(String imageUrl) {
        String prefix = normalizedViewEndpoint + "/";
        if (imageUrl == null || !imageUrl.startsWith(prefix)) {
            return null;
        }
        return imageUrl.substring(prefix.length());
    }
}
