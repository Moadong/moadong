package moadong.analytics.service;

import moadong.analytics.config.MixpanelProperties;
import moadong.analytics.payload.response.MixpanelBackfillResponse;
import moadong.analytics.support.AnalyticsTime;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@UnitTest
class FunnelEventDailyCollectorTest {

    @Mock
    private MixpanelBackfillService mixpanelBackfillService;

    @Test
    void mixpanel이_비활성화되어_있으면_수집하지_않는다() {
        collector(false).collectYesterday();

        verifyNoInteractions(mixpanelBackfillService);
    }

    @Test
    void 전날_하루치를_백필한다() {
        LocalDate yesterday = AnalyticsTime.todayKst().minusDays(1);
        when(mixpanelBackfillService.backfill(yesterday, yesterday))
                .thenReturn(new MixpanelBackfillResponse(yesterday, yesterday, 1, 1, 0, 0));

        collector(true).collectYesterday();

        verify(mixpanelBackfillService).backfill(yesterday, yesterday);
    }

    @Test
    void 백필이_실패해도_예외를_밖으로_던지지_않는다() {
        when(mixpanelBackfillService.backfill(any(), any())).thenThrow(new RuntimeException("export failed"));

        assertDoesNotThrow(() -> collector(true).collectYesterday());
    }

    private FunnelEventDailyCollector collector(boolean enabled) {
        MixpanelProperties properties = new MixpanelProperties(
                enabled,
                "data.mixpanel.com",
                "3611536",
                new MixpanelProperties.ServiceAccount("service-account", "secret"),
                new MixpanelProperties.Backfill(100000, 31)
        );
        return new FunnelEventDailyCollector(mixpanelBackfillService, properties);
    }
}
