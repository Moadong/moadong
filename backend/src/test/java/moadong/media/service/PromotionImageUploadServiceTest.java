package moadong.media.service;

import moadong.club.repository.PromotionArticleRepository;
import moadong.global.config.properties.AwsProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.PromotionImageUploadResponse;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
@ExtendWith(MockitoExtension.class)
class PromotionImageUploadServiceTest {

    @Mock
    private PromotionArticleRepository promotionArticleRepository;

    @Mock
    private R2ImageUploadService r2ImageUploadService;

    @Mock
    private AwsProperties awsProperties;

    @InjectMocks
    private PromotionImageUploadService promotionImageUploadService;

    @Test
    void 홍보이미지_업로드시_articleId_prefix로_저장하고_게시글_이미지목록에_추가한다() {
        String articleId = "article-1";
        MockMultipartFile file = new MockMultipartFile("file", "poster main.png", "image/png", "img".getBytes());
        AwsProperties.S3 s3 = new AwsProperties.S3("moadong-dev", "https://r2.example.com", "https://cdn.example.com");
        String uploadedUrl = "https://cdn.example.com/promotion/articles/" + articleId + "/2026/03/uuid-poster_main.png";
        when(awsProperties.s3()).thenReturn(s3);
        when(promotionArticleRepository.existsActiveById(articleId)).thenReturn(true);
        when(r2ImageUploadService.upload(eq(file), eq("moadong-dev"), eq("https://cdn.example.com"), startsWith("promotion/articles/" + articleId + "/")))
            .thenReturn(uploadedUrl);
        when(promotionArticleRepository.addImageToActiveArticle(articleId, uploadedUrl)).thenReturn(1L);

        PromotionImageUploadResponse response = promotionImageUploadService.upload(articleId, file);

        verify(promotionArticleRepository).existsActiveById(articleId);
        verify(r2ImageUploadService).upload(eq(file), eq("moadong-dev"), eq("https://cdn.example.com"), startsWith("promotion/articles/" + articleId + "/"));
        verify(promotionArticleRepository).addImageToActiveArticle(articleId, uploadedUrl);
        verify(promotionArticleRepository, never()).save(any());
        assertEquals(uploadedUrl, response.imageUrl());
        assertTrue(response.imageUrl().contains("/promotion/articles/" + articleId + "/"));
    }

    @Test
    void 존재하지_않는_홍보게시글이면_예외를_던진다() {
        when(promotionArticleRepository.existsActiveById("missing")).thenReturn(false);
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("missing", file));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 삭제된_홍보게시글이면_이미지_업로드를_막는다() {
        when(promotionArticleRepository.existsActiveById("deleted-article")).thenReturn(false);
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("deleted-article", file));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
        verify(promotionArticleRepository).existsActiveById("deleted-article");
    }
}
