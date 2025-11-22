package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.SemesterTerm;

import java.util.List;

public record ClubApplicationFormEditRequest(
        @Size(max = 50)
        String title,

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
}
