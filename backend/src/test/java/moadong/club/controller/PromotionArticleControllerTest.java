package moadong.club.controller;

import moadong.club.service.PromotionArticleService;
import moadong.global.payload.Response;
import moadong.user.entity.User;
import moadong.user.entity.enums.UserRole;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@UnitTest
@ExtendWith(MockitoExtension.class)
class PromotionArticleControllerTest {

    @Mock
    private PromotionArticleService promotionArticleService;

    @InjectMocks
    private PromotionArticleController promotionArticleController;

    @Test
    void 홍보게시글을_삭제하면_성공응답을_반환한다() {
        CustomUserDetails user = new CustomUserDetails(User.builder()
            .id("user-doc-id").userId("user-1").password("password").clubId("club-1").role(UserRole.CLUB_ADMIN).build());

        ResponseEntity<?> response = promotionArticleController.deletePromotionArticle("article-1", user);

        assertEquals(200, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Response<Object> body = (Response<Object>) response.getBody();
        assertEquals("홍보 게시글이 삭제되었습니다.", body.message());
        verify(promotionArticleService).deletePromotionArticle("article-1", user);
    }
}
