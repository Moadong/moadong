package moadong.calendar.custom.payload.request;

import jakarta.validation.constraints.NotBlank;

public record CustomCalendarEventRequest(
        @NotBlank String title,
        @NotBlank String start,
        String end,
        String url,
        String description
) {
}
