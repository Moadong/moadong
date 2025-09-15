package moadong.club.entity;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.SemesterTerm;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Version;
import org.springframework.data.domain.Persistable;
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
public class ClubQuestion  implements Persistable<String> {

    @Id
    private String id;

    private String clubId;

    @NotNull
    @Builder.Default
    private String title = "";

    @NotNull
    @Builder.Default
    private String description = "";

    @Builder.Default
    private List<ClubApplicationQuestion> questions = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    @Builder.Default
    private LocalDateTime editedAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    @NotNull
    @Builder.Default
    private Integer semesterYear = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate().getYear();

    @NotNull
    @Builder.Default
    private SemesterTerm semesterTerm = (ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate().getMonthValue() < 7)
            ? SemesterTerm.FIRST : SemesterTerm.SECOND; //1학기, 2학기

    @Version
    private Long version;

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

    public void updateSemesterYear(Integer semesterYear) {
        this.semesterYear = semesterYear;
    }

    public void updateSemesterTerm(SemesterTerm semesterTerm) {
        this.semesterTerm = semesterTerm;
    }

    @Override
    public boolean isNew() {
        return this.version == null;
    }
}
