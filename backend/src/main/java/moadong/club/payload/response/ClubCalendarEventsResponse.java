package moadong.club.payload.response;

import java.util.List;
import moadong.club.payload.dto.ClubCalendarEventResult;

public record ClubCalendarEventsResponse(
        List<ClubCalendarEventResult> calendarEvents
) {
    public ClubCalendarEventsResponse {
        calendarEvents = calendarEvents == null ? List.of() : calendarEvents;
    }
}
