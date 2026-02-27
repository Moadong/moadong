package moadong.media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import moadong.media.enums.PlatformType;

import java.util.List;

public record BannerImagesRequest(
    @NotNull(message = "배너 이미지 목록은 null일 수 없습니다.")
    List<@NotBlank(message = "배너 이미지 URL은 비어 있을 수 없습니다.") String> images,
    @NotNull PlatformType type
) {
}
