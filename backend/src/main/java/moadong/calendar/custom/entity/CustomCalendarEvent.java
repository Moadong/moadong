package moadong.calendar.custom.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    private LocalDateTime updatedAt;

    public void update(String title, String start, String end, String url, String description) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.url = url;
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }
}
