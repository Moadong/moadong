package moadong.calendar.custom.payload.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import moadong.calendar.custom.entity.CustomEventRecurrence;

public record CustomCalendarEventRequest(
        @NotBlank String title,
        @NotBlank String start,
        String end,
        String url,
        String description,
        String eventType,
        String color,
        List<String> dates,
        CustomEventRecurrence recurrence
) {
}
