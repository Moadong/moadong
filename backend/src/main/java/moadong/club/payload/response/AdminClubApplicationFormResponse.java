package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;

@Builder
public record AdminClubApplicationFormResponse(
        String id,
        String title,
        ApplicationFormMode formMode,
        ApplicationFormStatus status,
        String externalApplicationUrl,
        Integer semesterYear,
        SemesterTerm semesterTerm
) {
    public static AdminClubApplicationFormResponse from(ClubApplicationForm form) {
        return AdminClubApplicationFormResponse.builder()
                .id(form.getId())
                .title(form.getTitle())
                .formMode(form.getFormMode())
                .status(form.getStatus())
                .externalApplicationUrl(form.getExternalApplicationUrl())
                .semesterYear(form.getSemesterYear())
                .semesterTerm(form.getSemesterTerm())
                .build();
    }
}
