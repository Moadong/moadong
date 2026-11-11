package moadong.calendar.custom.entity;

import java.util.ArrayList;
import java.util.List;

public record CustomEventRecurrence(
        String frequency,
        List<Integer> weekdays,
        String end,
        List<String> excludedDates
) {
    public CustomEventRecurrence withExcludedDate(String date) {
        List<String> updated = excludedDates == null ? new ArrayList<>() : new ArrayList<>(excludedDates);
        if (!updated.contains(date)) {
            updated.add(date);
        }
        return new CustomEventRecurrence(frequency, weekdays, end, updated);
    }

    public CustomEventRecurrence withEnd(String newEnd) {
        return new CustomEventRecurrence(frequency, weekdays, newEnd, excludedDates);
    }
}
