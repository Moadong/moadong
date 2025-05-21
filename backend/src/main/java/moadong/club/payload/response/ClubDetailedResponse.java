package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.payload.dto.ClubDetailedResult;

@Builder
public record ClubDetailedResponse(
    ClubDetailedResult club
) {
}
