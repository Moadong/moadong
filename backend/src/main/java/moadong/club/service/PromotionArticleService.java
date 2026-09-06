package moadong.club.service;

import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.PromotionArticle;
import moadong.club.enums.ClubState;
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
import moadong.user.payload.CustomUserDetails;
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
    public PromotionArticleCreateResultDto createPromotionArticle(PromotionArticleCreateRequest request, CustomUserDetails user) {
        String clubId = resolveClubId(request.clubId(), user);
        Club club = getClub(clubId);
        validateClubApproved(club, user);
        validateImageCount(request.images());

        PromotionArticle article = PromotionArticle.builder()
            .clubId(clubId)
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
    public void updatePromotionArticle(String articleId, PromotionArticleUpdateRequest request, CustomUserDetails user) {
        PromotionArticle article = promotionArticleRepository.findActiveById(articleId)
            .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));
        validateOwnership(article, user);
        String clubId = resolveClubId(request.clubId(), user);
        Club club = getClub(clubId);
        validateClubApproved(club, user);
        validateImageCount(request.images());

        article.update(clubId, request, club.getName());
        promotionArticleRepository.save(article);
    }

    @Transactional
    public void deletePromotionArticle(String articleId, CustomUserDetails user) {
        PromotionArticle article = promotionArticleRepository.findActiveById(articleId)
            .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));
        validateOwnership(article, user);

        article.softDelete();
        promotionArticleRepository.save(article);
    }

    /**
     * 개발자는 요청의 clubId를 그대로 쓰고, 동아리 관리자는 요청값을 무시하고 본인 동아리로 강제한다.
     */
    private String resolveClubId(String requestedClubId, CustomUserDetails user) {
        return user.isDeveloper() ? requestedClubId : user.getClubId();
    }

    /**
     * 동아리 관리자는 심사가 완료된(AVAILABLE) 동아리만 게시글을 작성·수정할 수 있다.
     */
    private void validateClubApproved(Club club, CustomUserDetails user) {
        if (!user.isDeveloper() && club.getState() != ClubState.AVAILABLE) {
            throw new RestApiException(ErrorCode.PROMOTION_CLUB_NOT_APPROVED);
        }
    }

    /**
     * 업로드 URL 발급 쪽에서도 잔여분만 내주지만, images를 통째로 받는 저장 경로가
     * 유일한 진실이므로 여기서 총량을 다시 막는다.
     */
    private void validateImageCount(List<String> images) {
        if (images != null && images.size() > PromotionArticle.MAX_IMAGE_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
    }

    private void validateOwnership(PromotionArticle article, CustomUserDetails user) {
        if (!user.isDeveloper() && !user.getClubId().equals(article.getClubId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
    }

    private Club getClub(String clubId) {
        ObjectId clubObjectId = ObjectIdConverter.convertString(clubId);
        return clubRepository.findClubById(clubObjectId)
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
    }
}
