package moadong.club.payload.dto;

public record ClubCalendarEventResult(
        String id,
        String title,
        String start,
        String end,
        String url,
        String description
) {
}
