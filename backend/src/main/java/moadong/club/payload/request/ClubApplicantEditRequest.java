package moadong.club.payload.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moadong.club.enums.ApplicationStatus;

public record ClubApplicantEditRequest(
        @NotNull
        @Size(max = 500)
        String memo,

        ApplicationStatus status
) {
}
