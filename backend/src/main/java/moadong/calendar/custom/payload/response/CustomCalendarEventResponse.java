package moadong.calendar.custom.payload.response;

import java.util.List;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import moadong.calendar.custom.entity.CustomEventRecurrence;

public record CustomCalendarEventResponse(
        String id,
        String title,
        String start,
        String end,
        String url,
        String description,
        String source,
        String eventType,
        String color,
        List<String> dates,
        CustomEventRecurrence recurrence
) {
    public static CustomCalendarEventResponse from(CustomCalendarEvent event) {
        return new CustomCalendarEventResponse(
                event.getId(),
                event.getTitle(),
                event.getStart(),
                event.getEnd(),
                event.getUrl(),
                event.getDescription(),
                "CUSTOM",
                event.getEventType() == null ? "SINGLE" : event.getEventType(),
                event.getColor(),
                event.getDates(),
                event.getRecurrence()
        );
    }
}
