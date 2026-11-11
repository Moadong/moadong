package moadong.calendar.hidden.payload.request;

import jakarta.validation.constraints.NotBlank;

public record HiddenCalendarEventRequest(
        @NotBlank String source,
        @NotBlank String eventId
) {
}
