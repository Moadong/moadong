package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.club.util.RecruitmentStateCalculator;
import moadong.fcm.port.PushNotificationPort;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class RecruitmentStateChecker {

    private final ClubRepository clubRepository;
    private final RecruitmentStateCalculator recruitmentStateCalculator;
    private final PushNotificationPort pushNotificationPort;

    @Scheduled(fixedRate = 10 * 60 * 1000) // 10분마다 실행
    @SchedulerLock(name="RecruitmentStateChecker", lockAtMostFor = "1m", lockAtLeastFor = "1s")
    public void performTask() {
        List<Club> clubs = clubRepository.findAll();
        for (Club club : clubs) {
            ClubRecruitmentInformation recruitInfo = club.getClubRecruitmentInformation();
            ZonedDateTime recruitmentStartDate = recruitInfo.getRecruitmentStart();
            ZonedDateTime recruitmentEndDate = recruitInfo.getRecruitmentEnd();
            if (recruitInfo.getClubRecruitmentStatus() == ClubRecruitmentStatus.ALWAYS) {
                continue;
            }
            boolean changed = recruitmentStateCalculator.calculate(club, recruitmentStartDate, recruitmentEndDate);
            if (changed) {
                pushNotificationPort.send(
                        recruitmentStateCalculator.buildRecruitmentMessage(
                                club,
                                club.getClubRecruitmentInformation().getClubRecruitmentStatus()
                        )
                );
            }

            clubRepository.save(club);
        }
    }
}
