package moadong.club.controller;

import moadong.club.service.PromotionArticleService;
import moadong.global.payload.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PromotionArticleControllerTest {

    @Mock
    private PromotionArticleService promotionArticleService;

    @InjectMocks
    private PromotionArticleController promotionArticleController;

    @Test
    void 홍보게시글을_삭제하면_성공응답을_반환한다() {
        ResponseEntity<?> response = promotionArticleController.deletePromotionArticle("article-1");

        assertEquals(200, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Response<Object> body = (Response<Object>) response.getBody();
        assertEquals("홍보 게시글이 삭제되었습니다.", body.message());
        verify(promotionArticleService).deletePromotionArticle("article-1");
    }
}
