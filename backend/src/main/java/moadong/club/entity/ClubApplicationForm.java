package moadong.club.entity;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ApplicantStatus;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;
import org.springframework.data.annotation.Version;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("club_application_forms")
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubApplicationForm implements Persistable<String> {

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
    private List<ClubApplicationFormQuestion> questions = new ArrayList<>();

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

    @Builder.Default
    private ApplicationFormStatus status = ApplicationFormStatus.UNPUBLISHED;

    @Version
    private Long version;

    public void updateFormTitle(String title) {
        this.title = title;
    }

    public void updateFormDescription(String description) {
        this.description = description;
    }

    public void updateQuestions(List<ClubApplicationFormQuestion> newQuestions) {
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

    public void updateFormStatus(boolean activeFlag) {
        this.status = ApplicationFormStatus.fromFlag(this.status, activeFlag);
    }

    @Override
    public boolean isNew() {
        return this.version == null;
    }
}
