package moadong.fcm.repository;

import lombok.RequiredArgsConstructor;
import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FcmScheduledNotificationRepositoryImpl implements FcmScheduledNotificationRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Optional<FcmScheduledNotification> claimForSending(String scheduleId, Instant now) {
        Query query = Query.query(Criteria.where("_id").is(scheduleId)
                .and("status").is(FcmScheduleStatus.SCHEDULED)
                .and("scheduledAt").lte(now));
        Update update = new Update()
                .set("status", FcmScheduleStatus.SENDING)
                .set("sendingStartedAt", now)
                .set("updatedAt", now);

        return Optional.ofNullable(mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                FcmScheduledNotification.class
        ));
    }

    @Override
    public Optional<FcmScheduledNotification> cancelIfScheduled(String scheduleId, Instant now) {
        Query query = Query.query(Criteria.where("_id").is(scheduleId)
                .and("status").is(FcmScheduleStatus.SCHEDULED));
        Update update = new Update()
                .set("status", FcmScheduleStatus.CANCELED)
                .set("canceledAt", now)
                .set("updatedAt", now);

        return Optional.ofNullable(mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                FcmScheduledNotification.class
        ));
    }
}
