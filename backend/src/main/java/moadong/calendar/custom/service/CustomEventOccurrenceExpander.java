package moadong.calendar.custom.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import moadong.calendar.custom.entity.CustomEventRecurrence;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * 커스텀 이벤트 원형을 공개 캘린더에 표시할 발생일 목록으로 전개한다.
 * PERIOD는 여러 날에 걸친 하나의 일정이므로 전개하지 않고 start 한 건만 반환한다(end는 호출부가 그대로 유지한다).
 * 무기한 반복은 오늘 기준 1년까지만 전개하고, 전체 발생일은 최대 500건으로 제한한다.
 */
@Component
@Slf4j
public class CustomEventOccurrenceExpander {

    private static final int MAX_OCCURRENCES = 500;
    private static final int FUTURE_WINDOW_YEARS = 1;

    public List<String> expand(CustomCalendarEvent event) {
        LocalDate start = parseOrNull(event.getStart());
        if (start == null) {
            return List.of();
        }

        String eventType = StringUtils.hasText(event.getEventType()) ? event.getEventType() : "SINGLE";

        return switch (eventType) {
            case "MULTI" -> expandMulti(event.getDates(), start);
            case "RECURRING" -> expandRecurring(event.getRecurrence(), start);
            default -> List.of(start.toString());
        };
    }

    private List<String> expandMulti(List<String> dates, LocalDate start) {
        if (dates == null || dates.isEmpty()) {
            return List.of(start.toString());
        }

        Set<String> occurrences = new LinkedHashSet<>();
        for (String date : dates) {
            if (parseOrNull(date) != null) {
                occurrences.add(date);
            }
        }
        return occurrences.isEmpty() ? List.of(start.toString()) : List.copyOf(occurrences);
    }

    private List<String> expandRecurring(CustomEventRecurrence recurrence, LocalDate start) {
        if (recurrence == null || !StringUtils.hasText(recurrence.frequency())) {
            return List.of(start.toString());
        }

        LocalDate windowLimit = LocalDate.now().plusYears(FUTURE_WINDOW_YEARS);
        LocalDate recurrenceEnd = parseOrNull(recurrence.end());
        LocalDate windowEnd = (recurrenceEnd != null && recurrenceEnd.isBefore(windowLimit))
                ? recurrenceEnd
                : windowLimit;
        LocalDate visibleStart = recurrenceEnd == null && start.isBefore(LocalDate.now())
                ? LocalDate.now()
                : start;

        if (windowEnd.isBefore(visibleStart)) {
            return List.of();
        }

        Set<String> excludedDates = recurrence.excludedDates() == null
                ? Set.of()
                : Set.copyOf(recurrence.excludedDates());

        return switch (recurrence.frequency()) {
            case "WEEKLY" -> expandWeekly(recurrence.weekdays(), start, visibleStart, windowEnd, excludedDates);
            case "MONTHLY" -> expandMonthly(start, visibleStart, windowEnd, excludedDates);
            case "YEARLY" -> expandYearly(start, visibleStart, windowEnd, excludedDates);
            default -> List.of(start.toString());
        };
    }

    private List<String> expandWeekly(List<Integer> weekdays, LocalDate start, LocalDate visibleStart,
                                      LocalDate windowEnd,
                                      Set<String> excludedDates) {
        Set<Integer> targetWeekdays = (weekdays == null || weekdays.isEmpty())
                ? Set.of(toWeekdayIndex(start))
                : Set.copyOf(weekdays);

        List<String> occurrences = new ArrayList<>();
        for (LocalDate date = visibleStart; !date.isAfter(windowEnd); date = date.plusDays(1)) {
            if (isFull(occurrences, start)) {
                break;
            }
            if (targetWeekdays.contains(toWeekdayIndex(date))) {
                addUnlessExcluded(occurrences, date, excludedDates);
            }
        }
        return occurrences;
    }

    private List<String> expandMonthly(LocalDate start, LocalDate visibleStart, LocalDate windowEnd,
                                       Set<String> excludedDates) {
        int dayOfMonth = start.getDayOfMonth();

        List<String> occurrences = new ArrayList<>();
        for (YearMonth month = YearMonth.from(visibleStart); !month.atDay(1).isAfter(windowEnd); month = month.plusMonths(1)) {
            if (isFull(occurrences, start)) {
                break;
            }
            if (dayOfMonth > month.lengthOfMonth()) {
                continue;
            }
            LocalDate date = month.atDay(dayOfMonth);
            if (!date.isBefore(visibleStart) && !date.isAfter(windowEnd)) {
                addUnlessExcluded(occurrences, date, excludedDates);
            }
        }
        return occurrences;
    }

    private List<String> expandYearly(LocalDate start, LocalDate visibleStart, LocalDate windowEnd,
                                      Set<String> excludedDates) {
        List<String> occurrences = new ArrayList<>();
        for (int year = visibleStart.getYear(); year <= windowEnd.getYear(); year++) {
            if (isFull(occurrences, start)) {
                break;
            }
            YearMonth month = YearMonth.of(year, start.getMonth());
            if (start.getDayOfMonth() > month.lengthOfMonth()) {
                continue;
            }
            LocalDate date = month.atDay(start.getDayOfMonth());
            if (!date.isBefore(visibleStart) && !date.isAfter(windowEnd)) {
                addUnlessExcluded(occurrences, date, excludedDates);
            }
        }
        return occurrences;
    }

    private void addUnlessExcluded(List<String> occurrences, LocalDate date, Set<String> excludedDates) {
        String value = date.toString();
        if (!excludedDates.contains(value)) {
            occurrences.add(value);
        }
    }

    private boolean isFull(List<String> occurrences, LocalDate start) {
        if (occurrences.size() < MAX_OCCURRENCES) {
            return false;
        }
        log.warn("커스텀 이벤트 발생일 전개 상한 도달. start={}, max={}", start, MAX_OCCURRENCES);
        return true;
    }

    /**
     * 프론트 계약(0=일 ~ 6=토)에 맞춰 요일 인덱스를 변환한다.
     */
    private int toWeekdayIndex(LocalDate date) {
        return date.getDayOfWeek().getValue() % 7;
    }

    private LocalDate parseOrNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (Exception e) {
            return null;
        }
    }
}
