package moadong.media.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record BannerItemResponse(
    String id,
    String imageUrl,
    @Schema(nullable = true, description = "배너 클릭 시 이동 링크. 없으면 null")
    String linkTo,
    String alt
) {
}
