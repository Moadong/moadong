package moadong.fcm.repository;

import moadong.fcm.entity.FcmScheduledNotification;

import java.time.Instant;
import java.util.Optional;

public interface FcmScheduledNotificationRepositoryCustom {

    Optional<FcmScheduledNotification> claimForSending(String scheduleId, Instant now);

    Optional<FcmScheduledNotification> cancelIfScheduled(String scheduleId, Instant now);
}
