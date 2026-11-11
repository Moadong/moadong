package moadong.calendar.custom.entity;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.calendar.custom.payload.request.CustomCalendarEventRequest;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("custom_calendar_events")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomCalendarEvent {

    @Id
    private String id;

    @Indexed
    private String clubId;

    private String title;

    private String start;

    private String end;

    private String url;

    private String description;

    private String eventType;

    private String color;

    private List<String> dates;

    private CustomEventRecurrence recurrence;

    private LocalDateTime updatedAt;

    public void update(CustomCalendarEventRequest request, String eventType) {
        this.title = request.title();
        this.start = request.start();
        this.end = request.end();
        this.url = request.url();
        this.description = request.description();
        this.eventType = eventType;
        this.color = request.color();
        this.dates = request.dates();
        this.recurrence = request.recurrence();
        this.updatedAt = LocalDateTime.now();
    }

    public void excludeDate(String date) {
        if (recurrence == null) {
            return;
        }
        this.recurrence = recurrence.withExcludedDate(date);
        this.updatedAt = LocalDateTime.now();
    }

    public void updateRecurrenceEnd(String recurrenceEnd) {
        if (recurrence == null) {
            return;
        }
        this.recurrence = recurrence.withEnd(recurrenceEnd);
        this.updatedAt = LocalDateTime.now();
    }
}
