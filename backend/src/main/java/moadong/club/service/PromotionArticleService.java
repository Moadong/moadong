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
import moadong.media.service.PromotionImageUploadService;
import moadong.user.payload.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionArticleService {

    private final PromotionArticleRepository promotionArticleRepository;
    private final ClubRepository clubRepository;
    private final PromotionImageUploadService promotionImageUploadService;

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
        validateNoImagesOnCreate(request.images());

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

        List<String> previousImages = article.getImages();
        promotionImageUploadService.validateImages(articleId, request.images(), previousImages);
        article.update(clubId, request, club.getName());
        promotionArticleRepository.save(article);
        deleteRemovedImagesAfterCommit(articleId, previousImages, request.images());
    }

    /**
     * R2 삭제는 Mongo 커밋 뒤로 미룬다. save 직후에 지우면 이후 커밋이 실패했을 때
     * 게시글은 옛 이미지 URL을 그대로 들고 있는데 객체는 이미 사라진 상태가 된다.
     * 트랜잭션 밖에서 호출되면 미룰 곳이 없으므로 그 자리에서 지운다.
     */
    private void deleteRemovedImagesAfterCommit(String articleId, List<String> previousImages, List<String> newImages) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            promotionImageUploadService.deleteRemovedImages(articleId, previousImages, newImages);
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                promotionImageUploadService.deleteRemovedImages(articleId, previousImages, newImages);
            }
        });
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
     * 생성 시점에는 articleId가 없어 이미지가 이 게시글 경로에 올라왔는지 확인할 방법이 없다.
     * 업로드 URL 발급이 articleId를 요구하므로 정상 발급으로는 나올 수 없는 조합이기도 하다.
     * 이미지는 게시글을 만든 뒤 수정 API의 images로 붙인다.
     */
    private void validateNoImagesOnCreate(List<String> images) {
        if (images != null && !images.isEmpty()) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
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
