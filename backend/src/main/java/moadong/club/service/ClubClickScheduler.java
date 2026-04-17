package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class ClubClickScheduler {

    private final StringRedisTemplate stringRedisTemplate;
    private final ClubClickService clubClickService;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    @SchedulerLock(name = "ClubClickReset", lockAtMostFor = "1m", lockAtLeastFor = "1s")
    public void resetDailyClicks() {
        Set<String> keys = stringRedisTemplate.keys(ClubClickService.CLICK_KEY_PATTERN);
        if (keys != null && !keys.isEmpty()) {
            stringRedisTemplate.delete(keys);
        }
        log.info("동아리 클릭 수 초기화 완료");
    }

    @Scheduled(cron = "0 0 * * * *")
    @SchedulerLock(name = "ClubClickWhitelistRefresh", lockAtMostFor = "5m", lockAtLeastFor = "1s")
    public void refreshWhitelist() {
        clubClickService.refreshWhitelist();
    }
}
