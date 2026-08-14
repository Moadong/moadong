package moadong.club.payload.dto;

public record ClubCalendarEventResult(
        String id,
        String title,
        String start,
        String end,
        String url,
        String description,
        String source,
        String eventType,
        String color
) {
    public static ClubCalendarEventResult ofNotion(
            String id, String title, String start, String end, String url, String description) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "NOTION", null, null);
    }

    public static ClubCalendarEventResult ofGoogle(
            String id, String title, String start, String end, String url, String description) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "GOOGLE", null, null);
    }

    public static ClubCalendarEventResult ofCustom(
            String id, String title, String start, String end, String url, String description,
            String eventType, String color) {
        return new ClubCalendarEventResult(id, title, start, end, url, description, "CUSTOM", eventType, color);
    }
}
