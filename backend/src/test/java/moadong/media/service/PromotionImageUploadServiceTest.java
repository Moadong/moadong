package moadong.media.service;

import moadong.club.entity.PromotionArticle;
import moadong.club.repository.PromotionArticleRepository;
import moadong.global.config.properties.AwsProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.PromotionImageUploadResponse;
import moadong.user.entity.User;
import moadong.user.entity.enums.UserRole;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

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
        when(promotionArticleRepository.findActiveById(articleId)).thenReturn(Optional.of(article(articleId, "club-1")));
        when(r2ImageUploadService.upload(eq(file), eq("moadong-dev"), eq("https://cdn.example.com"), startsWith("promotion/articles/" + articleId + "/")))
            .thenReturn(uploadedUrl);
        when(promotionArticleRepository.addImageToActiveArticle(articleId, uploadedUrl)).thenReturn(1L);

        PromotionImageUploadResponse response = promotionImageUploadService.upload(articleId, file, developer());

        verify(promotionArticleRepository).findActiveById(articleId);
        verify(r2ImageUploadService).upload(eq(file), eq("moadong-dev"), eq("https://cdn.example.com"), startsWith("promotion/articles/" + articleId + "/"));
        verify(promotionArticleRepository).addImageToActiveArticle(articleId, uploadedUrl);
        verify(promotionArticleRepository, never()).save(any());
        assertEquals(uploadedUrl, response.imageUrl());
        assertTrue(response.imageUrl().contains("/promotion/articles/" + articleId + "/"));
    }

    @Test
    void 존재하지_않는_홍보게시글이면_예외를_던진다() {
        when(promotionArticleRepository.findActiveById("missing")).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("missing", file, developer()));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 삭제된_홍보게시글이면_이미지_업로드를_막는다() {
        when(promotionArticleRepository.findActiveById("deleted-article")).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("deleted-article", file, developer()));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
        verify(promotionArticleRepository).findActiveById("deleted-article");
    }

    @Test
    void 동아리관리자는_다른_동아리_게시글에_이미지를_업로드할_수_없다() {
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article("article-1", "other-club")));
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("article-1", file, clubAdmin("my-club")));

        assertEquals(ErrorCode.USER_UNAUTHORIZED, exception.getErrorCode());
        verify(r2ImageUploadService, never()).upload(any(), any(), any(), any());
        verify(promotionArticleRepository, never()).addImageToActiveArticle(any(), any());
    }

    @Test
    void 동아리관리자는_본인_동아리_게시글에_이미지를_업로드할_수_있다() {
        String articleId = "article-1";
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());
        AwsProperties.S3 s3 = new AwsProperties.S3("moadong-dev", "https://r2.example.com", "https://cdn.example.com");
        String uploadedUrl = "https://cdn.example.com/promotion/articles/article-1/2026/03/uuid-poster.png";
        when(awsProperties.s3()).thenReturn(s3);
        when(promotionArticleRepository.findActiveById(articleId)).thenReturn(Optional.of(article(articleId, "my-club")));
        when(r2ImageUploadService.upload(eq(file), eq("moadong-dev"), eq("https://cdn.example.com"), startsWith("promotion/articles/" + articleId + "/")))
            .thenReturn(uploadedUrl);
        when(promotionArticleRepository.addImageToActiveArticle(articleId, uploadedUrl)).thenReturn(1L);

        PromotionImageUploadResponse response = promotionImageUploadService.upload(articleId, file, clubAdmin("my-club"));

        assertEquals(uploadedUrl, response.imageUrl());
        verify(promotionArticleRepository).addImageToActiveArticle(articleId, uploadedUrl);
    }

    private static PromotionArticle article(String id, String clubId) {
        return PromotionArticle.builder().id(id).clubId(clubId).build();
    }

    private static CustomUserDetails developer() {
        return userDetails("dev-club", UserRole.DEVELOPER);
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
}
