package moadong.fcm.repository;

import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface FcmScheduledNotificationRepository extends
        MongoRepository<FcmScheduledNotification, String>,
        FcmScheduledNotificationRepositoryCustom {

    List<FcmScheduledNotification> findByStatusOrderByScheduledAtDesc(FcmScheduleStatus status);

    List<FcmScheduledNotification> findAllByOrderByScheduledAtDesc();

    List<FcmScheduledNotification> findByStatusAndScheduledAtLessThanEqual(FcmScheduleStatus status, Instant now);
}
