package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record PromotionArticleCreateRequest(
    @NotBlank String clubId,
    @NotBlank String title,
    String location,
    @NotNull Instant eventStartDate,
    @NotNull Instant eventEndDate,
    @NotBlank String description,
    @NotEmpty List<String> images
) {
}
