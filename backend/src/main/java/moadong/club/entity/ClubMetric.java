package moadong.club.entity;

import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("club_metrics")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ClubMetric {

    @Id
    private String id;

    private String clubId;

    private String ip;

    private LocalDateTime inAt;

    private LocalDateTime outAt;

    private LocalDate date;

    @Builder
    public ClubMetric(String clubId, String ip) {
        LocalDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();
        this.clubId = clubId;
        this.ip = ip;
        this.inAt = now;
        this.outAt = now;
        this.date = now.toLocalDate();
    }

    public void update() {
        this.outAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();
    }
}
