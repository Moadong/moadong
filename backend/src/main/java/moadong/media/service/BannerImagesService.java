package moadong.media.service;

import lombok.RequiredArgsConstructor;
import moadong.media.dto.BannerImagesResponse;
import moadong.media.entity.BannerImages;
import moadong.media.repository.BannerImagesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerImagesService {

    private static final String BANNER_IMAGES_ID = "main";

    private final BannerImagesRepository bannerImagesRepository;

    @Transactional
    public void putBannerImages(List<String> images) {
        BannerImages bannerImages = BannerImages.builder()
            .id(BANNER_IMAGES_ID)
            .images(new ArrayList<>(images))
            .updatedAt(Instant.now())
            .build();

        bannerImagesRepository.save(bannerImages);
    }

    public BannerImagesResponse getBannerImages() {
        List<String> images = bannerImagesRepository.findById(BANNER_IMAGES_ID)
            .map(BannerImages::getImages)
            .orElseGet(List::of);

        return new BannerImagesResponse(images);
    }
}
