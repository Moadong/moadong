package moadong.feedback.service;

import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.util.unit.DataSize;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FeedbackImageServiceTest {

    private static final String STUDENT_ID = "11111111-1111-1111-1111-111111111111";
    private static final String OTHER_STUDENT_ID = "22222222-2222-2222-2222-222222222222";
    private static final String VIEW_ENDPOINT = "https://cdn.moadong.com";
    private static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;
    private static final String CLIENT_IP = "203.0.113.10";

    @Mock
    private S3Client s3Client;

    @Mock
    private S3Presigner s3Presigner;

    @Mock
    private StringRedisTemplate stringRedisTemplate;

    private FeedbackImageService feedbackImageService;

    @BeforeEach
    void setUp() {
        AwsProperties awsProperties = new AwsProperties(
                new AwsProperties.Credentials("access", "secret"),
                // 후행 슬래시가 정규화되는지도 함께 확인한다.
                new AwsProperties.S3("moadong-bucket", "https://r2.example.com", VIEW_ENDPOINT + "/"));
        ServerProperties serverProperties = new ServerProperties(
                "moadong.com",
                new ServerProperties.Feed(5),
                new ServerProperties.Image(DataSize.ofBytes(MAX_IMAGE_BYTES)),
                new ServerProperties.FileUrl(200, 10));

        feedbackImageService = new FeedbackImageService(
                s3Client, s3Presigner, awsProperties, serverProperties, stringRedisTemplate);
        ReflectionTestUtils.invokeMethod(feedbackImageService, "init");
    }

    private List<PresignedUploadResponse> createUploadUrls(List<UploadUrlRequest> requests) {
        return feedbackImageService.createUploadUrls(STUDENT_ID, requests, CLIENT_IP);
    }

    private String myImageUrl(String fileName) {
        return VIEW_ENDPOINT + "/feedback/" + STUDENT_ID + "/" + fileName;
    }

    private void givenObjectSize(long contentLength) {
        when(s3Client.headObject(any(HeadObjectRequest.class)))
                .thenReturn(HeadObjectResponse.builder().contentLength(contentLength).build());
    }

    @Test
    void 업로드_URL은_요청한_개수만큼_발급된다() {
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
            PresignedPutObjectRequest presigned = org.mockito.Mockito.mock(PresignedPutObjectRequest.class);
            when(presigned.url()).thenReturn(new java.net.URL("https://r2.example.com/upload?sig=abc"));
            return presigned;
        });

        List<PresignedUploadResponse> responses = createUploadUrls(List.of(
                new UploadUrlRequest("a.jpg", "image/jpeg"),
                new UploadUrlRequest("b.png", "image/png")));

        assertEquals(2, responses.size());
        assertTrue(responses.get(0).success());
        assertTrue(responses.get(0).finalUrl().startsWith(VIEW_ENDPOINT + "/feedback/" + STUDENT_ID + "/"));
        assertTrue(responses.get(0).finalUrl().endsWith(".jpg"));
        assertTrue(responses.get(1).finalUrl().endsWith(".png"));
    }

    @Test
    void 지원하지_않는_확장자는_그_항목만_실패한다() {
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
            PresignedPutObjectRequest presigned = org.mockito.Mockito.mock(PresignedPutObjectRequest.class);
            when(presigned.url()).thenReturn(new java.net.URL("https://r2.example.com/upload?sig=abc"));
            return presigned;
        });

        List<PresignedUploadResponse> responses = createUploadUrls(List.of(
                new UploadUrlRequest("a.jpg", "image/jpeg"),
                new UploadUrlRequest("bad.txt", "image/jpeg")));

        assertTrue(responses.get(0).success());
        assertFalse(responses.get(1).success());
        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE.getMessage(), responses.get(1).failureReason());
    }

    @Test
    void 상한을_넘게_요청하면_앞의_4건만_발급하고_실패_항목을_덧붙인다() {
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
            PresignedPutObjectRequest presigned = org.mockito.Mockito.mock(PresignedPutObjectRequest.class);
            when(presigned.url()).thenReturn(new java.net.URL("https://r2.example.com/upload?sig=abc"));
            return presigned;
        });

        List<PresignedUploadResponse> responses = createUploadUrls(List.of(
                new UploadUrlRequest("a.jpg", "image/jpeg"),
                new UploadUrlRequest("b.jpg", "image/jpeg"),
                new UploadUrlRequest("c.jpg", "image/jpeg"),
                new UploadUrlRequest("d.jpg", "image/jpeg"),
                new UploadUrlRequest("e.jpg", "image/jpeg")));

        assertEquals(5, responses.size());
        assertEquals(4, responses.stream().filter(PresignedUploadResponse::success).count());
        assertEquals(ErrorCode.TOO_MANY_FILES.getMessage(), responses.get(4).failureReason());
    }

    @Test
    void 발급_요청이_창_한도를_넘으면_거부한다() {
        when(stringRedisTemplate.execute(any(RedisScript.class), any(), any())).thenReturn(41L);

        RestApiException exception = assertThrows(RestApiException.class,
                () -> createUploadUrls(List.of(new UploadUrlRequest("a.jpg", "image/jpeg"))));

        assertEquals(ErrorCode.FEEDBACK_IMAGE_UPLOAD_RATE_LIMITED, exception.getErrorCode());
        verify(s3Presigner, never()).presignPutObject(any(PutObjectPresignRequest.class));
    }

    @Test
    void 발급_요청은_studentId와_IP_양쪽_창을_모두_센다() {
        when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
            PresignedPutObjectRequest presigned = org.mockito.Mockito.mock(PresignedPutObjectRequest.class);
            when(presigned.url()).thenReturn(new java.net.URL("https://r2.example.com/upload?sig=abc"));
            return presigned;
        });

        createUploadUrls(List.of(new UploadUrlRequest("a.jpg", "image/jpeg")));

        ArgumentCaptor<List> keysCaptor = ArgumentCaptor.forClass(List.class);
        verify(stringRedisTemplate, org.mockito.Mockito.times(2))
                .execute(any(RedisScript.class), keysCaptor.capture(), any());
        List<String> countedKeys = keysCaptor.getAllValues().stream()
                .map(keys -> (String) keys.get(0))
                .toList();
        assertTrue(countedKeys.get(0).endsWith("student:" + STUDENT_ID), countedKeys.toString());
        assertTrue(countedKeys.get(1).endsWith("ip:" + CLIENT_IP), countedKeys.toString());
    }

    @Test
    void 사진이_없으면_빈_목록을_반환한다() {
        assertTrue(feedbackImageService.validateImages(STUDENT_ID, null).isEmpty());
        assertTrue(feedbackImageService.validateImages(STUDENT_ID, List.of()).isEmpty());
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    @Test
    void 정상적인_사진은_그대로_통과한다() {
        givenObjectSize(1024);
        List<String> images = List.of(myImageUrl("aaaaaaaaaa.jpg"), myImageUrl("bbbbbbbbbb.png"));

        assertEquals(images, feedbackImageService.validateImages(STUDENT_ID, images));
    }

    @Test
    void 사진이_4장을_넘으면_거부한다() {
        List<String> images = List.of(
                myImageUrl("a.jpg"), myImageUrl("b.jpg"), myImageUrl("c.jpg"),
                myImageUrl("d.jpg"), myImageUrl("e.jpg"));

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, images));

        assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    @Test
    void 남의_경로에_있는_사진은_첨부할_수_없다() {
        String othersUrl = VIEW_ENDPOINT + "/feedback/" + OTHER_STUDENT_ID + "/aaaaaaaaaa.jpg";

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, List.of(othersUrl)));

        assertEquals(ErrorCode.INVALID_FILE_URL, exception.getErrorCode());
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    @Test
    void 다른_도메인의_URL은_첨부할_수_없다() {
        String foreignUrl = "https://evil.example.com/feedback/" + STUDENT_ID + "/aaaaaaaaaa.jpg";

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, List.of(foreignUrl)));

        assertEquals(ErrorCode.INVALID_FILE_URL, exception.getErrorCode());
    }

    @Test
    void 다른_기능의_경로로_우회할_수_없다() {
        String clubFeedUrl = VIEW_ENDPOINT + "/someClubId/feed/aaaaaaaaaa.jpg";

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, List.of(clubFeedUrl)));

        assertEquals(ErrorCode.INVALID_FILE_URL, exception.getErrorCode());
    }

    @Test
    void 실제로_업로드되지_않은_사진은_거부한다() {
        when(s3Client.headObject(any(HeadObjectRequest.class))).thenThrow(NoSuchKeyException.builder().build());

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, List.of(myImageUrl("aaaaaaaaaa.jpg"))));

        assertEquals(ErrorCode.FILE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 용량을_초과한_사진은_R2에서_삭제하고_거부한다() {
        givenObjectSize(MAX_IMAGE_BYTES + 1);

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, List.of(myImageUrl("aaaaaaaaaa.jpg"))));

        assertEquals(ErrorCode.FILE_TOO_LARGE, exception.getErrorCode());
        ArgumentCaptor<DeleteObjectRequest> deleteCaptor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(deleteCaptor.capture());
        assertEquals("feedback/" + STUDENT_ID + "/aaaaaaaaaa.jpg", deleteCaptor.getValue().key());
    }

    @Test
    void URL이_너무_길면_거부한다() {
        String longUrl = myImageUrl("a".repeat(200) + ".jpg");

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackImageService.validateImages(STUDENT_ID, List.of(longUrl)));

        assertEquals(ErrorCode.INVALID_FILE_URL, exception.getErrorCode());
    }
}
