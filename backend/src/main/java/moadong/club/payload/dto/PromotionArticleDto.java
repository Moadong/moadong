package moadong.club.payload.dto;

import java.time.Instant;
import java.util.List;

public record PromotionArticleDto(
    String clubName,
    String clubId,
    String title,
    String location,
    Instant eventStartDate,
    Instant eventEndDate,
    String description,
    List<String> images
) {
}
