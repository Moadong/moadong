package moadong.fcm.payload.response;

import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;

import java.time.Instant;

public record FcmScheduleCancelResponse(
        String id,
        FcmScheduleStatus status,
        Instant canceledAt
) {
    public static FcmScheduleCancelResponse from(FcmScheduledNotification schedule) {
        return new FcmScheduleCancelResponse(
                schedule.getId(),
                schedule.getStatus(),
                schedule.getCanceledAt()
        );
    }
}
