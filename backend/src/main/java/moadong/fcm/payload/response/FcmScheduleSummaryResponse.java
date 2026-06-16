package moadong.fcm.payload.response;

import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;

import java.time.Instant;

public record FcmScheduleSummaryResponse(
        String id,
        FcmScheduleTargetType targetType,
        String title,
        String body,
        Instant scheduledAt,
        FcmScheduleStatus status,
        Instant createdAt,
        Instant sendingStartedAt,
        Instant canceledAt,
        Instant sentAt,
        int totalCount,
        int successCount,
        int failureCount
) {
    public static FcmScheduleSummaryResponse from(FcmScheduledNotification schedule) {
        return new FcmScheduleSummaryResponse(
                schedule.getId(),
                schedule.getTargetType(),
                schedule.getTitle(),
                schedule.getBody(),
                schedule.getScheduledAt(),
                schedule.getStatus(),
                schedule.getCreatedAt(),
                schedule.getSendingStartedAt(),
                schedule.getCanceledAt(),
                schedule.getSentAt(),
                schedule.getTotalCount(),
                schedule.getSuccessCount(),
                schedule.getFailureCount()
        );
    }
}
