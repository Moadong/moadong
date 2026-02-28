package moadong.media.webhook;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.media.webhook.dto.WebpMigrationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@ExtendWith(MockitoExtension.class)
class WebpMigrationServiceTest {

    private static final String VIEW_ENDPOINT = "https://cdn.example.com";
    private static final String BUCKET = "test-bucket";
    private static final String PREFIX = VIEW_ENDPOINT + "/";

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private S3Client s3Client;

    @Mock
    private ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;

    @InjectMocks
    private WebpMigrationService webpMigrationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(webpMigrationService, "viewEndpoint", VIEW_ENDPOINT);
        ReflectionTestUtils.setField(webpMigrationService, "bucket", BUCKET);
        ReflectionTestUtils.invokeMethod(webpMigrationService, "init");
    }

    @Test
    void migrateAllClubsToWebp_수집된_URL이_없으면_0건_갱신_0건_스킵() {
        when(clubRepository.findAll()).thenReturn(List.of());

        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();

        assertEquals(0, result.updatedCount());
        assertEquals(0, result.skippedCount());
        verify(imageConversionCompletedWebhookService, never()).updateClubsForImageReplacement(any(), any());
    }

    @Test
    void migrateAllClubsToWebp_viewEndpoint가_아닌_URL은_수집하지_않는다() {
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .logo("https://other-cdn.com/path/logo.png")
                .clubRecruitmentStatus(ClubRecruitmentStatus.OPEN)
                .build();
        Club club = Club.builder()
                .name("test")
                .category("CATEGORY")
                .division("DIVISION")
                .userId("user1")
                .clubRecruitmentInformation(info)
                .build();
        when(clubRepository.findAll()).thenReturn(List.of(club));

        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();

        assertEquals(0, result.updatedCount());
        assertEquals(0, result.skippedCount());
        verify(imageConversionCompletedWebhookService, never()).updateClubsForImageReplacement(any(), any());
    }

    @Test
    void migrateAllClubsToWebp_이미_webp_URL은_스킵한다() {
        String webpUrl = PREFIX + "clubId/logo/photo.webp";
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .logo(webpUrl)
                .clubRecruitmentStatus(ClubRecruitmentStatus.OPEN)
                .build();
        Club club = Club.builder()
                .name("test")
                .category("CATEGORY")
                .division("DIVISION")
                .userId("user1")
                .clubRecruitmentInformation(info)
                .build();
        when(clubRepository.findAll()).thenReturn(List.of(club));

        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();

        assertEquals(0, result.updatedCount());
        assertEquals(1, result.skippedCount());
        verify(imageConversionCompletedWebhookService, never()).updateClubsForImageReplacement(any(), any());
    }

    @Test
    void migrateAllClubsToWebp_R2에_webp가_없으면_스킵한다() {
        String fullUrlOld = PREFIX + "clubId/logo/photo.png";
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
        when(clubRepository.findAll()).thenReturn(List.of(club));
        when(s3Client.headObject(any(HeadObjectRequest.class))).thenThrow(NoSuchKeyException.builder().build());

        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();

        assertEquals(0, result.updatedCount());
        assertEquals(1, result.skippedCount());
        verify(imageConversionCompletedWebhookService, never()).updateClubsForImageReplacement(any(), any());
    }

    @Test
    void migrateAllClubsToWebp_R2에_webp가_있으면_갱신_호출한다() {
        String fullUrlOld = PREFIX + "clubId/logo/photo.png";
        String fullUrlNew = PREFIX + "clubId/logo/photo.webp";
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
        when(clubRepository.findAll()).thenReturn(List.of(club));
        when(s3Client.headObject(any(HeadObjectRequest.class))).thenReturn(HeadObjectResponse.builder().build());

        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();

        assertEquals(1, result.updatedCount());
        assertEquals(0, result.skippedCount());
        ArgumentCaptor<String> oldCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> newCaptor = ArgumentCaptor.forClass(String.class);
        verify(imageConversionCompletedWebhookService).updateClubsForImageReplacement(oldCaptor.capture(), newCaptor.capture());
        assertEquals(fullUrlOld, oldCaptor.getValue());
        assertEquals(fullUrlNew, newCaptor.getValue());
    }

    @Test
    void migrateAllClubsToWebp_중복_URL은_한번만_처리한다() {
        String fullUrlOld = PREFIX + "clubId/logo/photo.png";
        ClubRecruitmentInformation info1 = ClubRecruitmentInformation.builder()
                .logo(fullUrlOld)
                .clubRecruitmentStatus(ClubRecruitmentStatus.OPEN)
                .build();
        ClubRecruitmentInformation info2 = ClubRecruitmentInformation.builder()
                .logo(fullUrlOld)
                .clubRecruitmentStatus(ClubRecruitmentStatus.OPEN)
                .build();
        Club club1 = Club.builder().name("c1").category("C").division("D").userId("u1").clubRecruitmentInformation(info1).build();
        Club club2 = Club.builder().name("c2").category("C").division("D").userId("u2").clubRecruitmentInformation(info2).build();
        when(clubRepository.findAll()).thenReturn(List.of(club1, club2));
        when(s3Client.headObject(any(HeadObjectRequest.class))).thenReturn(HeadObjectResponse.builder().build());

        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();

        assertEquals(1, result.updatedCount());
        verify(imageConversionCompletedWebhookService).updateClubsForImageReplacement(eq(fullUrlOld), eq(PREFIX + "clubId/logo/photo.webp"));
    }
}
