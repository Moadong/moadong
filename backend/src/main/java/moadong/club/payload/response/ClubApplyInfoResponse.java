package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.payload.dto.ClubApplicantsResult;

import java.util.List;

@Builder
public record ClubApplyInfoResponse(
        int total,
        int reviewRequired,
        int scheduledInterview,
        int accepted,
        List<ClubApplicantsResult> applicants
) {
}
