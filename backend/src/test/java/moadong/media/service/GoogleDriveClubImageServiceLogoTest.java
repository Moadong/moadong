package moadong.media.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

import com.google.api.services.drive.Drive;
import java.lang.reflect.Method;
import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.domain.FileType;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class GoogleDriveClubImageServiceLogoTest {

    @Spy
    @InjectMocks
    private GoogleDriveClubImageService clubImageService;

    @Mock
    private Drive googleDrive;

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

    // updateLogo
    @Test
    void 로고를_업데이트하면_uploadFile메서드를_호출하고_예외를_발생시킨다() {
        // given
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.of(club));
//        doReturn( "https://drive.google.com/file/d/" + club.getId() + "/LOGO/" + mockFile.getOriginalFilename() + "/view" )
//                .when(clubImageService).uploadFile(any(), eq(mockFile), eq(FileType.LOGO));

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.uploadLogo(objectId.toHexString(), mockFile));
        assertEquals(ErrorCode.IMAGE_UPLOAD_FAILED, exception.getErrorCode());

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
}
