package moadong.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document("mixpanel_backfilled_events")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MixpanelBackfilledEvent {

    @Id
    private String insertId;

    @Indexed
    private String eventName;

    @Indexed
    private LocalDate eventDate;

    private LocalDateTime backfilledAt;
}
