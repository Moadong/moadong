package moadong.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document("club_detail_duration_sessions")
@CompoundIndex(name = "session_club_unique", def = "{'sessionId': 1, 'clubId': 1}", unique = true)
@CompoundIndex(name = "club_date_idx", def = "{'clubId': 1, 'date': 1}")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubDetailDurationSession {

    @Id
    private String id;

    @Indexed
    private String sessionId;

    @Indexed
    private String visitorId;

    @Indexed
    private String clubId;

    private String clubName;

    @Indexed
    private LocalDate date;

    private Instant enteredAt;
    private Instant leftAt;
    private long durationSeconds;

    private LocalDateTime createdAt;
}
