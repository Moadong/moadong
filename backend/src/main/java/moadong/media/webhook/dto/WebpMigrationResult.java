package moadong.media.webhook.dto;

/**
 * WebP 마이그레이션 실행 결과 요약.
 */
public record WebpMigrationResult(
        int updatedCount,
        int skippedCount
) {
}
