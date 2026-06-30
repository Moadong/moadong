package moadong.media.webhook;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.List;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.webhook.dto.ImageConversionCompletedRequest;
import moadong.media.webhook.dto.ImageEntry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class ImageConversionCompletedWebhookControllerTest {

    @Mock
    private ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;

    @InjectMocks
    private ImageConversionCompletedWebhookController imageConversionCompletedWebhookController;

    @Test
    void 유효한_요청이면_200을_반환한다() {
        ImageConversionCompletedRequest request = new ImageConversionCompletedRequest(
                "batch.completed",
                1,
                0,
                List.of(new ImageEntry("clubId/logo/photo.jpg", "clubId/logo/photo.webp")));

        ResponseEntity<?> response = imageConversionCompletedWebhookController.handleImageConversionCompleted(request);

        assertEquals(200, response.getStatusCode().value());
        verify(imageConversionCompletedWebhookService).processImageConversionCompleted(request);
    }

    @Test
    void event가_batch_completed가_아니면_400을_던진다() {
        ImageConversionCompletedRequest request = new ImageConversionCompletedRequest(
                "other.event",
                0,
                0,
                List.of());

        RestApiException ex = assertThrows(RestApiException.class,
                () -> imageConversionCompletedWebhookController.handleImageConversionCompleted(request));

        assertEquals(ErrorCode.WEBHOOK_INVALID_REQUEST, ex.getErrorCode());
        verify(imageConversionCompletedWebhookService, never()).processImageConversionCompleted(any());
    }
}
