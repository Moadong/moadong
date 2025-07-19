package moadong.club.entity;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("club_questions")
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubQuestion {

    @Id
    private String id;

    private String clubId;

    @NotBlank
    @Builder.Default
    private String title = "";

    @NotBlank
    @Builder.Default
    private String description = "";

    @Builder.Default
    private List<ClubApplicationQuestion> questions = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    @Builder.Default
    private LocalDateTime editedAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    public void updateFormTitle(String title) {
        this.title = title;
    }

    public void updateFormDescription(String description) {
        this.description = description;
    }

    public void updateQuestions(List<ClubApplicationQuestion> newQuestions) {
        this.questions.clear();
        this.questions.addAll(newQuestions);
    }

    public void updateEditedAt() {
       this.editedAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();
    }

}
