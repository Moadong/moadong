package moadong.analytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.analytics.config.MixpanelProperties;
import moadong.analytics.payload.response.MixpanelBackfillResponse;
import moadong.analytics.support.AnalyticsTime;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * 매일 새벽 전날치 Mixpanel 이벤트를 백필한다.
 * 기존 백필 서비스를 그대로 호출하므로 $insert_id 중복 방지도 그대로 적용된다.
 * 실패하면 로그만 남긴다. 빠진 날짜는 개발자 포털의 수동 백필로 메운다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class FunnelEventDailyCollector {

    private final MixpanelBackfillService mixpanelBackfillService;
    private final MixpanelProperties mixpanelProperties;

    @Scheduled(cron = "0 0 4 * * *", zone = "Asia/Seoul")
    @SchedulerLock(name = "FunnelEventDailyCollector", lockAtMostFor = "30m", lockAtLeastFor = "1m")
    public void collectYesterday() {
        if (!mixpanelProperties.enabled()) {
            log.info("Mixpanel 비활성화 상태라 퍼널 이벤트 일일 수집을 건너뜁니다.");
            return;
        }
        LocalDate yesterday = AnalyticsTime.todayKst().minusDays(1);
        try {
            MixpanelBackfillResponse response = mixpanelBackfillService.backfill(yesterday, yesterday);
            log.info("퍼널 이벤트 일일 수집 완료. date={}, fetched={}, processed={}, duplicated={}, skipped={}",
                    yesterday, response.fetchedEvents(), response.processedEvents(),
                    response.duplicatedEvents(), response.skippedEvents());
        } catch (Exception e) {
            log.error("퍼널 이벤트 일일 수집 실패. date={}. 개발자 포털에서 수동 백필로 메우세요.", yesterday, e);
        }
    }
}
