package moadong.analytics.service;

import moadong.analytics.config.MixpanelProperties;
import moadong.analytics.entity.MixpanelBackfilledEvent;
import moadong.analytics.payload.dto.MixpanelRawEvent;
import moadong.analytics.repository.MixpanelBackfilledEventRepository;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@UnitTest
class MixpanelBackfillServiceTest {

    @Mock
    private MixpanelExportClient mixpanelExportClient;

    @Mock
    private MixpanelBackfilledEventRepository mixpanelBackfilledEventRepository;

    @Mock
    private ClubAnalyticsRecordService clubAnalyticsRecordService;

    @Mock
    private ClubRepository clubRepository;

    @Test
    void mixpanel이_비활성화되어_있으면_backfill을_실행하지_않는다() {
        // given
        MixpanelBackfillService service = service(false);
        LocalDate date = LocalDate.of(2026, 7, 8);

        // when & then
        assertThrows(RestApiException.class, () -> service.backfill(date, date));
        verifyNoInteractions(mixpanelExportClient);
    }

    @Test
    void 이벤트_처리_중_실패하면_dedup_키를_롤백한다() {
        // given
        MixpanelBackfillService service = service(true);
        LocalDate date = LocalDate.of(2026, 7, 8);
        MixpanelRawEvent event = searchEvent("$insert-id", date, "밴드");

        when(clubRepository.findAll()).thenReturn(List.of());
        when(mixpanelExportClient.fetchEvents(date)).thenReturn(List.of(event));
        when(mixpanelBackfilledEventRepository.insert(any(MixpanelBackfilledEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(clubAnalyticsRecordService.normalizeKeyword("밴드")).thenReturn("밴드");
        doThrow(new RuntimeException("mongo error"))
                .when(clubAnalyticsRecordService)
                .incrementKeywordDaily("밴드", "밴드", date, 1);

        // when & then
        assertThrows(RuntimeException.class, () -> service.backfill(date, date));
        verify(mixpanelBackfilledEventRepository).deleteById("$insert-id");
    }

    private MixpanelBackfillService service(boolean enabled) {
        MixpanelProperties properties = new MixpanelProperties(
                enabled,
                "data.mixpanel.com",
                "3611536",
                new MixpanelProperties.ServiceAccount("service-account", "secret"),
                new MixpanelProperties.Backfill(100000, 31)
        );
        return new MixpanelBackfillService(
                mixpanelExportClient,
                mixpanelBackfilledEventRepository,
                clubAnalyticsRecordService,
                clubRepository,
                properties
        );
    }

    private MixpanelRawEvent searchEvent(String insertId, LocalDate date, String keyword) {
        long epochSeconds = date.atStartOfDay(ZoneId.of("Asia/Seoul")).toEpochSecond();
        return new MixpanelRawEvent(
                "Search Executed",
                Map.of(
                        "$insert_id", insertId,
                        "time", epochSeconds,
                        "inputValue", keyword
                )
        );
    }
}
