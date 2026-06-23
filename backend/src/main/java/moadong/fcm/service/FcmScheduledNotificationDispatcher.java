package moadong.fcm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleTargetType;
import moadong.fcm.model.MulticastPushPayload;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.model.TokenPushPayload;
import moadong.fcm.model.TokenPushResult;
import moadong.fcm.port.PushNotificationPort;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FcmScheduledNotificationDispatcher {

    private final FcmScheduledNotificationService scheduleService;
    private final FcmAdminService fcmAdminService;
    private final PushNotificationPort pushNotificationPort;

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")
    @SchedulerLock(name = "FcmScheduledNotificationDispatcher", lockAtMostFor = "2m", lockAtLeastFor = "5s")
    public void dispatchDueNotifications() {
        Instant now = Instant.now();
        List<FcmScheduledNotification> dueSchedules = scheduleService.findDueSchedules(now);

        for (FcmScheduledNotification dueSchedule : dueSchedules) {
            scheduleService.claimForSending(dueSchedule.getId(), now)
                    .ifPresent(this::dispatchClaimed);
        }
    }

    private void dispatchClaimed(FcmScheduledNotification schedule) {
        try {
            if (schedule.getTargetType() == FcmScheduleTargetType.SINGLE_TOKEN) {
                dispatchSingle(schedule);
                return;
            }
            dispatchAll(schedule);
        } catch (Exception e) {
            log.error("Scheduled FCM dispatch failed. scheduleId={}, error={}", schedule.getId(), e.getMessage(), e);
            scheduleService.markFailed(schedule.getId(), e.getMessage());
        }
    }

    private void dispatchSingle(FcmScheduledNotification schedule) {
        TokenPushResult result = pushNotificationPort.sendToToken(new TokenPushPayload(
                schedule.getToken(),
                schedule.getTitle(),
                schedule.getBody(),
                schedule.getData()
        ));

        if (result.success()) {
            scheduleService.markSingleSent(schedule.getId(), result.messageId(), Instant.now());
            return;
        }

        scheduleService.markSingleFailed(schedule.getId(), "FCM 단건 예약 발송 실패");
    }

    private void dispatchAll(FcmScheduledNotification schedule) {
        List<String> tokens = fcmAdminService.getAllAvailableToken().tokens();
        if (tokens.isEmpty()) {
            scheduleService.markNoTargetSent(schedule.getId(), Instant.now());
            return;
        }

        MulticastPushResult result = pushNotificationPort.sendToTokens(new MulticastPushPayload(
                tokens,
                schedule.getTitle(),
                schedule.getBody(),
                schedule.getData()
        ));

        scheduleService.markBatchSent(schedule.getId(), tokens.size(), result, Instant.now());
    }
}
