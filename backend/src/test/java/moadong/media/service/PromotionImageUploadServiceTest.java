package moadong.media.service;

import moadong.club.entity.PromotionArticle;
import moadong.club.repository.PromotionArticleRepository;
import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.PromotionImageUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import moadong.user.entity.User;
import moadong.user.entity.enums.UserRole;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
@ExtendWith(MockitoExtension.class)
class PromotionImageUploadServiceTest {

    private static final String CDN = "https://cdn.example.com";

    @Mock
    private PromotionArticleRepository promotionArticleRepository;

    @Mock
    private R2ImageUploadService r2ImageUploadService;

    @Mock
    private S3Client s3Client;

    @Mock
    private S3Presigner s3Presigner;

    @Mock
    private AwsProperties awsProperties;

    @Mock
    private ServerProperties serverProperties;

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

    @Test
    void 업로드URL은_요청한_개수만큼_발급되고_게시글은_변경하지_않는다() {
        String articleId = "article-1";
        givenPresigner();
        when(promotionArticleRepository.findActiveById(articleId)).thenReturn(Optional.of(article(articleId, "my-club")));

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            articleId,
            List.of(new UploadUrlRequest("poster.png", "image/png"), new UploadUrlRequest("poster2.jpg", "image/jpeg")),
            clubAdmin("my-club"));

        assertEquals(2, responses.size());
        assertTrue(responses.get(0).success());
        assertTrue(responses.get(0).finalUrl().startsWith("https://cdn.example.com/promotion/articles/" + articleId + "/"));
        assertTrue(responses.get(0).finalUrl().endsWith(".png"));
        assertTrue(responses.get(1).finalUrl().endsWith(".jpg"));
        assertEquals("image/png", responses.get(0).requiredHeaders().get("Content-Type"));
        verify(promotionArticleRepository, never()).addImageToActiveArticle(any(), any());
    }

    @Test
    void 지원하지_않는_확장자와_contentType은_그_항목만_실패한다() {
        String articleId = "article-1";
        givenPresigner();
        when(promotionArticleRepository.findActiveById(articleId)).thenReturn(Optional.of(article(articleId, "my-club")));

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            articleId,
            List.of(
                new UploadUrlRequest("poster.png", "image/png"),
                new UploadUrlRequest("poster.txt", "image/png"),
                new UploadUrlRequest("poster.png", "text/html")),
            clubAdmin("my-club"));

        assertTrue(responses.get(0).success());
        assertFalse(responses.get(1).success());
        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE.getMessage(), responses.get(1).failureReason());
        assertFalse(responses.get(2).success());
        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE.getMessage(), responses.get(2).failureReason());
    }

    @Test
    void 동아리관리자는_다른_동아리_게시글의_업로드URL을_받을_수_없다() {
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article("article-1", "other-club")));

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.createUploadUrls("article-1",
                List.of(new UploadUrlRequest("poster.png", "image/png")), clubAdmin("my-club")));

        assertEquals(ErrorCode.USER_UNAUTHORIZED, exception.getErrorCode());
        verify(s3Presigner, never()).presignPutObject(any(PutObjectPresignRequest.class));
    }

    @Test
    void 존재하지_않는_홍보게시글이면_업로드URL을_발급하지_않는다() {
        when(promotionArticleRepository.findActiveById("missing")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.createUploadUrls("missing",
                List.of(new UploadUrlRequest("poster.png", "image/png")), developer()));

        assertEquals(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND, exception.getErrorCode());
        verify(s3Presigner, never()).presignPutObject(any(PutObjectPresignRequest.class));
    }

    @Test
    void 이미_상한을_채운_게시글은_업로드URL을_발급하지_않는다() {
        String articleId = "article-1";
        when(promotionArticleRepository.findActiveById(articleId))
            .thenReturn(Optional.of(article(articleId, "my-club", images(PromotionArticle.MAX_IMAGE_COUNT))));

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            articleId, List.of(new UploadUrlRequest("poster.png", "image/png")), clubAdmin("my-club"));

        assertEquals(1, responses.size());
        assertFalse(responses.get(0).success());
        assertEquals(ErrorCode.TOO_MANY_FILES.getMessage(), responses.get(0).failureReason());
        verify(s3Presigner, never()).presignPutObject(any(PutObjectPresignRequest.class));
    }

    @Test
    void 잔여분까지만_발급하고_초과분에는_TOO_MANY_FILES를_덧붙인다() {
        String articleId = "article-1";
        givenPresigner();
        when(promotionArticleRepository.findActiveById(articleId))
            .thenReturn(Optional.of(article(articleId, "my-club", images(PromotionArticle.MAX_IMAGE_COUNT - 1))));

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            articleId,
            List.of(new UploadUrlRequest("poster.png", "image/png"), new UploadUrlRequest("poster2.png", "image/png")),
            clubAdmin("my-club"));

        assertEquals(2, responses.size());
        assertTrue(responses.get(0).success());
        assertFalse(responses.get(1).success());
        assertEquals(ErrorCode.TOO_MANY_FILES.getMessage(), responses.get(1).failureReason());
    }

    @Test
    void 이미_상한을_채운_게시글은_multipart_업로드도_막는다() {
        when(promotionArticleRepository.findActiveById("article-1"))
            .thenReturn(Optional.of(article("article-1", "my-club", images(PromotionArticle.MAX_IMAGE_COUNT))));
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("article-1", file, clubAdmin("my-club")));

        assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
        verify(r2ImageUploadService, never()).upload(any(), any(), any(), any());
        verify(promotionArticleRepository, never()).addImageToActiveArticle(any(), any());
    }

    @Test
    void 수정으로_빠진_이미지는_R2에서_지우고_남은_이미지는_그대로_둔다() {
        givenViewEndpoint();
        String kept = CDN + "/promotion/articles/article-1/2026/09/uuid-kept.png";
        String removed = CDN + "/promotion/articles/article-1/2026/09/uuid-removed.png";

        promotionImageUploadService.deleteRemovedImages("article-1", List.of(kept, removed), List.of(kept));

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertEquals("promotion/articles/article-1/2026/09/uuid-removed.png", captor.getValue().key());
    }

    @Test
    void 이_게시글_경로가_아닌_URL은_지우지_않는다() {
        givenViewEndpoint();
        String otherClubLogo = CDN + "/other-club-id/logo/stolen.png";
        String otherArticle = CDN + "/promotion/articles/article-2/2026/09/uuid-other.png";
        String external = "https://evil.example.com/promotion/articles/article-1/x.png";

        promotionImageUploadService.deleteRemovedImages("article-1",
            List.of(otherClubLogo, otherArticle, external), List.of());

        verify(s3Client, never()).deleteObject(any(DeleteObjectRequest.class));
    }

    private void givenViewEndpoint() {
        when(awsProperties.s3()).thenReturn(new AwsProperties.S3("moadong-dev", "https://r2.example.com", CDN));
        ReflectionTestUtils.invokeMethod(promotionImageUploadService, "init");
    }

    private static List<String> images(int count) {
        return java.util.stream.IntStream.range(0, count).mapToObj(i -> "image-" + i).toList();
    }

    private void givenPresigner() {
        AwsProperties.S3 s3 = new AwsProperties.S3("moadong-dev", "https://r2.example.com", "https://cdn.example.com/");
        when(awsProperties.s3()).thenReturn(s3);
        when(serverProperties.fileUrl()).thenReturn(new ServerProperties.FileUrl(200, 10));
        // @PostConstruct는 단위 테스트에서 호출되지 않는다.
        ReflectionTestUtils.invokeMethod(promotionImageUploadService, "init");
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
            PresignedPutObjectRequest presigned = mock(PresignedPutObjectRequest.class);
            when(presigned.url()).thenReturn(new URL("https://r2.example.com/upload?sig=abc"));
            return presigned;
        });
    }

    private static PromotionArticle article(String id, String clubId) {
        return article(id, clubId, List.of());
    }

    private static PromotionArticle article(String id, String clubId, List<String> images) {
        return PromotionArticle.builder().id(id).clubId(clubId).images(images).build();
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
