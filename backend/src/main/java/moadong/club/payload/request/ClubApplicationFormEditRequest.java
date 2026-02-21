package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.SemesterTerm;
import org.springframework.util.StringUtils;

import java.util.List;

public record ClubApplicationFormEditRequest(
        @NotBlank
        @Size(max = 50)
        String title,

        @NotBlank
        @Size(max = 3000)
        String description,

        Boolean active,

        @Valid
        List<ClubApplyQuestion> questions,

        String externalApplicationUrl,

        ApplicationFormMode formMode,

        @Min(2000)
        @Max(2999)
        Integer semesterYear,

        SemesterTerm semesterTerm
) {

    @AssertTrue(message = "지원서 양식에 필요한 필드가 누락되었습니다.")
    private boolean isInternalFormValid() {
        if (formMode != ApplicationFormMode.INTERNAL) {
            return true;
        }

        boolean hasDescription = StringUtils.hasText(description);
        boolean hasQuestions = questions != null && !questions.isEmpty();

        return hasDescription && hasQuestions;
    }

    @AssertTrue(message = "외부 링크가 누락되었습니다.")
    private boolean isExternalFormValid() {
        if (formMode != ApplicationFormMode.EXTERNAL) {
            return true;
        }

        return StringUtils.hasText(externalApplicationUrl);
    }
}
