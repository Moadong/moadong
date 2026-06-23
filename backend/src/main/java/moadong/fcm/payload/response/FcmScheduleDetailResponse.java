package moadong.fcm.payload.response;

import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record FcmScheduleDetailResponse(
        String id,
        FcmScheduleTargetType targetType,
        String token,
        String title,
        String body,
        Map<String, String> data,
        Instant scheduledAt,
        FcmScheduleStatus status,
        Instant createdAt,
        Instant updatedAt,
        Instant sendingStartedAt,
        Instant canceledAt,
        Instant sentAt,
        String failureReason,
        String messageId,
        int totalCount,
        int successCount,
        int failureCount,
        List<String> failedTokens
) {
    public static FcmScheduleDetailResponse from(FcmScheduledNotification schedule) {
        return new FcmScheduleDetailResponse(
                schedule.getId(),
                schedule.getTargetType(),
                schedule.getToken(),
                schedule.getTitle(),
                schedule.getBody(),
                schedule.getData(),
                schedule.getScheduledAt(),
                schedule.getStatus(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt(),
                schedule.getSendingStartedAt(),
                schedule.getCanceledAt(),
                schedule.getSentAt(),
                schedule.getFailureReason(),
                schedule.getMessageId(),
                schedule.getTotalCount(),
                schedule.getSuccessCount(),
                schedule.getFailureCount(),
                schedule.getFailedTokens()
        );
    }
}
