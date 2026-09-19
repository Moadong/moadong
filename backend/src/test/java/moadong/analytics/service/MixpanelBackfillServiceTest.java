package moadong.analytics.service;

import moadong.analytics.config.MixpanelProperties;
import moadong.analytics.entity.MixpanelBackfilledEvent;
import moadong.analytics.entity.MixpanelCollectionStatus;
import moadong.analytics.entity.MixpanelFunnelEvent;
import moadong.analytics.payload.dto.MixpanelRawEvent;
import moadong.analytics.payload.response.MixpanelBackfillResponse;
import moadong.analytics.repository.MixpanelBackfilledEventRepository;
import moadong.analytics.repository.MixpanelCollectionStatusRepository;
import moadong.analytics.repository.MixpanelFunnelEventRepository;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.dao.DuplicateKeyException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
    private MixpanelFunnelEventRepository mixpanelFunnelEventRepository;

    @Mock
    private MixpanelCollectionStatusRepository mixpanelCollectionStatusRepository;

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

    @Test
    void 퍼널_이벤트는_mixpanel_funnel_events에_최소_속성만_저장한다() {
        MixpanelBackfillService service = service(true);
        LocalDate date = LocalDate.of(2026, 7, 8);
        long epochSeconds = date.atStartOfDay(ZoneId.of("Asia/Seoul")).plusHours(9).toEpochSecond();
        MixpanelRawEvent event = new MixpanelRawEvent(
                "Scroll Depth Reached",
                Map.of(
                        "$insert_id", "scroll-1",
                        "distinct_id", "user-1",
                        "time", epochSeconds,
                        "page", "MainPage",
                        "depth_percent", 50,
                        "url", "https://moadong.com"
                )
        );

        when(clubRepository.findAll()).thenReturn(List.of());
        when(mixpanelExportClient.fetchEvents(date)).thenReturn(List.of(event));
        when(mixpanelBackfilledEventRepository.insert(any(MixpanelBackfilledEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        MixpanelBackfillResponse response = service.backfill(date, date);

        ArgumentCaptor<MixpanelFunnelEvent> captor = ArgumentCaptor.forClass(MixpanelFunnelEvent.class);
        verify(mixpanelFunnelEventRepository).save(captor.capture());
        MixpanelFunnelEvent saved = captor.getValue();
        assertEquals("scroll-1", saved.getInsertId());
        assertEquals("user-1", saved.getDistinctId());
        assertEquals("Scroll Depth Reached", saved.getEventName());
        assertEquals(date.atTime(9, 0), saved.getEventTime());
        assertEquals(date, saved.getEventDate());
        assertEquals("MainPage", saved.getPage());
        assertEquals(50, saved.getDepthPercent());
        assertEquals(1, response.processedEvents());
        verifyNoInteractions(clubAnalyticsRecordService);
    }

    @Test
    void ClubDetailPage_Visited는_동아리_통계와_퍼널_저장을_둘_다_수행한다() {
        MixpanelBackfillService service = service(true);
        LocalDate date = LocalDate.of(2026, 7, 8);
        long epochSeconds = date.atStartOfDay(ZoneId.of("Asia/Seoul")).toEpochSecond();
        MixpanelRawEvent event = new MixpanelRawEvent(
                "ClubDetailPage Visited",
                Map.of(
                        "$insert_id", "detail-1",
                        "distinct_id", "user-1",
                        "time", epochSeconds,
                        "clubName", "밴드부"
                )
        );
        Club club = mock(Club.class);
        when(club.getId()).thenReturn("club-1");
        when(club.getName()).thenReturn("밴드부");

        when(clubRepository.findAll()).thenReturn(List.of(club));
        when(mixpanelExportClient.fetchEvents(date)).thenReturn(List.of(event));
        when(mixpanelBackfilledEventRepository.insert(any(MixpanelBackfilledEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.backfill(date, date);

        verify(clubAnalyticsRecordService)
                .incrementClubDailyWithoutExistenceCheck("club-1", "밴드부", date, 1, 0, 0);
        ArgumentCaptor<MixpanelFunnelEvent> captor = ArgumentCaptor.forClass(MixpanelFunnelEvent.class);
        verify(mixpanelFunnelEventRepository).save(captor.capture());
        assertEquals("ClubDetailPage Visited", captor.getValue().getEventName());
        assertEquals("user-1", captor.getValue().getDistinctId());
    }

    @Test
    void 같은_insert_id를_다시_처리하면_퍼널_이벤트를_저장하지_않는다() {
        MixpanelBackfillService service = service(true);
        LocalDate date = LocalDate.of(2026, 7, 8);
        long epochSeconds = date.atStartOfDay(ZoneId.of("Asia/Seoul")).toEpochSecond();
        MixpanelRawEvent event = new MixpanelRawEvent(
                "ClubCard Clicked",
                Map.of(
                        "$insert_id", "card-1",
                        "distinct_id", "user-1",
                        "time", epochSeconds
                )
        );

        when(clubRepository.findAll()).thenReturn(List.of());
        when(mixpanelExportClient.fetchEvents(date)).thenReturn(List.of(event));
        when(mixpanelBackfilledEventRepository.insert(any(MixpanelBackfilledEvent.class)))
                .thenThrow(new DuplicateKeyException("duplicate"));

        MixpanelBackfillResponse response = service.backfill(date, date);

        assertEquals(1, response.duplicatedEvents());
        assertEquals(0, response.processedEvents());
        verifyNoInteractions(mixpanelFunnelEventRepository);
    }

    @Test
    void 이벤트가_0건이어도_날짜별_수집_표시를_남긴다() {
        MixpanelBackfillService service = service(true);
        LocalDate date = LocalDate.of(2026, 7, 8);

        when(clubRepository.findAll()).thenReturn(List.of());
        when(mixpanelExportClient.fetchEvents(date)).thenReturn(List.of());

        service.backfill(date, date);

        ArgumentCaptor<MixpanelCollectionStatus> captor = ArgumentCaptor.forClass(MixpanelCollectionStatus.class);
        verify(mixpanelCollectionStatusRepository).save(captor.capture());
        assertEquals(date.toString(), captor.getValue().getEventDate());
    }

    @Test
    void 처리_중_실패한_날짜에는_수집_표시를_남기지_않는다() {
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

        assertThrows(RuntimeException.class, () -> service.backfill(date, date));

        verifyNoInteractions(mixpanelCollectionStatusRepository);
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
                mixpanelFunnelEventRepository,
                mixpanelCollectionStatusRepository,
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
