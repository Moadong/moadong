package moadong.club.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ApplicationStatus;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("club_applications")
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubApplication {

    @Id
    private String id;

    private String questionId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Builder.Default
    private String memo = "";

    @Builder.Default
    private List<ClubQuestionAnswer> answers = new ArrayList<>();

    @Builder.Default
    LocalDateTime createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    public void updateDetail(String memo, ApplicationStatus status) {
        this.memo = memo;
        this.status = status;
    }
}
