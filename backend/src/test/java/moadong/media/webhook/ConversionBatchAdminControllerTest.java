package moadong.media.webhook;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import moadong.global.payload.Response;
import moadong.media.webhook.dto.ImageConversionCompletedRequest;
import moadong.media.webhook.dto.WebpMigrationResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ConversionBatchAdminControllerTest {

    @Mock
    private ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;

    @Mock
    private WebpMigrationService webpMigrationService;

    @InjectMocks
    private ConversionBatchAdminController conversionBatchAdminController;

    @Test
    void runWebpMigration_성공_시_200과_요약을_반환한다() {
        when(webpMigrationService.migrateAllClubsToWebp())
                .thenReturn(new WebpMigrationResult(3, 2));

        ResponseEntity<?> response = conversionBatchAdminController.runWebpMigration();

        assertEquals(200, response.getStatusCode().value());
        @SuppressWarnings("unchecked")
        Response<WebpMigrationResult> body = (Response<WebpMigrationResult>) response.getBody();
        assertEquals("갱신 3건, 스킵 2건", body.message());
        assertEquals(3, body.data().updatedCount());
        assertEquals(2, body.data().skippedCount());
    }

    @Test
    void processBatchCompletedForAllClubs_유효한_요청이면_200을_반환한다() {
        ImageConversionCompletedRequest request = new ImageConversionCompletedRequest(
                "batch.completed",
                0,
                0,
                java.util.List.of());

        ResponseEntity<?> response = conversionBatchAdminController.processBatchCompletedForAllClubs(request);

        assertEquals(200, response.getStatusCode().value());
    }
}
