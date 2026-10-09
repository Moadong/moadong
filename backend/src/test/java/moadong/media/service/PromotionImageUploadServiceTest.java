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
import org.springframework.util.unit.DataSize;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
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
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
@ExtendWith(MockitoExtension.class)
class PromotionImageUploadServiceTest {

    private static final String CDN = "https://cdn.example.com";
    private static final String CLUB_PREFIX = "/promotion/club-1/2026/09/";

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

    // ─────────────────────────── multipart 업로드 ───────────────────────────

    @Test
    void 홍보이미지_업로드시_동아리_prefix로_저장하고_게시글_이미지목록에_추가한다() {
        String articleId = "article-1";
        MockMultipartFile file = new MockMultipartFile("file", "poster main.png", "image/png", "img".getBytes());
        String uploadedUrl = CDN + "/promotion/club-1/2026/03/uuid-poster_main.png";
        when(awsProperties.s3()).thenReturn(new AwsProperties.S3("moadong-dev", "https://r2.example.com", CDN));
        when(promotionArticleRepository.findActiveById(articleId)).thenReturn(Optional.of(article(articleId, "club-1")));
        when(r2ImageUploadService.upload(eq(file), eq("moadong-dev"), eq(CDN), startsWith("promotion/club-1/")))
            .thenReturn(uploadedUrl);
        when(promotionArticleRepository.addImageToActiveArticle(articleId, uploadedUrl)).thenReturn(1L);

        PromotionImageUploadResponse response = promotionImageUploadService.upload(articleId, file, developer());

        verify(r2ImageUploadService).upload(eq(file), eq("moadong-dev"), eq(CDN), startsWith("promotion/club-1/"));
        verify(promotionArticleRepository).addImageToActiveArticle(articleId, uploadedUrl);
        verify(promotionArticleRepository, never()).save(any());
        assertEquals(uploadedUrl, response.imageUrl());
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
    void 동아리관리자는_다른_동아리_게시글에_이미지를_업로드할_수_없다() {
        when(promotionArticleRepository.findActiveById("article-1")).thenReturn(Optional.of(article("article-1", "other-club")));
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload("article-1", file, clubAdmin("my-club")));

        assertEquals(ErrorCode.USER_UNAUTHORIZED, exception.getErrorCode());
        verify(r2ImageUploadService, never()).upload(any(), any(), any(), any());
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
    void 동시_업로드로_상한을_넘기면_방금_올린_객체를_지우고_실패시킨다() {
        String articleId = "article-1";
        MockMultipartFile file = new MockMultipartFile("file", "poster.png", "image/png", "img".getBytes());
        givenViewEndpoint();
        String uploadedUrl = CDN + "/promotion/club-1/2026/09/uuid-poster.png";
        when(promotionArticleRepository.findActiveById(articleId)).thenReturn(Optional.of(article(articleId, "club-1")));
        when(r2ImageUploadService.upload(eq(file), eq("moadong-dev"), eq(CDN), startsWith("promotion/club-1/")))
            .thenReturn(uploadedUrl);
        when(promotionArticleRepository.addImageToActiveArticle(eq(articleId), eq(uploadedUrl))).thenReturn(0L);

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.upload(articleId, file, clubAdmin("club-1")));

        assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertTrue(captor.getValue().key().startsWith("promotion/club-1/"));
    }

    // ─────────────────────────── presigned URL 발급 ───────────────────────────

    /**
     * 키가 동아리 기준이라 게시글을 조회하지 않는다. 한 번의 요청으로 생성하면서 이미지를
     * 넣을 수 있게 해주는 핵심이다.
     */
    @Test
    void 게시글이_없어도_업로드URL을_발급한다() {
        givenPresigner();

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            "club-1", List.of(new UploadUrlRequest("poster.png", "image/png")), clubAdmin("club-1"));

        assertEquals(1, responses.size());
        assertTrue(responses.get(0).success());
        assertTrue(responses.get(0).finalUrl().startsWith(CDN + "/promotion/club-1/"));
        verify(promotionArticleRepository, never()).findActiveById(any());
    }

    @Test
    void 동아리관리자는_clubId를_보내도_본인_동아리로_발급된다() {
        givenPresigner();

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            "other-club", List.of(new UploadUrlRequest("poster.png", "image/png")), clubAdmin("club-1"));

        assertTrue(responses.get(0).finalUrl().startsWith(CDN + "/promotion/club-1/"));
    }

    @Test
    void 지원하지_않는_확장자와_contentType은_그_항목만_실패한다() {
        givenPresigner();

        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(
            "club-1",
            List.of(new UploadUrlRequest("poster.txt", "image/png"), new UploadUrlRequest("poster.png", "image/png")),
            clubAdmin("club-1"));

        assertEquals(2, responses.size());
        assertFalse(responses.get(0).success());
        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE.getMessage(), responses.get(0).failureReason());
        assertTrue(responses.get(1).success());
    }

    /** 잔여분 개념이 없어졌다. 최종 개수는 게시글 저장이 막는다. */
    @Test
    void 상한을_넘는_요청은_전체를_거부한다() {
        List<UploadUrlRequest> requests = images(PromotionArticle.MAX_IMAGE_COUNT + 1).stream()
            .map(name -> new UploadUrlRequest(name + ".png", "image/png"))
            .toList();

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.createUploadUrls("club-1", requests, clubAdmin("club-1")));

        assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
        verify(s3Presigner, never()).presignPutObject(any(PutObjectPresignRequest.class));
    }

    @Test
    void 동아리가_정해지지_않으면_업로드URL을_받을_수_없다() {
        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.createUploadUrls(null,
                List.of(new UploadUrlRequest("poster.png", "image/png")), developer()));

        assertEquals(ErrorCode.USER_UNAUTHORIZED, exception.getErrorCode());
    }

    // ─────────────────────────── 저장 검증 ───────────────────────────

    @Test
    void 이_동아리_경로에_올라온_이미지는_검증을_통과한다() {
        givenViewEndpoint();
        givenValidationProperties();
        when(s3Client.headObject(any(HeadObjectRequest.class)))
            .thenReturn(HeadObjectResponse.builder().contentLength(1024L).build());

        promotionImageUploadService.validateImages(
            "club-1", List.of(CDN + CLUB_PREFIX + "uuid-poster.png"), List.of());

        ArgumentCaptor<HeadObjectRequest> captor = ArgumentCaptor.forClass(HeadObjectRequest.class);
        verify(s3Client).headObject(captor.capture());
        assertEquals("promotion/club-1/2026/09/uuid-poster.png", captor.getValue().key());
    }

    @Test
    void 외부_도메인_URL은_저장할_수_없다() {
        assertRejected("https://evil.example.com/tracking-pixel.gif", ErrorCode.INVALID_FILE_URL);
    }

    @Test
    void 다른_동아리_경로의_이미지는_저장할_수_없다() {
        assertRejected(CDN + "/promotion/club-2/2026/09/uuid-other.png", ErrorCode.INVALID_FILE_URL);
    }

    @Test
    void 타_동아리_로고_URL은_저장할_수_없다() {
        assertRejected(CDN + "/other-club-id/logo/stolen.png", ErrorCode.INVALID_FILE_URL);
    }

    /** 구 키(promotion/articles/...)는 새 접두사와 달라 새로 주장할 수 없다. */
    @Test
    void 구_키를_새로_주장하면_거부한다() {
        assertRejected(CDN + "/promotion/articles/article-1/2026/09/uuid-legacy.png", ErrorCode.INVALID_FILE_URL);
    }

    @Test
    void 업로드하지_않은_키는_저장할_수_없다() {
        givenViewEndpoint();
        givenValidationProperties();
        when(s3Client.headObject(any(HeadObjectRequest.class)))
            .thenThrow(NoSuchKeyException.builder().build());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.validateImages(
                "club-1", List.of(CDN + CLUB_PREFIX + "does-not-exist.png"), List.of()));

        assertEquals(ErrorCode.FILE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 상한을_넘는_이미지는_저장을_막고_R2에서_지운다() {
        givenViewEndpoint();
        givenValidationProperties();
        when(s3Client.headObject(any(HeadObjectRequest.class)))
            .thenReturn(HeadObjectResponse.builder()
                .contentLength(DataSize.ofMegabytes(10).toBytes() + 1).build());

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.validateImages(
                "club-1", List.of(CDN + CLUB_PREFIX + "uuid-huge.png"), List.of()));

        assertEquals(ErrorCode.FILE_TOO_LARGE, exception.getErrorCode());
        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertEquals("promotion/club-1/2026/09/uuid-huge.png", captor.getValue().key());
    }

    @Test
    void 이미지가_없으면_R2를_호출하지_않는다() {
        promotionImageUploadService.validateImages("club-1", List.of(), List.of());
        promotionImageUploadService.validateImages("club-1", null, null);

        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    /**
     * 구 키로 저장된 이미지는 상한을 넘거나 R2에서 사라졌을 수 있다. 제목만 고치는 수정에서
     * 그걸 다시 검사하면 살아 있는 이미지를 지우거나 그 게시글이 영영 수정 불가가 된다.
     */
    @Test
    void 이미_저장돼_있던_URL은_다시_검증하지_않는다() {
        givenViewEndpoint();
        String legacy = CDN + "/promotion/articles/article-1/2026/09/uuid-legacy-huge.png";

        promotionImageUploadService.validateImages("club-1", List.of(legacy), List.of(legacy));

        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
        verify(s3Client, never()).deleteObject(any(DeleteObjectRequest.class));
    }

    @Test
    void 기존_URL은_건너뛰되_새로_추가된_URL은_검증한다() {
        givenViewEndpoint();
        givenValidationProperties();
        String legacy = CDN + "/promotion/articles/article-1/2026/09/uuid-legacy.png";

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.validateImages("club-1",
                List.of(legacy, "https://evil.example.com/new.png"), List.of(legacy)));

        assertEquals(ErrorCode.INVALID_FILE_URL, exception.getErrorCode());
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    // ─────────────────────────── 빠진 이미지 삭제 ───────────────────────────

    @Test
    void 수정으로_빠진_이미지는_R2에서_지우고_남은_이미지는_그대로_둔다() {
        givenViewEndpoint();
        String kept = CDN + CLUB_PREFIX + "uuid-kept.png";
        String removed = CDN + CLUB_PREFIX + "uuid-removed.png";

        promotionImageUploadService.deleteRemovedImages("article-1", List.of(kept, removed), List.of(kept));

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertEquals("promotion/club-1/2026/09/uuid-removed.png", captor.getValue().key());
    }

    /** 구 키로 저장된 이미지도 지워야 고아로 남지 않는다. */
    @Test
    void 구_키로_저장된_이미지도_지운다() {
        givenViewEndpoint();
        String legacy = CDN + "/promotion/articles/article-1/2026/09/uuid-legacy.png";

        promotionImageUploadService.deleteRemovedImages("article-1", List.of(legacy), List.of());

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());
        assertEquals("promotion/articles/article-1/2026/09/uuid-legacy.png", captor.getValue().key());
    }

    /**
     * 키가 동아리 기준이라 같은 동아리의 다른 게시글 이미지도 접두사가 일치한다.
     * 접두사 대신 실제 참조를 확인해서 막는다.
     */
    @Test
    void 다른_활성_게시글이_쓰는_이미지는_지우지_않는다() {
        givenViewEndpoint();
        String shared = CDN + CLUB_PREFIX + "uuid-shared.png";
        when(promotionArticleRepository.existsOtherActiveArticleWithImage(shared, "article-1")).thenReturn(true);

        promotionImageUploadService.deleteRemovedImages("article-1", List.of(shared), List.of());

        verify(s3Client, never()).deleteObject(any(DeleteObjectRequest.class));
    }

    @Test
    void 홍보_경로가_아닌_URL은_지우지_않는다() {
        givenViewEndpoint();
        String otherClubLogo = CDN + "/other-club-id/logo/stolen.png";
        String external = "https://evil.example.com/promotion/club-1/x.png";

        promotionImageUploadService.deleteRemovedImages("article-1", List.of(otherClubLogo, external), List.of());

        verify(s3Client, never()).deleteObject(any(DeleteObjectRequest.class));
    }

    // ─────────────────────────── 헬퍼 ───────────────────────────

    private void givenViewEndpoint() {
        when(awsProperties.s3()).thenReturn(new AwsProperties.S3("moadong-dev", "https://r2.example.com", CDN));
        ReflectionTestUtils.invokeMethod(promotionImageUploadService, "init");
    }

    private void givenPresigner() {
        when(awsProperties.s3()).thenReturn(new AwsProperties.S3("moadong-dev", "https://r2.example.com", CDN));
        when(serverProperties.fileUrl()).thenReturn(new ServerProperties.FileUrl(200, 10));
        // @PostConstruct는 단위 테스트에서 호출되지 않는다.
        ReflectionTestUtils.invokeMethod(promotionImageUploadService, "init");
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
            PresignedPutObjectRequest presigned = mock(PresignedPutObjectRequest.class);
            when(presigned.url()).thenReturn(new URL("https://r2.example.com/upload?sig=abc"));
            return presigned;
        });
    }

    private void givenValidationProperties() {
        lenient().when(serverProperties.fileUrl()).thenReturn(new ServerProperties.FileUrl(200, 10));
        lenient().when(serverProperties.image()).thenReturn(new ServerProperties.Image(DataSize.ofMegabytes(10)));
    }

    /** 접두사 검사에서 걸리면 R2를 호출하지 않는다. */
    private void assertRejected(String imageUrl, ErrorCode expected) {
        givenViewEndpoint();
        givenValidationProperties();

        RestApiException exception = assertThrows(RestApiException.class,
            () -> promotionImageUploadService.validateImages("club-1", List.of(imageUrl), List.of()));

        assertEquals(expected, exception.getErrorCode());
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    private static List<String> images(int count) {
        return java.util.stream.IntStream.range(0, count).mapToObj(i -> "image-" + i).toList();
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
