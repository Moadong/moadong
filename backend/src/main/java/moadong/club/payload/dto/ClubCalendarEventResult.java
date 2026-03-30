package moadong.club.payload.dto;

public record ClubCalendarEventResult(
        String id,
        String title,
        String start,
        String end,
        String url,
        String description,
        String source
) {
    public static ClubCalendarEventResult ofNotion(
            String id, String title, String start, String end, String url, String description) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "NOTION");
    }

    public static ClubCalendarEventResult ofGoogle(
            String id, String title, String start, String end, String url, String description) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "GOOGLE");
    }
}
