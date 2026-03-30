package moadong.calendar.google.payload.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleCalendarSelectRequest(
        @NotBlank String calendarId,
        String calendarName
) {
}
