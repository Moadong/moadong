package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.entity.ClubApplicationFormQuestion;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;

import java.util.List;

@Builder
public record ClubApplicationFormResponse(
        String title,
        String description,
        List<ClubApplicationFormQuestion> questions,
        String externalApplicationUrl,
        ApplicationFormMode formMode,
        Integer semesterYear,
        SemesterTerm semesterTerm,
        ApplicationFormStatus status
) {
}