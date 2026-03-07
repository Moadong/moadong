package moadong.media.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.BannerImageUploadResponse;
import moadong.media.enums.PlatformType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

import static moadong.media.util.ClubImageUtil.isImageExtension;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerImageUploadService {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bannerbucket}")
    private String bannerBucketName;

    @Value("${cloud.aws.s3.banner-view-endpoint}")
    private String bannerViewEndpoint;

    @Value("${server.image.max-size}")
    private long maxImageSizeBytes;

    private String normalizedViewEndpoint;

    @PostConstruct
    private void init() {
        if (!StringUtils.hasText(bannerBucketName)) {
            throw new IllegalStateException("cloud.aws.s3.bannerbucket must be configured");
        }
        if (!StringUtils.hasText(bannerViewEndpoint)) {
            throw new IllegalStateException("cloud.aws.s3.banner-view-endpoint must be configured");
        }
        normalizedViewEndpoint = bannerViewEndpoint.replaceAll("/+$", "");
    }

    public BannerImageUploadResponse upload(MultipartFile file, PlatformType type) {
        validateFile(file);

        String originalFilename = extractFileName(file);
        String extension = getFileExtension(originalFilename);
        String contentType = resolveContentType(file.getContentType(), extension);
        String key = type.name().toLowerCase(Locale.ROOT) + "/" + originalFilename;

        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(bannerBucketName)
            .key(key)
            .contentType(contentType)
            .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(request, RequestBody.fromInputStream(inputStream, file.getSize()));
            return new BannerImageUploadResponse(normalizedViewEndpoint + "/" + key);
        } catch (IOException | S3Exception e) {
            log.error("Failed to upload banner image: bucket={}, key={}", bannerBucketName, key, e);
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }

        String originalFilename = extractFileName(file);
        if (!isImageExtension(originalFilename)) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        if (file.getSize() > maxImageSizeBytes) {
            throw new RestApiException(ErrorCode.FILE_TOO_LARGE);
        }

        String contentType = file.getContentType();
        if (StringUtils.hasText(contentType) && !contentType.matches("^image/(jpeg|jpg|png|gif|bmp|webp)$")) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
    }

    private String extractFileName(MultipartFile file) {
        String cleanedPath = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String fileName = StringUtils.getFilename(cleanedPath);
        if (!StringUtils.hasText(fileName)) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }
        return fileName;
    }

    private String getFileExtension(String fileName) {
        String extension = StringUtils.getFilenameExtension(fileName);
        if (!StringUtils.hasText(extension)) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        return "." + extension.toLowerCase();
    }

    private String resolveContentType(String rawContentType, String extension) {
        if (StringUtils.hasText(rawContentType)) {
            return "image/jpg".equalsIgnoreCase(rawContentType) ? "image/jpeg" : rawContentType;
        }

        return switch (extension) {
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".gif" -> "image/gif";
            case ".bmp" -> "image/bmp";
            case ".webp" -> "image/webp";
            default -> throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        };
    }
}
