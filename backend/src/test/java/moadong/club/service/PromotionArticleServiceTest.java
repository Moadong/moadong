package moadong.club.service;

import moadong.club.entity.Club;
import moadong.club.entity.PromotionArticle;
import moadong.club.enums.ClubState;
import moadong.club.payload.dto.PromotionArticleCreateResultDto;
import moadong.club.payload.request.PromotionArticleCreateRequest;
import moadong.club.payload.request.PromotionArticleUpdateRequest;
import moadong.club.payload.response.PromotionArticleResponse;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.PromotionArticleRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.User;
import moadong.user.entity.enums.UserRole;
import moadong.user.payload.CustomUserDetails;
import org.bson.types.ObjectId;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
@ExtendWith(MockitoExtension.class)
class PromotionArticleServiceTest {

    @Mock
    private PromotionArticleRepository promotionArticleRepository;

    @Mock
    private ClubRepository clubRepository;

    @InjectMocks
    private PromotionArticleService promotionArticleService;

    @Test
    void 홍보게시글_목록조회시_id를_포함해_반환한다() {
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId("65f0c1d5a4b1c92f57d51111")
            .clubName("모아동")
            .title("봄 모집")
            .location("서울")
            .latitude(37.5665)
            .longitude(126.9780)
            .eventStartDate(Instant.parse("2026-03-01T00:00:00Z"))
            .eventEndDate(Instant.parse("2026-03-31T00:00:00Z"))
            .description("설명")
            .images(List.of("image-1"))
            .build();
        when(promotionArticleRepository.findAllActiveOrderByCreatedAtDesc()).thenReturn(List.of(article));

        PromotionArticleResponse response = promotionArticleService.getPromotionArticles();

        assertEquals(1, response.articles().size());
        assertEquals("article-1", response.articles().get(0).id());
        assertEquals("모아동", response.articles().get(0).clubName());
        assertEquals(37.5665, response.articles().get(0).latitude());
        assertEquals(126.9780, response.articles().get(0).longitude());
    }

    @Test
    void 홍보게시글_목록조회시_활성게시글_기준_조회한다() {
        when(promotionArticleRepository.findAllActiveOrderByCreatedAtDesc()).thenReturn(List.of());

        promotionArticleService.getPromotionArticles();

        verify(promotionArticleRepository).findAllActiveOrderByCreatedAtDesc();
    }

    @Test
    void 홍보게시글을_수정한다() {
        String clubId = new ObjectId().toHexString();
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId("old-club-id")
            .clubName("이전 동아리")
            .title("이전 제목")
            .location("이전 장소")
            .latitude(35.1796)
            .longitude(129.0756)
            .eventStartDate(Instant.parse("2026-03-01T00:00:00Z"))
            .eventEndDate(Instant.parse("2026-03-02T00:00:00Z"))
            .description("이전 설명")
            .images(List.of("old-image"))
            .build();
        PromotionArticleUpdateRequest request = new PromotionArticleUpdateRequest(
            clubId,
            "수정 제목",
            "수정 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "수정 설명",
            List.of("new-image-1", "new-image-2")
        );
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));
        when(clubRepository.findClubById(new ObjectId(clubId))).thenReturn(Optional.of(Club.builder()
            .name("수정 동아리")
            .category("category")
            .division("division")
            .userId("user-1")
            .build()));

        promotionArticleService.updatePromotionArticle("article-1", request, developer());

        assertEquals(clubId, article.getClubId());
        assertEquals("수정 동아리", article.getClubName());
        assertEquals("수정 제목", article.getTitle());
        assertEquals("수정 장소", article.getLocation());
        assertEquals(37.5665, article.getLatitude());
        assertEquals(126.9780, article.getLongitude());
        assertEquals(Instant.parse("2026-04-01T00:00:00Z"), article.getEventStartDate());
        assertEquals(Instant.parse("2026-04-10T00:00:00Z"), article.getEventEndDate());
        assertEquals("수정 설명", article.getDescription());
        assertEquals(List.of("new-image-1", "new-image-2"), article.getImages());
        verify(promotionArticleRepository).save(article);
    }

    @Test
    void 홍보게시글을_생성하고_articleId를_반환한다() {
        String clubId = new ObjectId().toHexString();
        PromotionArticleCreateRequest request = new PromotionArticleCreateRequest(
            clubId,
            "신규 제목",
            "신규 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "신규 설명",
            List.of()
        );
        Club club = Club.builder()
            .name("생성 동아리")
            .category("category")
            .division("division")
            .userId("user-1")
            .build();
        PromotionArticle savedArticle = PromotionArticle.builder()
            .id("created-article-id")
            .clubId(clubId)
            .clubName("생성 동아리")
            .title("신규 제목")
            .location("신규 장소")
            .latitude(37.5665)
            .longitude(126.9780)
            .eventStartDate(Instant.parse("2026-04-01T00:00:00Z"))
            .eventEndDate(Instant.parse("2026-04-10T00:00:00Z"))
            .description("신규 설명")
            .images(List.of())
            .build();
        when(clubRepository.findClubById(new ObjectId(clubId))).thenReturn(Optional.of(club));
        when(promotionArticleRepository.save(any(PromotionArticle.class))).thenReturn(savedArticle);

        PromotionArticleCreateResultDto result = promotionArticleService.createPromotionArticle(request, developer());

        assertNotNull(result);
        assertEquals("created-article-id", result.articleId());
        verify(promotionArticleRepository).save(any(PromotionArticle.class));
    }

    @Test
    void 존재하지_않는_홍보게시글이면_예외를_던진다() {
        PromotionArticleUpdateRequest request = new PromotionArticleUpdateRequest(
            new ObjectId().toHexString(),
            "수정 제목",
            "수정 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "수정 설명",
            List.of("new-image")
        );
        when(promotionArticleRepository.findActiveById("missing-article")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.updatePromotionArticle("missing-article", request, developer()));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
        verify(clubRepository, never()).findClubById(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void 삭제된_홍보게시글은_수정할_수_없다() {
        PromotionArticleUpdateRequest request = new PromotionArticleUpdateRequest(
            new ObjectId().toHexString(),
            "수정 제목",
            "수정 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "수정 설명",
            List.of("new-image")
        );
        when(promotionArticleRepository.findActiveById("deleted-article")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.updatePromotionArticle("deleted-article", request, developer()));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
        verify(clubRepository, never()).findClubById(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void 홍보게시글을_삭제한다() {
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .build();
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));

        promotionArticleService.deletePromotionArticle("article-1", developer());

        assertTrue(article.isDeleted());
        assertNotNull(article.getDeletedAt());
        verify(promotionArticleRepository).save(article);
        verify(promotionArticleRepository, never()).deleteById("article-1");
    }

    @Test
    void 삭제대상_홍보게시글이_없으면_예외를_던진다() {
        when(promotionArticleRepository.findActiveById("missing-article")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.deletePromotionArticle("missing-article", developer()));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
        verify(promotionArticleRepository, never()).deleteById("missing-article");
    }

    @Test
    void 동아리관리자가_생성하면_요청_clubId를_무시하고_본인_동아리로_저장한다() {
        String ownClubId = new ObjectId().toHexString();
        String otherClubId = new ObjectId().toHexString();
        PromotionArticleCreateRequest request = createRequest(otherClubId);
        when(clubRepository.findClubById(new ObjectId(ownClubId))).thenReturn(Optional.of(club("내 동아리")));
        when(promotionArticleRepository.save(any(PromotionArticle.class)))
            .thenReturn(PromotionArticle.builder().id("created-article-id").build());

        promotionArticleService.createPromotionArticle(request, clubAdmin(ownClubId));

        ArgumentCaptor<PromotionArticle> captor = ArgumentCaptor.forClass(PromotionArticle.class);
        verify(promotionArticleRepository).save(captor.capture());
        assertEquals(ownClubId, captor.getValue().getClubId());
        assertEquals("내 동아리", captor.getValue().getClubName());
        verify(clubRepository, never()).findClubById(new ObjectId(otherClubId));
    }

    @Test
    void 동아리관리자가_수정하면_요청_clubId를_무시하고_본인_동아리를_유지한다() {
        String ownClubId = new ObjectId().toHexString();
        String otherClubId = new ObjectId().toHexString();
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId(ownClubId)
            .clubName("내 동아리")
            .title("이전 제목")
            .build();
        PromotionArticleUpdateRequest request = updateRequest(otherClubId);
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));
        when(clubRepository.findClubById(new ObjectId(ownClubId))).thenReturn(Optional.of(club("내 동아리")));

        promotionArticleService.updatePromotionArticle("article-1", request, clubAdmin(ownClubId));

        assertEquals(ownClubId, article.getClubId());
        assertEquals("수정 제목", article.getTitle());
        verify(promotionArticleRepository).save(article);
    }

    @Test
    void 동아리관리자는_다른_동아리_게시글을_수정할_수_없다() {
        String ownClubId = new ObjectId().toHexString();
        String otherClubId = new ObjectId().toHexString();
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId(otherClubId)
            .title("이전 제목")
            .build();
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.updatePromotionArticle("article-1", updateRequest(ownClubId), clubAdmin(ownClubId)));

        assertEquals(ErrorCode.USER_UNAUTHORIZED, exception.getErrorCode());
        assertEquals("이전 제목", article.getTitle());
        verify(promotionArticleRepository, never()).save(any());
    }

    @Test
    void 동아리관리자는_다른_동아리_게시글을_삭제할_수_없다() {
        String ownClubId = new ObjectId().toHexString();
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId(new ObjectId().toHexString())
            .build();
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.deletePromotionArticle("article-1", clubAdmin(ownClubId)));

        assertEquals(ErrorCode.USER_UNAUTHORIZED, exception.getErrorCode());
        assertFalse(article.isDeleted());
        verify(promotionArticleRepository, never()).save(any());
    }

    @Test
    void 동아리관리자는_본인_동아리_게시글을_삭제할_수_있다() {
        String ownClubId = new ObjectId().toHexString();
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId(ownClubId)
            .build();
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));

        promotionArticleService.deletePromotionArticle("article-1", clubAdmin(ownClubId));

        assertTrue(article.isDeleted());
        verify(promotionArticleRepository).save(article);
    }

    @Test
    void 개발자는_다른_동아리_게시글을_삭제할_수_있다() {
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId(new ObjectId().toHexString())
            .build();
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));

        promotionArticleService.deletePromotionArticle("article-1", developer());

        assertTrue(article.isDeleted());
        verify(promotionArticleRepository).save(article);
    }

    @Test
    void 심사전_동아리관리자는_게시글을_생성할_수_없다() {
        String ownClubId = new ObjectId().toHexString();
        when(clubRepository.findClubById(new ObjectId(ownClubId))).thenReturn(Optional.of(club("", ClubState.UNAVAILABLE)));

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.createPromotionArticle(createRequest(ownClubId), clubAdmin(ownClubId)));

        assertEquals(ErrorCode.PROMOTION_CLUB_NOT_APPROVED, exception.getErrorCode());
        verify(promotionArticleRepository, never()).save(any());
    }

    @Test
    void 심사전_동아리관리자는_게시글을_수정할_수_없다() {
        String ownClubId = new ObjectId().toHexString();
        PromotionArticle article = PromotionArticle.builder()
            .id("article-1")
            .clubId(ownClubId)
            .title("이전 제목")
            .build();
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article));
        when(clubRepository.findClubById(new ObjectId(ownClubId))).thenReturn(Optional.of(club("", ClubState.UNAVAILABLE)));

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionArticleService.updatePromotionArticle("article-1", updateRequest(ownClubId), clubAdmin(ownClubId)));

        assertEquals(ErrorCode.PROMOTION_CLUB_NOT_APPROVED, exception.getErrorCode());
        assertEquals("이전 제목", article.getTitle());
        verify(promotionArticleRepository, never()).save(any());
    }

    @Test
    void 개발자는_심사전_동아리로도_게시글을_생성할_수_있다() {
        String clubId = new ObjectId().toHexString();
        when(clubRepository.findClubById(new ObjectId(clubId))).thenReturn(Optional.of(club("", ClubState.UNAVAILABLE)));
        when(promotionArticleRepository.save(any(PromotionArticle.class)))
            .thenReturn(PromotionArticle.builder().id("created-article-id").build());

        PromotionArticleCreateResultDto result = promotionArticleService.createPromotionArticle(createRequest(clubId), developer());

        assertEquals("created-article-id", result.articleId());
    }

    private static CustomUserDetails developer() {
        return userDetails(new ObjectId().toHexString(), UserRole.DEVELOPER);
    }

    private static CustomUserDetails clubAdmin(String clubId) {
        return userDetails(clubId, UserRole.CLUB_ADMIN);
    }

    private static CustomUserDetails userDetails(String clubId, UserRole role) {
        return new CustomUserDetails(User.builder()
            .id("user-doc-id")
            .userId("user-1")
            .password("password")
            .clubId(clubId)
            .role(role)
            .build());
    }

    private static Club club(String name) {
        return club(name, ClubState.AVAILABLE);
    }

    private static Club club(String name, ClubState state) {
        Club club = Club.builder()
            .name(name)
            .category("category")
            .division("division")
            .userId("user-1")
            .build();
        ReflectionTestUtils.setField(club, "state", state);
        return club;
    }

    private static PromotionArticleCreateRequest createRequest(String clubId) {
        return new PromotionArticleCreateRequest(
            clubId,
            "신규 제목",
            "신규 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "신규 설명",
            List.of()
        );
    }

    private static PromotionArticleUpdateRequest updateRequest(String clubId) {
        return new PromotionArticleUpdateRequest(
            clubId,
            "수정 제목",
            "수정 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "수정 설명",
            List.of("new-image")
        );
    }
}
