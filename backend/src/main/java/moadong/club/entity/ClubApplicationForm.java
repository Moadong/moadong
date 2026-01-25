package moadong.club.entity;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.data.annotation.Version;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Document("club_application_forms")
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubApplicationForm implements Persistable<String> {
    private static final String[] externalApplicationUrlAllowed = {"https://forms.gle", "https://docs.google.com/forms", "https://form.naver.com", "https://naver.me", "https://everytime.kr"};

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

    @NotNull
    @Builder.Default
    private ApplicationFormMode formMode = ApplicationFormMode.INTERNAL;

    @Builder.Default
    private String externalApplicationUrl = "";

    @Version
    private Long version;

    public ApplicationFormMode getFormMode() {
        return Optional.ofNullable(this.formMode).orElse(ApplicationFormMode.INTERNAL);
    }

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

    public void updateFormMode(ApplicationFormMode formMode) {
        this.formMode = formMode;
    }

    public void updateExternalApplicationUrl(String externalApplicationUrl) {
        boolean allowed = Arrays.stream(externalApplicationUrlAllowed)
                .anyMatch(externalApplicationUrl::startsWith);

        if (!allowed) {
            throw new RestApiException(ErrorCode.NOT_ALLOWED_EXTERNAL_URL);
        }

        this.externalApplicationUrl = externalApplicationUrl.trim();
    }

    @Override
    public boolean isNew() {
        return this.version == null;
    }
}
