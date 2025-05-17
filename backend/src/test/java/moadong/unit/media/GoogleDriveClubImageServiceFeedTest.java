package moadong.unit.media;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import com.google.api.services.drive.Drive;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.service.GoogleDriveClubImageService;
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
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@UnitTest
class GoogleDriveClubImageServiceFeedTest {

    @Spy
    @InjectMocks
    private GoogleDriveClubImageService clubImageService;

    @Mock
    private Drive googleDrive;

    @Mock
    private ClubRepository clubRepository;

    private final int MAX_FEED_COUNT = 5;

    private Club club;

    private ObjectId objectId;

    private final MultipartFile mockFile = new MockMultipartFile(
            "testFile", "testFile.jpg", "image/jpeg", "test".getBytes());

    @BeforeEach
    void setUp() {
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .feedImages(List.of())
                .build();
        club = Club.builder().clubRecruitmentInformation(info).build();
        objectId = new ObjectId();
        ReflectionTestUtils.setField(clubImageService, "MAX_FEED_COUNT", 5);
    }

    // uploadFeed
    @Test
    void MAX_FEED_COUNT_이상의_피드를_업로드하면_TOO_MANY_FILES를_반환한다() {
        // given
        List<String> feedImages = Arrays.asList(new String[MAX_FEED_COUNT]);
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .feedImages(feedImages)
                .build();
        club = Club.builder().clubRecruitmentInformation(info).build();
        when(clubRepository.findClubById(any())).thenReturn(Optional.of(club));

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.uploadFeed(objectId.toHexString(), mockFile));
        assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
    }

    @Test
    void feed를_업로드할_club이_존재하지_않는다면_CLUB_NOT_FOUND를_반환한다() {
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.empty());
        assertThrows(RestApiException.class, () -> clubImageService.uploadFeed(objectId.toHexString(), mockFile));
    }

    // updateFeeds
    @Test
    void 새로운_feed_리스트를_넣으면_정상적으로_저장된다() {
        // given
        List<String> feedImages = List.of("old1.jpg", "old2.jpg");
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .feedImages(feedImages)
                .build();
        club = Club.builder().clubRecruitmentInformation(info).build();
        List<String> newList = List.of("new1.jpg");
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.of(club));
        doNothing().when(clubImageService).deleteFile(eq(club), any());

        // when
        clubImageService.updateFeeds(objectId.toHexString(), newList);

        // then
        assertIterableEquals(newList, club.getClubRecruitmentInformation().getFeedImages());

    }

    @Test
    void feed를_삭제할_club이_존재하지_않는다면_CLUB_NOT_FOUND를_반환한다() {
        // given
        when(clubRepository.findClubById(objectId)).thenReturn(Optional.empty());

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.updateFeeds(objectId.toHexString(), List.of()));
        assertEquals(ErrorCode.CLUB_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 새로운_feed_리스트가_MAX_FEED_COUNT_이상이면_TOO_MANY_FILES를_반환한다() {
        // given
        when(clubRepository.findClubById(any())).thenReturn(Optional.of(club));
        List<String> tooMany = Arrays.asList(new String[MAX_FEED_COUNT + 1]);

        // when & then
        RestApiException exception = assertThrows(RestApiException.class,
                () -> clubImageService.updateFeeds(objectId.toHexString(), tooMany));
        assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
    }

}
