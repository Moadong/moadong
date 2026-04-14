package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record PromotionArticleCreateRequest(
    @NotBlank String clubId,
    @NotBlank String title,
    @NotBlank String location,
    @NotNull Double latitude,
    @NotNull Double longitude,
    @NotNull Instant eventStartDate,
    @NotNull Instant eventEndDate,
    @NotBlank String description,
    @NotNull List<String> images
) {
}
