package moadong.club.payload.response;

import moadong.club.payload.dto.PromotionArticleDto;

import java.util.List;

public record PromotionArticleResponse(
    List<PromotionArticleDto> articles
) {
}
