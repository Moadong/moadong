package moadong.media.service;

import lombok.RequiredArgsConstructor;
import moadong.media.dto.BannerItemRequest;
import moadong.media.dto.BannerItemResponse;
import moadong.media.dto.BannerImagesResponse;
import moadong.media.entity.BannerItem;
import moadong.media.entity.BannerImages;
import moadong.media.enums.PlatformType;
import moadong.media.repository.BannerImagesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerImagesService {

    private static final String BANNER_IMAGES_ID = "main";

    private final BannerImagesRepository bannerImagesRepository;

    @Transactional
    public void putBannerImages(List<BannerItemRequest> images, PlatformType platformType) {
        BannerImages bannerImages = BannerImages.builder()
            .id(BANNER_IMAGES_ID + "_" + platformType.name())
            .images(images.stream()
                .map(this::toEntity)
                .toList())
            .updatedAt(Instant.now())
            .build();

        bannerImagesRepository.save(bannerImages);
    }

    public BannerImagesResponse getBannerImages(PlatformType platformType) {
        List<BannerItemResponse> images = bannerImagesRepository.findById(BANNER_IMAGES_ID + "_" + platformType.name())
            .map(BannerImages::getImages)
            .orElseGet(List::of)
            .stream()
            .map(this::toResponse)
            .toList();

        return new BannerImagesResponse(images);
    }

    private BannerItem toEntity(BannerItemRequest item) {
        return BannerItem.builder()
            .id(item.id())
            .imageUrl(item.imageUrl())
            .linkTo(item.linkTo())
            .alt(item.alt())
            .build();
    }

    private BannerItemResponse toResponse(BannerItem item) {
        return new BannerItemResponse(
            item.getId(),
            item.getImageUrl(),
            item.getLinkTo(),
            item.getAlt()
        );
    }
}
