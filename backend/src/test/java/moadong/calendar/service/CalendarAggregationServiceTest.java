package moadong.calendar.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import moadong.calendar.google.service.GoogleOAuthService;
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

    private CalendarAggregationService calendarAggregationService;

    private static final String CLUB_ID = "test-club-id";

    @BeforeEach
    void setUp() {
        calendarAggregationService = new CalendarAggregationService(notionOAuthService, googleOAuthService);
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
    @DisplayName("둘 다 연결되지 않은 경우 false를 반환한다")
    void hasAnyCalendarConnection_noneConnected_returnsFalse() {
        when(notionOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);
        when(googleOAuthService.hasCalendarConnection(CLUB_ID)).thenReturn(false);

        boolean result = calendarAggregationService.hasAnyCalendarConnection(CLUB_ID);

        assertThat(result).isFalse();
    }
}
