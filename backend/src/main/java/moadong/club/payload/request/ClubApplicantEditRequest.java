package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moadong.club.enums.ApplicantStatus;

public record ClubApplicantEditRequest(
        @NotBlank
        String applicantId,

        @NotNull
        @Size(max = 500)
        String memo,

        @NotNull
        ApplicantStatus status
) {
}
