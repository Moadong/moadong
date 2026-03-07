package moadong.media.service;

import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.BannerImageUploadResponse;
import moadong.media.enums.PlatformType;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@UnitTest
@ExtendWith(MockitoExtension.class)
class BannerImageUploadServiceTest {

    @Spy
    @InjectMocks
    private BannerImageUploadService bannerImageUploadService;

    @Mock
    private S3Client s3Client;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(bannerImageUploadService, "bannerBucketName", "banner-bucket");
        ReflectionTestUtils.setField(bannerImageUploadService, "bannerViewEndpoint", "https://cdn.example.com/");
        ReflectionTestUtils.setField(bannerImageUploadService, "maxImageSizeBytes", 1024L);
        ReflectionTestUtils.invokeMethod(bannerImageUploadService, "init");
    }

    @Test
    void 정상_이미지를_업로드하면_배너_버킷_URL을_반환한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.png",
            "image/png",
            "banner-image".getBytes()
        );

        BannerImageUploadResponse response = bannerImageUploadService.upload(file, PlatformType.WEB);

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));

        assertEquals("banner-bucket", requestCaptor.getValue().bucket());
        assertEquals("image/png", requestCaptor.getValue().contentType());
        assertEquals("web/banner.png", requestCaptor.getValue().key());
        assertEquals("https://cdn.example.com/web/banner.png", response.imageUrl());
    }

    @Test
    void 확장자가_이미지가_아니면_UNSUPPORTED_FILE_TYPE을_반환한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.txt",
            "text/plain",
            "not-image".getBytes()
        );

        RestApiException exception = assertThrows(RestApiException.class, () -> bannerImageUploadService.upload(file, PlatformType.WEB));

        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE, exception.getErrorCode());
    }

    @Test
    void 최대_용량을_초과하면_FILE_TOO_LARGE를_반환한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.webp",
            "image/webp",
            new byte[2048]
        );

        RestApiException exception = assertThrows(RestApiException.class, () -> bannerImageUploadService.upload(file, PlatformType.WEB));

        assertEquals(ErrorCode.FILE_TOO_LARGE, exception.getErrorCode());
    }
}
