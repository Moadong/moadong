package moadong.media.webhook;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import moadong.media.webhook.dto.ImageConversionCompletedRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
@Tag(name = "Webhook", description = "외부 서비스 웹훅 수신 API")
public class ImageConversionCompletedWebhookController {

    private static final String IMAGE_CONVERSION_COMPLETED_EVENT = "batch.completed";

    private final ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;

    @PostMapping("/conversion-batch")
    @Operation(summary = "이미지 변환 완료 웹훅", description = "이미지 변환 완료 시 호출됩니다. event=batch.completed, images 필수.")
    public ResponseEntity<?> handleImageConversionCompleted(@RequestBody @Valid ImageConversionCompletedRequest request) {
        if (!IMAGE_CONVERSION_COMPLETED_EVENT.equals(request.event())) {
            throw new RestApiException(ErrorCode.WEBHOOK_INVALID_REQUEST);
        }
        imageConversionCompletedWebhookService.processImageConversionCompleted(request);
        return Response.ok("ok");
    }
}
