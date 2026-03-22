package moadong.media.service;

import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@UnitTest
@ExtendWith(MockitoExtension.class)
class R2ImageUploadServiceTest {

    @InjectMocks
    private R2ImageUploadService r2ImageUploadService;

    @Mock
    private S3Client s3Client;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(r2ImageUploadService, "maxImageSizeBytes", 1024L);
    }

    @Test
    void 대문자_ContentType도_정규화해서_저장한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.png",
            "IMAGE/PNG",
            "image".getBytes()
        );

        r2ImageUploadService.upload(file, "bucket", "https://cdn.example.com/", "web/banner.png");

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));
        assertEquals("image/png", requestCaptor.getValue().contentType());
    }

    @Test
    void 지원하지_않는_ContentType이면_예외를_던진다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.png",
            "image/svg+xml",
            "image".getBytes()
        );

        RestApiException exception = assertThrows(RestApiException.class,
            () -> r2ImageUploadService.upload(file, "bucket", "https://cdn.example.com/", "web/banner.png"));

        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE, exception.getErrorCode());
    }

    @Test
    void SDK_클라이언트_예외도_IMAGE_UPLOAD_FAILED로_변환한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.png",
            "image/png",
            "image".getBytes()
        );
        doThrow(SdkClientException.create("network error"))
            .when(s3Client)
            .putObject(any(PutObjectRequest.class), any(RequestBody.class));

        RestApiException exception = assertThrows(RestApiException.class,
            () -> r2ImageUploadService.upload(file, "bucket", "https://cdn.example.com/", "web/banner.png"));

        assertEquals(ErrorCode.IMAGE_UPLOAD_FAILED, exception.getErrorCode());
    }

    @Test
    void 터키어_로케일에서도_확장자와_ContentType을_정상_처리한다() {
        Locale defaultLocale = Locale.getDefault();
        Locale.setDefault(Locale.forLanguageTag("tr-TR"));
        try {
            MockMultipartFile file = new MockMultipartFile(
                "file",
                "banner.GIF",
                "IMAGE/GIF",
                "image".getBytes()
            );

            r2ImageUploadService.upload(file, "bucket", "https://cdn.example.com/", "web/banner.GIF");

            ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
            verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));
            assertEquals("image/gif", requestCaptor.getValue().contentType());
        } finally {
            Locale.setDefault(defaultLocale);
        }
    }
}
