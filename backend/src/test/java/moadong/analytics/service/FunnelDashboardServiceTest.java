package moadong.analytics.service;

import moadong.analytics.entity.MixpanelFunnelEvent;
import moadong.analytics.payload.response.FunnelDashboardResponse;
import moadong.analytics.payload.response.FunnelDashboardResponse.FunnelResult;
import moadong.analytics.payload.response.FunnelDashboardResponse.ScrollDepthResult;
import moadong.analytics.repository.MixpanelBackfilledEventRepository;
import moadong.analytics.repository.MixpanelFunnelEventRepository;
import moadong.analytics.support.FunnelDefinitions;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@UnitTest
class FunnelDashboardServiceTest {

    private static final LocalDate DATE = LocalDate.of(2026, 9, 10);
    private static final LocalDateTime T0 = DATE.atTime(10, 0);

    @Mock
    private MixpanelFunnelEventRepository mixpanelFunnelEventRepository;

    @Mock
    private MixpanelBackfilledEventRepository mixpanelBackfilledEventRepository;

    @InjectMocks
    private FunnelDashboardService service;

    @Test
    void 정상_순서로_24시간_안에_다음_단계를_하면_전환으로_센다() {
        FunnelResult result = detailToApply(List.of(
                event("u1", "ClubDetailPage Visited", T0),
                event("u1", "Club Apply Button Clicked", T0.plusHours(23))
        ));

        assertEquals(1, result.steps().get(0).users());
        assertEquals(1, result.steps().get(1).users());
        assertEquals(1.0, result.conversions().get(0).rate());
        assertEquals(1.0, result.overallRate());
    }

    @Test
    void 역순으로_하면_전환으로_세지_않는다() {
        FunnelResult result = detailToApply(List.of(
                event("u1", "Club Apply Button Clicked", T0),
                event("u1", "ClubDetailPage Visited", T0.plusMinutes(5))
        ));

        assertEquals(1, result.steps().get(0).users());
        assertEquals(0, result.steps().get(1).users());
        assertEquals(0.0, result.conversions().get(0).rate());
    }

    @Test
    void 이전_단계로부터_24시간을_넘기면_전환으로_세지_않는다() {
        FunnelResult result = detailToApply(List.of(
                event("u1", "ClubDetailPage Visited", T0),
                event("u1", "Club Apply Button Clicked", T0.plusHours(24).plusSeconds(1))
        ));

        assertEquals(1, result.steps().get(0).users());
        assertEquals(0, result.steps().get(1).users());
    }

    @Test
    void 같은_사용자가_반복해도_단계당_한_번만_센다() {
        FunnelResult result = detailToApply(List.of(
                event("u1", "ClubDetailPage Visited", T0),
                event("u1", "ClubDetailPage Visited", T0.plusMinutes(1)),
                event("u1", "Club Apply Button Clicked", T0.plusMinutes(2)),
                event("u1", "Club Apply Button Clicked", T0.plusMinutes(3)),
                event("u2", "ClubDetailPage Visited", T0)
        ));

        assertEquals(2, result.steps().get(0).users());
        assertEquals(1, result.steps().get(1).users());
        assertEquals(0.5, result.conversions().get(0).rate());
    }

    @Test
    void 세_단계_퍼널에서_두번째_단계를_건너뛴_사용자는_세번째_단계에_집계되지_않는다() {
        Map<String, List<MixpanelFunnelEvent>> byUser = byUser(List.of(
                event("skip", "Club Apply Button Clicked", T0),
                event("skip", "Application Form Submitted", T0.plusMinutes(10)),
                event("full", "Club Apply Button Clicked", T0),
                event("full", "ApplicationFormPage Visited", T0.plusMinutes(1)),
                event("full", "Application Form Submitted", T0.plusMinutes(2))
        ));

        FunnelResult result = service.computeFunnel(funnel("apply_to_submit"), byUser);

        assertEquals(2, result.steps().get(0).users());
        assertEquals(1, result.steps().get(1).users());
        assertEquals(1, result.steps().get(2).users());
        assertEquals(0.5, result.overallRate());
    }

    @Test
    void 첫_단계에_두_이벤트_이름이_있으면_둘_중_하나만_해도_진입으로_센다() {
        Map<String, List<MixpanelFunnelEvent>> byUser = byUser(List.of(
                event("web", "MainPage Visited", T0),
                event("web", "ClubCard Clicked", T0.plusMinutes(1)),
                event("app", "WebviewMainPage Visited", T0),
                event("app", "ClubCard Clicked", T0.plusMinutes(1))
        ));

        FunnelResult result = service.computeFunnel(funnel("home_to_card"), byUser);

        assertEquals(2, result.steps().get(0).users());
        assertEquals(2, result.steps().get(1).users());
    }

    @Test
    void 첫_단계_사용자가_없으면_전환율은_null이다() {
        FunnelResult result = detailToApply(List.of());

        assertEquals(0, result.steps().get(0).users());
        assertNull(result.conversions().get(0).rate());
        assertNull(result.overallRate());
    }

    @Test
    void 스크롤_분포는_page별로_나뉘고_25퍼센트를_분모로_비율을_낸다() {
        List<ScrollDepthResult> results = service.computeScrollDepths(List.of(
                scroll("u1", "MainPage", 25),
                scroll("u1", "MainPage", 50),
                scroll("u2", "MainPage", 25),
                scroll("u2", "MainPage", 25),
                scroll("u3", "ClubDetailPage", 25),
                scroll("u3", "ClubDetailPage", 100),
                scroll("u4", "ClubDetailPage", 30)
        ));

        assertEquals(2, results.size());
        ScrollDepthResult detail = results.get(0);
        assertEquals("ClubDetailPage", detail.page());
        assertEquals(1, detail.depths().get(0).users());
        assertEquals(0, detail.depths().get(1).users());
        assertEquals(1, detail.depths().get(3).users());
        assertEquals(1.0, detail.depths().get(3).rateFrom25());

        ScrollDepthResult main = results.get(1);
        assertEquals("MainPage", main.page());
        assertEquals(2, main.depths().get(0).users());
        assertEquals(1, main.depths().get(1).users());
        assertEquals(0.5, main.depths().get(1).rateFrom25());
        assertEquals(0.0, main.depths().get(3).rateFrom25());
    }

    @Test
    void 대시보드는_수집되지_않은_날짜를_missingDates로_알려준다() {
        LocalDate from = DATE;
        LocalDate to = DATE.plusDays(2);
        when(mixpanelFunnelEventRepository.findByEventDateBetween(from, to)).thenReturn(List.of());
        when(mixpanelBackfilledEventRepository.existsByEventDateAndEventNameIn(eq(from), any())).thenReturn(true);
        when(mixpanelBackfilledEventRepository.existsByEventDateAndEventNameIn(eq(from.plusDays(1)), any())).thenReturn(false);
        when(mixpanelBackfilledEventRepository.existsByEventDateAndEventNameIn(eq(to), any())).thenReturn(true);

        FunnelDashboardResponse response = service.getDashboard(from, to);

        assertEquals(3, response.requestedDays());
        assertEquals(2, response.collectedDays());
        assertEquals(List.of(from.plusDays(1)), response.missingDates());
        assertEquals(FunnelDefinitions.FUNNELS.size(), response.funnels().size());
    }

    @Test
    void 기간이_거꾸로면_예외를_던진다() {
        assertThrows(RestApiException.class, () -> service.getDashboard(DATE, DATE.minusDays(1)));
    }

    private FunnelResult detailToApply(List<MixpanelFunnelEvent> events) {
        return service.computeFunnel(funnel("detail_to_apply"), byUser(events));
    }

    private static FunnelDefinitions.Funnel funnel(String key) {
        return FunnelDefinitions.FUNNELS.stream()
                .filter(funnel -> funnel.key().equals(key))
                .findFirst()
                .orElseThrow();
    }

    private static Map<String, List<MixpanelFunnelEvent>> byUser(List<MixpanelFunnelEvent> events) {
        return events.stream()
                .sorted(Comparator.comparing(MixpanelFunnelEvent::getEventTime))
                .collect(Collectors.groupingBy(MixpanelFunnelEvent::getDistinctId));
    }

    private static MixpanelFunnelEvent event(String distinctId, String eventName, LocalDateTime time) {
        return MixpanelFunnelEvent.builder()
                .insertId(distinctId + ":" + eventName + ":" + time)
                .distinctId(distinctId)
                .eventName(eventName)
                .eventTime(time)
                .eventDate(time.toLocalDate())
                .build();
    }

    private static MixpanelFunnelEvent scroll(String distinctId, String page, int depthPercent) {
        return MixpanelFunnelEvent.builder()
                .insertId(distinctId + ":" + page + ":" + depthPercent)
                .distinctId(distinctId)
                .eventName(FunnelDefinitions.SCROLL_DEPTH_EVENT)
                .eventTime(T0)
                .eventDate(DATE)
                .page(page)
                .depthPercent(depthPercent)
                .build();
    }
}
