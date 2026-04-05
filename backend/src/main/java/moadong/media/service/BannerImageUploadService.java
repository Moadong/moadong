package moadong.media.service;

import lombok.RequiredArgsConstructor;
import moadong.media.dto.BannerImageUploadResponse;
import moadong.media.enums.PlatformType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.util.Locale;
@Service
@RequiredArgsConstructor
public class BannerImageUploadService {

    private final R2ImageUploadService r2ImageUploadService;

    @Value("${cloud.aws.s3.bannerbucket}")
    private String bannerBucketName;

    @Value("${cloud.aws.s3.banner-view-endpoint}")
    private String bannerViewEndpoint;

    public BannerImageUploadResponse upload(MultipartFile file, PlatformType type) {
        String originalFilename = sanitizeFilename(StringUtils.getFilename(
            StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename())
        ));
        String key = type.name().toLowerCase(Locale.ROOT) + "/" + ensureExtension(originalFilename, file.getContentType());
        String imageUrl = r2ImageUploadService.upload(file, bannerBucketName, bannerViewEndpoint, key);
        return new BannerImageUploadResponse(imageUrl);
    }

    private String sanitizeFilename(String filename) {
        String safeName = StringUtils.hasText(filename) ? filename : "image";
        return safeName.replaceAll("[^A-Za-z0-9._-]", "_");
    }

    private String ensureExtension(String filename, String contentType) {
        if (filename.contains(".")) {
            return filename;
        }
        if (contentType != null) {
            return switch (contentType.toLowerCase(Locale.ROOT)) {
                case "image/jpeg", "image/jpg" -> filename + ".jpg";
                case "image/png" -> filename + ".png";
                case "image/gif" -> filename + ".gif";
                case "image/webp" -> filename + ".webp";
                default -> filename;
            };
        }
        return filename;
    }
}
