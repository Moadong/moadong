package moadong.club.service;

import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.PromotionArticle;
import moadong.club.payload.dto.PromotionArticleDto;
import moadong.club.payload.request.PromotionArticleCreateRequest;
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
        List<PromotionArticleDto> articles = promotionArticleRepository.findAllProjectedBy();
        return new PromotionArticleResponse(articles);
    }

    @Transactional
    public void createPromotionArticle(PromotionArticleCreateRequest request) {
        ObjectId clubObjectId = ObjectIdConverter.convertString(request.clubId());
        Club club = clubRepository.findClubById(clubObjectId)
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        PromotionArticle article = PromotionArticle.builder()
            .clubId(request.clubId())
            .clubName(club.getName())
            .title(request.title())
            .location(request.location())
            .eventStartDate(request.eventStartDate())
            .eventEndDate(request.eventEndDate())
            .description(request.description())
            .images(request.images())
            .build();

        promotionArticleRepository.save(article);
    }
}
