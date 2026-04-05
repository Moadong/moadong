package moadong.media.service;

import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.BannerImageUploadResponse;
import moadong.media.enums.PlatformType;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
@ExtendWith(MockitoExtension.class)
class BannerImageUploadServiceTest {

    @InjectMocks
    private BannerImageUploadService bannerImageUploadService;

    @Mock
    private R2ImageUploadService r2ImageUploadService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(bannerImageUploadService, "bannerBucketName", "banner-bucket");
        ReflectionTestUtils.setField(bannerImageUploadService, "bannerViewEndpoint", "https://cdn.example.com/");
    }

    @Test
    void 정상_이미지를_업로드하면_배너_버킷_URL을_반환한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner.png",
            "image/png",
            "banner-image".getBytes()
        );
        when(r2ImageUploadService.upload(file, "banner-bucket", "https://cdn.example.com/", "web/banner.png"))
            .thenReturn("https://cdn.example.com/web/banner.png");

        BannerImageUploadResponse response = bannerImageUploadService.upload(file, PlatformType.WEB);

        verify(r2ImageUploadService).upload(file, "banner-bucket", "https://cdn.example.com/", "web/banner.png");
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
        when(r2ImageUploadService.upload(file, "banner-bucket", "https://cdn.example.com/", "web/banner.txt"))
            .thenThrow(new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE));

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
        when(r2ImageUploadService.upload(file, "banner-bucket", "https://cdn.example.com/", "web/banner.webp"))
            .thenThrow(new RestApiException(ErrorCode.FILE_TOO_LARGE));

        RestApiException exception = assertThrows(RestApiException.class, () -> bannerImageUploadService.upload(file, PlatformType.WEB));

        assertEquals(ErrorCode.FILE_TOO_LARGE, exception.getErrorCode());
    }

    @Test
    void 배너_파일명에_예약문자가_있으면_정규화해서_업로드한다() {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "banner #1?.png",
            "image/png",
            "banner-image".getBytes()
        );
        when(r2ImageUploadService.upload(file, "banner-bucket", "https://cdn.example.com/", "web/banner__1_.png"))
            .thenReturn("https://cdn.example.com/web/banner__1_.png");

        BannerImageUploadResponse response = bannerImageUploadService.upload(file, PlatformType.WEB);

        verify(r2ImageUploadService).upload(file, "banner-bucket", "https://cdn.example.com/", "web/banner__1_.png");
        assertEquals("https://cdn.example.com/web/banner__1_.png", response.imageUrl());
    }
}
