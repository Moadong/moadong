package moadong.media.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import moadong.media.enums.PlatformType;

import java.util.List;

public record BannerImagesRequest(
    @NotNull(message = "배너 이미지 목록은 null일 수 없습니다.")
    List<@Valid BannerItemRequest> images,
    @NotNull PlatformType type
) {
}
