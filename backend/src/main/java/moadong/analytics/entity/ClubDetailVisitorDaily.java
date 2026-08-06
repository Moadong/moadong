package moadong.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document("club_detail_visitor_daily")
@CompoundIndex(name = "club_date_visitor_unique", def = "{'clubId': 1, 'date': 1, 'visitorId': 1}", unique = true)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubDetailVisitorDaily {

    @Id
    private String id;

    @Indexed
    private LocalDate date;

    @Indexed
    private String clubId;

    @Indexed
    private String visitorId;

    private long durationSumSeconds;
    private long sessionCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
