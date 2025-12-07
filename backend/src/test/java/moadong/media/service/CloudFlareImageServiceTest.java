package moadong.media.service;

import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@UnitTest
@ExtendWith(MockitoExtension.class)
public class CloudFlareImageServiceTest {

    @Spy
    @InjectMocks
    CloudflareImageService cloudflareImageService;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private S3Client s3Client;

    @Mock
    private S3Presigner s3Presigner;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cloudflareImageService, "viewEndpoint", "https://cdn.example.com/");
        ReflectionTestUtils.setField(cloudflareImageService, "bucketName", "test-bucket");
        ReflectionTestUtils.invokeMethod(cloudflareImageService, "init");
    }


    @Test
    void 잘못된_이름을_넣으면_UNSUPPORTED_FILE_TYPE_을_반환한다(){
        //given
        String fileName = "Hello";
        //when
        RestApiException exception = assertThrows(RestApiException.class,
                () -> ReflectionTestUtils.invokeMethod(cloudflareImageService, "validateFileName", fileName));
        //then
        assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE, exception.getErrorCode());
    }

    @Test
    void File_이름이_비어있으면_FILE_NOT_FOUND를_반환한다() {
        //given
        //이름이 비어있는 파일
        String emptyFileName = "";
        //when
        //이름이 비어있는 파일을 넣었을 때
        RestApiException exception = assertThrows(RestApiException.class,
                () -> ReflectionTestUtils.invokeMethod(cloudflareImageService, "validateFileName", emptyFileName));
        //then
        //에러코드가 같아야함
        assertEquals(ErrorCode.FILE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 잘못된_filePath_일때_deleteFile_을_실패한다 (){
        //given
        Club club = new Club();
        String filePath = null;
        //when
        cloudflareImageService.deleteFile(club, filePath);
        //then
        verify(s3Client, never()).deleteObject(any(DeleteObjectRequest.class));
    }

    @Test
    void  접두_불일치면_deleteFile_을_실패한다 (){
        //given
        Club club = new Club();
        String wrongFilePath ="https://other.example.com/club123/logo/abc.png";

        //when
        cloudflareImageService.deleteFile(club, wrongFilePath);
        //then
        verify(s3Client, never()).deleteObject(any(DeleteObjectRequest.class));
    }

    @Test
    void  정상_url이면_삭제_성공 () {
        //given
        Club club = new Club();
        String filePath = "https://cdn.example.com/club123/logo/abc.png";

        //when
        cloudflareImageService.deleteFile(club, filePath);

        //then
        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());

        assertEquals("test-bucket", captor.getValue().bucket());
        assertEquals("club123/logo/abc.png", captor.getValue().key());
    }
}
