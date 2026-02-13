package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.club.util.RecruitmentDdayNotificationBuilder;
import moadong.fcm.port.PushNotificationPort;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class RecruitmentDdayNotifier {

    private static final Set<Long> NOTIFICATION_DAYS = Set.of(7L, 3L, 1L);
    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    private final ClubRepository clubRepository;
    private final RecruitmentDdayNotificationBuilder notificationBuilder;
    private final PushNotificationPort pushNotificationPort;

    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Seoul")
    @SchedulerLock(name = "RecruitmentDdayNotifier", lockAtMostFor = "5m", lockAtLeastFor = "1m")
    public void sendDdayNotifications() {
        log.info("D-Day 알림 스케줄러 시작");

        List<Club> openClubs = clubRepository
                .findAllByClubRecruitmentInformation_ClubRecruitmentStatus(ClubRecruitmentStatus.OPEN);

        LocalDate today = LocalDate.now(SEOUL_ZONE);
        int sentCount = 0;

        for (Club club : openClubs) {
            ClubRecruitmentInformation info = club.getClubRecruitmentInformation();
            ZonedDateTime recruitmentEnd = info.getRecruitmentEnd();

            if (recruitmentEnd == null) {
                continue;
            }

            long daysLeft = ChronoUnit.DAYS.between(today, recruitmentEnd.toLocalDate());

            if (NOTIFICATION_DAYS.contains(daysLeft)) {
                log.info("D-Day 알림 전송 - clubId: {}, clubName: {}, D-{}", club.getId(), club.getName(), daysLeft);
                pushNotificationPort.send(notificationBuilder.build(club, daysLeft));
                sentCount++;
            }
        }

        log.info("D-Day 알림 스케줄러 완료 - 전송: {}건 / 대상: {}건", sentCount, openClubs.size());
    }
}
