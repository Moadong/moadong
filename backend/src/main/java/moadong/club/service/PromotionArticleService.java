package moadong.club.service;

import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.PromotionArticle;
import moadong.club.payload.dto.PromotionArticleDto;
import moadong.club.payload.dto.PromotionArticleCreateResultDto;
import moadong.club.payload.request.PromotionArticleCreateRequest;
import moadong.club.payload.request.PromotionArticleUpdateRequest;
import moadong.club.payload.response.PromotionArticleResponse;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.PromotionArticleRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.ObjectIdConverter;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionArticleService {

    private final PromotionArticleRepository promotionArticleRepository;
    private final ClubRepository clubRepository;

    public PromotionArticleResponse getPromotionArticles() {
        List<PromotionArticleDto> articles = promotionArticleRepository.findAllActiveOrderByCreatedAtDesc()
            .stream()
            .map(PromotionArticleDto::from)
            .toList();
        return new PromotionArticleResponse(articles);
    }

    @Transactional
    public PromotionArticleCreateResultDto createPromotionArticle(PromotionArticleCreateRequest request) {
        Club club = getClub(request.clubId());

        PromotionArticle article = PromotionArticle.builder()
            .clubId(request.clubId())
            .clubName(club.getName())
            .title(request.title())
            .location(request.location())
            .latitude(request.latitude())
            .longitude(request.longitude())
            .eventStartDate(request.eventStartDate())
            .eventEndDate(request.eventEndDate())
            .description(request.description())
            .images(request.images())
            .build();

        PromotionArticle savedArticle = promotionArticleRepository.save(article);
        return new PromotionArticleCreateResultDto(savedArticle.getId());
    }

    @Transactional
    public void updatePromotionArticle(String articleId, PromotionArticleUpdateRequest request) {
        PromotionArticle article = promotionArticleRepository.findActiveById(articleId)
            .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));
        Club club = getClub(request.clubId());

        article.update(request, club.getName());
        promotionArticleRepository.save(article);
    }

    @Transactional
    public void deletePromotionArticle(String articleId) {
        PromotionArticle article = promotionArticleRepository.findActiveById(articleId)
            .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));

        article.softDelete();
        promotionArticleRepository.save(article);
    }

    private Club getClub(String clubId) {
        ObjectId clubObjectId = ObjectIdConverter.convertString(clubId);
        return clubRepository.findClubById(clubObjectId)
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
    }
}
