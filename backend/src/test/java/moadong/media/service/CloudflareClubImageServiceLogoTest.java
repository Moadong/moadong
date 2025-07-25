package moadong.media.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

import com.google.api.services.drive.Drive;
import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.util.ClubImageUtil;
import moadong.util.annotations.UnitTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@UnitTest
class CloudflareClubImageServiceLogoTest {

    @Spy
    @InjectMocks
    private CloudflareImageService clubImageService;

    @Mock
    private ClubRepository clubRepository;

    private Club club;

    private ObjectId objectId;

    private final MultipartFile mockFile = new MockMultipartFile(
            "testFile", "testFile.jpg", "image/jpeg", "test".getBytes());

    @BeforeEach
    void setUp() throws NoSuchMethodException {
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .logo(null)
                .build();
        club = Club.builder().clubRecruitmentInformation(info).build();
        objectId = new ObjectId();
    }

    @Test
    void logo를_업로드할_club이_존재하지_않는다면_CLUB_NOT_FOUND를_반환한다() {
        // given
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.empty());

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.uploadLogo(objectId.toHexString(), mockFile));
        assertEquals(ErrorCode.CLUB_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 업로드하는_파일이_없다면_FILE_NOT_FOUND를_반환한다() {
        // given
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.of(club));

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.uploadLogo(objectId.toHexString(), null));
        assertEquals(ErrorCode.FILE_NOT_FOUND, exception.getErrorCode());
    }

    // deleteLogo
    @Test
    void 로고를_삭제하면_logo값이_null이_된다() {
        // given
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .logo("test link")
                .build();
        club = Club.builder().clubRecruitmentInformation(info).build();
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.of(club));
        doNothing().when(clubImageService).deleteFile(club, "test link");

        // when
        clubImageService.deleteLogo(objectId.toHexString());

        // then
        assertNull(club.getClubRecruitmentInformation().getLogo());
    }

    @Test
    void logo를_삭제할_club이_존재하지_않는다면_CLUB_NOT_FOUND를_반환한다() {
        // given
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.empty());

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.deleteLogo(objectId.toHexString()));
        assertEquals(ErrorCode.CLUB_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 파일명에_적절하지않은_기호나_한글이_포함되어있으면_true를_반환한다(){
        // 정상 케이스
        assertFalse(ClubImageUtil.containsInvalidChars("normal-file.jpg"));

        // 한글 포함
        assertTrue(ClubImageUtil.containsInvalidChars("file 이름.png"));

        // 퍼센트 인코딩 포함
        assertTrue(ClubImageUtil.containsInvalidChars("file%20name.png"));
        assertTrue(ClubImageUtil.containsInvalidChars("%3Ahidden.jpg"));

        // 공백 포함
        assertTrue(ClubImageUtil.containsInvalidChars("file name.png"));
        assertTrue(ClubImageUtil.containsInvalidChars(" tab\tname.png"));

        // 여러 조건 섞인 경우
        assertTrue(ClubImageUtil.containsInvalidChars("%22한글 space.png"));
    }
}
