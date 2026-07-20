package moadong.calendar.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;
import moadong.calendar.custom.service.CustomCalendarEventService;
import moadong.calendar.google.service.GoogleOAuthService;
import moadong.calendar.hidden.service.HiddenCalendarEventService;
import moadong.calendar.notion.service.NotionOAuthService;
import moadong.club.payload.dto.ClubCalendarEventResult;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

@UnitTest
class CalendarAggregationServiceTest {

    @Mock
    private NotionOAuthService notionOAuthService;

    @Mock
    private GoogleOAuthService googleOAuthService;

    @Mock
    private CustomCalendarEventService customCalendarEventService;

    @Mock
    private HiddenCalendarEventService hiddenCalendarEventService;

    private CalendarAggregationService calendarAggregationService;

    private static final String CLUB_ID = "test-club-id";

    @BeforeEach
    void setUp() {
        calendarAggregationService = new CalendarAggregationService(
                notionOAuthService, googleOAuthService, customCalendarEventService, hiddenCalendarEventService);
    }

    @Test
    @DisplayName("Notion과 Google 이벤트를 병합하여 시작일 기준 정렬한다")
    void getAggregatedEvents_mergesAndSortsByStart() {
        ClubCalendarEventResult notionEvent = ClubCalendarEventResult.ofNotion(
                "notion-1", "Notion 이벤트", "2026-04-02", null, null, null);
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-01", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(notionEvent));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).source()).isEqualTo("GOOGLE");
        assertThat(results.get(1).source()).isEqualTo("NOTION");
    }

    @Test
    @DisplayName("Notion 조회 실패 시 Google 이벤트만 반환한다")
    void getAggregatedEvents_notionFails_returnsGoogleOnly() {
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-01", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Notion 오류"));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).source()).isEqualTo("GOOGLE");
    }

    @Test
    @DisplayName("Google 조회 실패 시 Notion 이벤트만 반환한다")
    void getAggregatedEvents_googleFails_returnsNotionOnly() {
        ClubCalendarEventResult notionEvent = ClubCalendarEventResult.ofNotion(
                "notion-1", "Notion 이벤트", "2026-04-01", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(notionEvent));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Google 오류"));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).source()).isEqualTo("NOTION");
    }

    @Test
    @DisplayName("커스텀 이벤트도 함께 병합하여 시작일 기준 정렬한다")
    void getAggregatedEvents_includesCustomEvents() {
        ClubCalendarEventResult notionEvent = ClubCalendarEventResult.ofNotion(
                "notion-1", "Notion 이벤트", "2026-04-03", null, null, null);
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-01", null, null, null);
        ClubCalendarEventResult customEvent = ClubCalendarEventResult.ofCustom(
                "custom-1", "커스텀 이벤트", "2026-04-02", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(notionEvent));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));
        when(customCalendarEventService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(customEvent));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(3);
        assertThat(results.get(0).source()).isEqualTo("GOOGLE");
        assertThat(results.get(1).source()).isEqualTo("CUSTOM");
        assertThat(results.get(2).source()).isEqualTo("NOTION");
    }

    @Test
    @DisplayName("숨김 목록의 GOOGLE/NOTION 이벤트는 결과에서 제외된다")
    void getAggregatedEvents_excludesHiddenEvents() {
        ClubCalendarEventResult notionEvent = ClubCalendarEventResult.ofNotion(
                "notion-1", "Notion 이벤트", "2026-04-01", null, null, null);
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-02", null, null, null);
        ClubCalendarEventResult customEvent = ClubCalendarEventResult.ofCustom(
                "custom-1", "커스텀 이벤트", "2026-04-03", null, null, null);

        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(notionEvent));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));
        when(customCalendarEventService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(customEvent));
        when(hiddenCalendarEventService.getHiddenKeys(CLUB_ID)).thenReturn(Set.of("GOOGLE:google-1"));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(2);
        assertThat(results.get(0).source()).isEqualTo("NOTION");
        assertThat(results.get(1).source()).isEqualTo("CUSTOM");
    }

    @Test
    @DisplayName("숨김 목록 조회가 실패해도 이벤트는 그대로 반환된다")
    void getAggregatedEvents_hiddenLookupFails_returnsAllEvents() {
        ClubCalendarEventResult googleEvent = ClubCalendarEventResult.ofGoogle(
                "google-1", "Google 이벤트", "2026-04-01", null, null, null);

        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenReturn(List.of(googleEvent));
        when(hiddenCalendarEventService.getHiddenKeys(CLUB_ID)).thenThrow(new RuntimeException("조회 오류"));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).source()).isEqualTo("GOOGLE");
    }

    @Test
    @DisplayName("둘 다 실패 시 빈 리스트를 반환한다")
    void getAggregatedEvents_bothFail_returnsEmpty() {
        when(notionOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Notion 오류"));
        when(googleOAuthService.getClubCalendarEvents(CLUB_ID)).thenThrow(new RuntimeException("Google 오류"));

        List<ClubCalendarEventResult> results = calendarAggregationService.getAggregatedEvents(CLUB_ID);

        assertThat(results).isEmpty();
    }

    @Test
    @DisplayName("Notion만 연결된 경우 true를 반환한다")
    void hasAnyCalendarConnection_notionOnly_returnsTrue() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(true);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Google만 연결된 경우 true를 반환한다")
    void hasAnyCalendarConnection_googleOnly_returnsTrue() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(true);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("커스텀 이벤트만 있는 경우 true를 반환한다")
    void hasAnyCalendarConnection_customOnly_returnsTrue() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(customCalendarEventService.hasCalendarConnection(CLUB_ID)).thenReturn(true);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("둘 다 연결되지 않은 경우 false를 반환한다")
    void hasAnyCalendarConnection_noneConnected_returnsFalse() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isFalse();
    }
}
