// 새 Mixpanel 이벤트명·속성이 백엔드 내부 이름으로 번역되는지 검증하는 테스트
package moadong.analytics.support;

import moadong.analytics.payload.dto.MixpanelRawEvent;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@UnitTest
class MixpanelEventNormalizerTest {

    @Test
    void 동아리_상세_Page_Viewed는_ClubDetailPage_Visited로_번역하고_club_name을_clubName으로_옮긴다() {
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Page Viewed",
                Map.of("page_name", "club_detail", "club_name", "밴드부")
        ));

        assertEquals("ClubDetailPage Visited", normalized.event());
        assertEquals("밴드부", normalized.properties().get("clubName"));
    }

    @Test
    void 동아리_상세_Page_Left는_ClubDetailPage_Duration으로_번역한다() {
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Page Left",
                Map.of("page_name", "club_detail", "duration_seconds", 12)
        ));

        assertEquals("ClubDetailPage Duration", normalized.event());
        assertEquals(12, normalized.properties().get("duration_seconds"));
    }

    @Test
    void 퍼널에_없는_페이지의_Page_Viewed는_이름을_바꾸지_않는다() {
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Page Viewed",
                Map.of("page_name", "menu")
        ));

        assertEquals("Page Viewed", normalized.event());
        assertFalse(FunnelDefinitions.isFunnelEvent(normalized.event()));
    }

    @Test
    void 이름만_바뀐_이벤트는_내부_이름으로_번역한다() {
        assertEquals("ClubCard Clicked",
                MixpanelEventNormalizer.normalize(new MixpanelRawEvent("Club Card Clicked", Map.of())).event());
        assertEquals("만족도 응답",
                MixpanelEventNormalizer.normalize(new MixpanelRawEvent("Satisfaction Answered", Map.of())).event());
        assertEquals("AI 지원서 초안 생성 완료",
                MixpanelEventNormalizer.normalize(new MixpanelRawEvent("AI Draft Generated", Map.of())).event());
    }

    @Test
    void 옛_이름_이벤트는_그대로_통과한다() {
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "ClubDetailPage Visited",
                Map.of("clubName", "밴드부")
        ));

        assertEquals("ClubDetailPage Visited", normalized.event());
        assertEquals("밴드부", normalized.properties().get("clubName"));
    }

    @Test
    void 검색어_input_value를_inputValue로_옮긴다() {
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Search Executed",
                Map.of("input_value", "밴드")
        ));

        assertEquals("Search Executed", normalized.event());
        assertEquals("밴드", normalized.properties().get("inputValue"));
    }

    @Test
    void 스크롤_깊이의_page는_웹뷰여도_그대로_둔다() {
        // 스크롤 깊이는 컨벤션 변경 전에도 웹뷰에서 page=main으로 보냈다. 바꾸면 대시보드 main 줄이 갈라진다.
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Scroll Depth Reached",
                Map.of("page", "main", "is_webview", true, "depth_percent", 50)
        ));

        assertEquals("Scroll Depth Reached", normalized.event());
        assertEquals("main", normalized.properties().get("page"));
    }

    @Test
    void 메인_Page_Viewed는_is_webview로_웹과_웹뷰_이벤트를_나눈다() {
        MixpanelRawEvent web = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Page Viewed", Map.of("page_name", "main", "is_webview", false)));
        MixpanelRawEvent webview = MixpanelEventNormalizer.normalize(new MixpanelRawEvent(
                "Page Viewed", Map.of("page_name", "main", "is_webview", true)));

        assertEquals("MainPage Visited", web.event());
        assertEquals("WebviewMainPage Visited", webview.event());
    }

    @Test
    void properties가_null이어도_번역한다() {
        MixpanelRawEvent normalized = MixpanelEventNormalizer.normalize(
                new MixpanelRawEvent("Club Card Clicked", null));

        assertEquals("ClubCard Clicked", normalized.event());
        assertNull(normalized.properties().get("clubName"));
    }

    @Test
    void page_name이_없는_페이지_이벤트는_예외없이_이름을_그대로_둔다() {
        MixpanelRawEvent viewed = MixpanelEventNormalizer.normalize(
                new MixpanelRawEvent("Page Viewed", Map.of("club_name", "밴드부")));
        MixpanelRawEvent left = MixpanelEventNormalizer.normalize(
                new MixpanelRawEvent("Page Left", Map.of("duration_seconds", 3)));

        assertEquals("Page Viewed", viewed.event());
        assertEquals("Page Left", left.event());
    }

    @Test
    void properties가_null인_페이지_이벤트도_예외없이_이름을_그대로_둔다() {
        assertEquals("Page Viewed",
                MixpanelEventNormalizer.normalize(new MixpanelRawEvent("Page Viewed", null)).event());
        assertEquals("Page Left",
                MixpanelEventNormalizer.normalize(new MixpanelRawEvent("Page Left", null)).event());
    }

    @Test
    void 새_이벤트명은_Export_요청_목록에_모두_포함된다() {
        assertTrue(MixpanelEventNormalizer.NEW_EVENT_NAMES.containsAll(
                List.of("Page Viewed", "Page Left", "Club Card Clicked", "Feedback Submitted")));
    }
}
