package moadong.media.webhook;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.media.webhook.dto.ImageConversionCompletedRequest;
import moadong.media.webhook.dto.ImageEntry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ImageConversionCompletedWebhookServiceTest {

    private static final String VIEW_ENDPOINT = "https://cdn.example.com";

    @Mock
    private ClubRepository clubRepository;

    @InjectMocks
    private ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(imageConversionCompletedWebhookService, "viewEndpoint", VIEW_ENDPOINT);
        ReflectionTestUtils.invokeMethod(imageConversionCompletedWebhookService, "init");
    }

    @Test
    void processImageConversionCompleted_이미지가_있으면_매칭되는_Club의_logo를_갱신한다() {
        String source = "clubId/logo/photo.jpg";
        String destination = "clubId/logo/photo.webp";
        String fullUrlOld = VIEW_ENDPOINT + "/" + source;
        String fullUrlNew = VIEW_ENDPOINT + "/" + destination;

        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .logo(fullUrlOld)
                .clubRecruitmentStatus(ClubRecruitmentStatus.OPEN)
                .build();
        Club club = Club.builder()
                .name("test")
                .category("CATEGORY")
                .division("DIVISION")
                .userId("user1")
                .clubRecruitmentInformation(info)
                .build();

        when(clubRepository.findByClubRecruitmentInformation_LogoOrClubRecruitmentInformation_CoverOrClubRecruitmentInformation_FeedImagesContaining(
                eq(fullUrlOld), eq(fullUrlOld), eq(fullUrlOld)))
                .thenReturn(List.of(club));

        ImageConversionCompletedRequest request = new ImageConversionCompletedRequest(
                "batch.completed",
                1,
                0,
                List.of(new ImageEntry(source, destination)));

        imageConversionCompletedWebhookService.processImageConversionCompleted(request);

        verify(clubRepository).findByClubRecruitmentInformation_LogoOrClubRecruitmentInformation_CoverOrClubRecruitmentInformation_FeedImagesContaining(
                fullUrlOld, fullUrlOld, fullUrlOld);
        verify(clubRepository).save(club);
    }

    @Test
    void processImageConversionCompleted_images가_비어있으면_아무것도_하지_않는다() {
        ImageConversionCompletedRequest request = new ImageConversionCompletedRequest(
                "batch.completed",
                0,
                0,
                List.of());

        imageConversionCompletedWebhookService.processImageConversionCompleted(request);

        verify(clubRepository, org.mockito.Mockito.never()).findByClubRecruitmentInformation_LogoOrClubRecruitmentInformation_CoverOrClubRecruitmentInformation_FeedImagesContaining(
                any(), any(), any());
        verify(clubRepository, org.mockito.Mockito.never()).save(any());
    }

    @Test
    void processImageConversionCompleted_source에_dotdot이_포함되면_해당_이미지는_스킵한다() {
        ImageConversionCompletedRequest request = new ImageConversionCompletedRequest(
                "batch.completed",
                1,
                0,
                List.of(new ImageEntry("clubId/../logo/photo.jpg", "clubId/logo/photo.webp")));

        imageConversionCompletedWebhookService.processImageConversionCompleted(request);

        verify(clubRepository, org.mockito.Mockito.never()).findByClubRecruitmentInformation_LogoOrClubRecruitmentInformation_CoverOrClubRecruitmentInformation_FeedImagesContaining(
                any(), any(), any());
        verify(clubRepository, org.mockito.Mockito.never()).save(any());
    }
}
