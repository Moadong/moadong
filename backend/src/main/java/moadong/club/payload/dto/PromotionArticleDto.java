package moadong.club.payload.dto;

import moadong.club.entity.PromotionArticle;

import java.time.Instant;
import java.util.List;

public record PromotionArticleDto(
    String id,
    String clubName,
    String clubId,
    String title,
    String location,
    Instant eventStartDate,
    Instant eventEndDate,
    String description,
    List<String> images
) {
    public static PromotionArticleDto from(PromotionArticle article) {
        return new PromotionArticleDto(
            article.getId(),
            article.getClubName(),
            article.getClubId(),
            article.getTitle(),
            article.getLocation(),
            article.getEventStartDate(),
            article.getEventEndDate(),
            article.getDescription(),
            article.getImages()
        );
    }
}
