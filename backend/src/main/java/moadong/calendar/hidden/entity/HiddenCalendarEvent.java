package moadong.calendar.hidden.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("hidden_calendar_events")
@CompoundIndex(name = "club_source_event_idx", def = "{'clubId': 1, 'source': 1, 'eventId': 1}", unique = true)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiddenCalendarEvent {

    @Id
    private String id;

    private String clubId;

    private String source;

    private String eventId;
}
