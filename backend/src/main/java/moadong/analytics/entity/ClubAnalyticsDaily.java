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

@Document("club_analytics_daily")
@CompoundIndex(name = "date_club_unique", def = "{'date': 1, 'clubId': 1}", unique = true)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubAnalyticsDaily {

    @Id
    private String id;

    @Indexed
    private LocalDate date;

    @Indexed
    private String clubId;

    private String clubName;

    private long detailViewCount;
    private long detailDurationSumSeconds;
    private long detailDurationCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
