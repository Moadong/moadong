package moadong.club.payload.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ClubApplicantDeleteRequest(
        @NotEmpty
        List<String> applicantIds
) {
}
