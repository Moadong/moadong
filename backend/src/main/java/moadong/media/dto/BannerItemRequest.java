package moadong.media.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record BannerItemRequest(
    @NotBlank(message = "배너 ID는 비어 있을 수 없습니다.")
    String id,
    @NotBlank(message = "배너 이미지 URL은 비어 있을 수 없습니다.")
    String imageUrl,
    @Schema(nullable = true, description = "배너 클릭 시 이동 링크. 없으면 null")
    String linkTo,
    @NotBlank(message = "배너 대체 텍스트는 비어 있을 수 없습니다.")
    String alt
) {
}
