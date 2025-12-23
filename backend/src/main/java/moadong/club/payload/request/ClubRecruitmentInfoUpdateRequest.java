package moadong.club.payload.request;

import java.time.Instant;

public record ClubRecruitmentInfoUpdateRequest(
    Instant recruitmentStart,
    Instant recruitmentEnd,
    String recruitmentTarget,
    String externalApplicationUrl
) {

}
