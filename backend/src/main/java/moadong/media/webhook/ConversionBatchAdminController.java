package moadong.media.webhook;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import moadong.media.webhook.dto.ImageConversionCompletedRequest;
import moadong.media.webhook.dto.WebpMigrationResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/conversion-batch")
@RequiredArgsConstructor
@Tag(name = "Conversion Batch Admin", description = "이미지 변환 배치 관리 API (개발자 전용, 모든 동아리 대상)")
public class ConversionBatchAdminController {

    private static final String BATCH_COMPLETED_EVENT = "batch.completed";

    private final ImageConversionCompletedWebhookService imageConversionCompletedWebhookService;
    private final WebpMigrationService webpMigrationService;

    @PostMapping
    @Operation(
        summary = "배치 변환 완료 처리 (전체 동아리)",
        description = "개발자 전용. 웹훅과 동일한 로직으로, 전달한 source→destination 이미지 URL을 모든 동아리의 로고/커버/피드 이미지에서 일괄 갱신합니다. event=batch.completed, images 필수."
    )
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> processBatchCompletedForAllClubs(@RequestBody @Valid ImageConversionCompletedRequest request) {
        if (!BATCH_COMPLETED_EVENT.equals(request.event())) {
            throw new RestApiException(ErrorCode.WEBHOOK_INVALID_REQUEST);
        }
        imageConversionCompletedWebhookService.processImageConversionCompleted(request);
        return Response.ok("ok");
    }

    @PostMapping("/webp-migrate")
    @Operation(
        summary = "WebP 마이그레이션 실행 (전체 동아리)",
        description = "개발자 전용. DB에 있는 모든 동아리 이미지 URL을 수집한 뒤, R2에 .webp 버전이 있을 때만 해당 URL을 .webp로 갱신합니다. body 없음."
    )
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> runWebpMigration() {
        WebpMigrationResult result = webpMigrationService.migrateAllClubsToWebp();
        String message = String.format("갱신 %d건, 스킵 %d건", result.updatedCount(), result.skippedCount());
        return Response.ok(message, result);
    }
}
