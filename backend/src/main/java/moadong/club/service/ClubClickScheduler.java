package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class ClubClickScheduler {

    private final ClubClickService clubClickService;

    @Scheduled(cron = "0 0 0 * * MON", zone = "Asia/Seoul")
    @SchedulerLock(name = "ClubClickWeeklyReset", lockAtMostFor = "1m", lockAtLeastFor = "1s")
    public void resetWeeklyClicks() {
        clubClickService.resetWeeklyClicks();
    }

    @Scheduled(cron = "0 0 * * * *")
    @SchedulerLock(name = "ClubClickWhitelistRefresh", lockAtMostFor = "5m", lockAtLeastFor = "1s")
    public void refreshWhitelist() {
        clubClickService.refreshWhitelist();
    }
}
