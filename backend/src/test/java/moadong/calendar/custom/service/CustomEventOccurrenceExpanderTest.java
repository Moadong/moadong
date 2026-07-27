package moadong.calendar.custom.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import moadong.calendar.custom.entity.CustomEventRecurrence;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@UnitTest
class CustomEventOccurrenceExpanderTest {

    private CustomEventOccurrenceExpander expander;

    @BeforeEach
    void setUp() {
        expander = new CustomEventOccurrenceExpander();
    }

    private CustomCalendarEvent event(String eventType, String start, String end,
                                      List<String> dates, CustomEventRecurrence recurrence) {
        return CustomCalendarEvent.builder()
                .id("event-1")
                .clubId("club-1")
                .title("일정")
                .start(start)
                .end(end)
                .eventType(eventType)
                .dates(dates)
                .recurrence(recurrence)
                .build();
    }

    @Test
    @DisplayName("SINGLE은 start 하루만 전개한다")
    void expand_single() {
        assertThat(expander.expand(event("SINGLE", "2026-03-01", null, null, null)))
                .containsExactly("2026-03-01");
    }

    @Test
    @DisplayName("eventType이 없으면 SINGLE로 취급한다")
    void expand_nullEventType_treatedAsSingle() {
        assertThat(expander.expand(event(null, "2026-03-01", "2026-03-05", null, null)))
                .containsExactly("2026-03-01");
    }

    @Test
    @DisplayName("PERIOD는 start부터 end까지 매일 전개한다")
    void expand_period() {
        assertThat(expander.expand(event("PERIOD", "2026-03-01", "2026-03-05", null, null)))
                .containsExactly("2026-03-01", "2026-03-02", "2026-03-03", "2026-03-04", "2026-03-05");
    }

    @Test
    @DisplayName("PERIOD에 end가 없으면 start 하루만 전개한다")
    void expand_periodWithoutEnd() {
        assertThat(expander.expand(event("PERIOD", "2026-03-01", null, null, null)))
                .containsExactly("2026-03-01");
    }

    @Test
    @DisplayName("MULTI는 dates의 각 날짜를 전개한다")
    void expand_multi() {
        List<String> dates = List.of("2026-03-01", "2026-03-10", "2026-03-20");

        assertThat(expander.expand(event("MULTI", "2026-03-01", null, dates, null)))
                .containsExactlyElementsOf(dates);
    }

    @Test
    @DisplayName("MULTI에 dates가 비어있으면 start 하루만 전개한다")
    void expand_multiWithoutDates() {
        assertThat(expander.expand(event("MULTI", "2026-03-01", null, List.of(), null)))
                .containsExactly("2026-03-01");
    }

    @Test
    @DisplayName("WEEKLY는 지정한 요일마다 전개한다")
    void expand_weeklyWithWeekdays() {
        // 2026-03-06(금, 5), 2026-03-07(토, 6)
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("WEEKLY", List.of(5, 6), "2026-03-31", null);

        assertThat(expander.expand(event("RECURRING", "2026-03-06", null, null, recurrence)))
                .containsExactly("2026-03-06", "2026-03-07", "2026-03-13", "2026-03-14",
                        "2026-03-20", "2026-03-21", "2026-03-27", "2026-03-28");
    }

    @Test
    @DisplayName("WEEKLY에 weekdays가 없으면 start의 요일로 반복한다")
    void expand_weeklyWithoutWeekdays() {
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("WEEKLY", null, "2026-03-31", null);

        assertThat(expander.expand(event("RECURRING", "2026-03-06", null, null, recurrence)))
                .containsExactly("2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27");
    }

    @Test
    @DisplayName("MONTHLY는 매월 start의 일자로 반복하고 없는 날짜는 건너뛴다")
    void expand_monthlySkipsShortMonths() {
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("MONTHLY", null, "2026-06-30", null);

        assertThat(expander.expand(event("RECURRING", "2026-01-31", null, null, recurrence)))
                .containsExactly("2026-01-31", "2026-03-31", "2026-05-31");
    }

    @Test
    @DisplayName("YEARLY는 매년 start의 월/일로 반복한다")
    void expand_yearly() {
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("YEARLY", null, "2026-12-31", null);

        assertThat(expander.expand(event("RECURRING", "2024-05-01", null, null, recurrence)))
                .containsExactly("2024-05-01", "2025-05-01", "2026-05-01");
    }

    @Test
    @DisplayName("YEARLY는 윤년이 아닌 해의 2월 29일을 건너뛴다")
    void expand_yearlySkipsNonLeapYears() {
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("YEARLY", null, "2026-12-31", null);

        assertThat(expander.expand(event("RECURRING", "2024-02-29", null, null, recurrence)))
                .containsExactly("2024-02-29");
    }

    @Test
    @DisplayName("excludedDates에 포함된 발생일은 제외한다")
    void expand_excludesExcludedDates() {
        CustomEventRecurrence recurrence = new CustomEventRecurrence(
                "WEEKLY", null, "2026-03-31", List.of("2026-03-13"));

        assertThat(expander.expand(event("RECURRING", "2026-03-06", null, null, recurrence)))
                .containsExactly("2026-03-06", "2026-03-20", "2026-03-27");
    }

    @Test
    @DisplayName("반복 종료일이 시작일보다 앞이면 발생일이 없다")
    void expand_recurrenceEndBeforeStart() {
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("WEEKLY", null, "2026-02-28", null);

        assertThat(expander.expand(event("RECURRING", "2026-03-06", null, null, recurrence)))
                .isEmpty();
    }

    @Test
    @DisplayName("반복 종료일이 없으면 오늘 기준 1년까지만 전개한다")
    void expand_unboundedRecurrenceStopsAtWindowLimit() {
        CustomEventRecurrence recurrence = new CustomEventRecurrence("MONTHLY", null, null, null);
        LocalDate windowLimit = LocalDate.now().plusYears(1);

        List<String> occurrences = expander.expand(event("RECURRING", "2026-03-01", null, null, recurrence));

        assertThat(occurrences).isNotEmpty();
        assertThat(occurrences).allSatisfy(date ->
                assertThat(LocalDate.parse(date)).isBeforeOrEqualTo(windowLimit));
    }

    @Test
    @DisplayName("RECURRING인데 recurrence가 없으면 start 하루만 전개한다")
    void expand_recurringWithoutRecurrence() {
        assertThat(expander.expand(event("RECURRING", "2026-03-01", null, null, null)))
                .containsExactly("2026-03-01");
    }

    @Test
    @DisplayName("start가 없거나 형식이 잘못되면 발생일이 없다")
    void expand_invalidStart() {
        assertThat(expander.expand(event("SINGLE", "2026/03/01", null, null, null))).isEmpty();
        assertThat(expander.expand(event("SINGLE", null, null, null, null))).isEmpty();
    }
}
