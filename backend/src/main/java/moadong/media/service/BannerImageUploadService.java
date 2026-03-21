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
        String originalFilename = StringUtils.getFilename(StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename()));
        if (!StringUtils.hasText(originalFilename)) {
            originalFilename = "image";
        }
        String key = type.name().toLowerCase(Locale.ROOT) + "/" + originalFilename;
        String imageUrl = r2ImageUploadService.upload(file, bannerBucketName, bannerViewEndpoint, key);
        return new BannerImageUploadResponse(imageUrl);
    }
}
