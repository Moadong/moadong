package moadong.media.service;

import lombok.RequiredArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

import static moadong.media.util.ClubImageUtil.isImageExtension;

@Service
@RequiredArgsConstructor
public class R2ImageUploadService {

    private final S3Client s3Client;

    @Value("${server.image.max-size}")
    private long maxImageSizeBytes;

    public String upload(MultipartFile file, String bucketName, String viewEndpoint, String key) {
        validateConfig(bucketName, viewEndpoint);
        String contentType = validateFile(file);

        String originalFilename = extractFileName(file);
        String extension = getFileExtension(originalFilename, contentType);
        String resolvedContentType = resolveContentType(contentType, extension);

        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key)
            .contentType(resolvedContentType)
            .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(request, RequestBody.fromInputStream(inputStream, file.getSize()));
            return normalizeViewEndpoint(viewEndpoint) + "/" + key;
        } catch (IOException | SdkException e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    private void validateConfig(String bucketName, String viewEndpoint) {
        if (!StringUtils.hasText(bucketName)) {
            throw new IllegalStateException("upload bucket must be configured");
        }
        if (!StringUtils.hasText(viewEndpoint)) {
            throw new IllegalStateException("upload view endpoint must be configured");
        }
    }

    private String normalizeViewEndpoint(String viewEndpoint) {
        return viewEndpoint.replaceAll("/+$", "");
    }

    private String validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }

        String originalFilename = extractFileName(file);
        String normalizedContentType = normalizeContentType(file.getContentType());

        boolean hasExtension = StringUtils.hasText(StringUtils.getFilenameExtension(originalFilename));
        boolean hasValidExtension = isImageExtension(originalFilename);
        boolean hasValidContentType = StringUtils.hasText(normalizedContentType)
            && normalizedContentType.matches("^image/(jpeg|jpg|png|gif|bmp|webp)$");

        if (hasExtension && !hasValidExtension) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (!hasExtension && !hasValidContentType) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (StringUtils.hasText(normalizedContentType) && !hasValidContentType) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        if (file.getSize() > maxImageSizeBytes) {
            throw new RestApiException(ErrorCode.FILE_TOO_LARGE);
        }

        return normalizedContentType;
    }

    private String extractFileName(MultipartFile file) {
        String cleanedPath = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String fileName = StringUtils.getFilename(cleanedPath);
        if (!StringUtils.hasText(fileName)) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }
        return fileName;
    }

    private String getFileExtension(String fileName, String contentType) {
        String extension = StringUtils.getFilenameExtension(fileName);
        if (StringUtils.hasText(extension)) {
            return "." + extension.toLowerCase(Locale.ROOT);
        }
        if (StringUtils.hasText(contentType)) {
            return switch (contentType.toLowerCase(Locale.ROOT)) {
                case "image/jpeg", "image/jpg" -> ".jpg";
                case "image/png" -> ".png";
                case "image/gif" -> ".gif";
                case "image/bmp" -> ".bmp";
                case "image/webp" -> ".webp";
                default -> throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
            };
        }
        throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
    }

    private String resolveContentType(String rawContentType, String extension) {
        if (StringUtils.hasText(rawContentType)) {
            return normalizeContentType(rawContentType);
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

    private String normalizeContentType(String rawContentType) {
        if (!StringUtils.hasText(rawContentType)) {
            return rawContentType;
        }
        String normalized = rawContentType.trim().toLowerCase(Locale.ROOT);
        return "image/jpg".equals(normalized) ? "image/jpeg" : normalized;
    }
}
