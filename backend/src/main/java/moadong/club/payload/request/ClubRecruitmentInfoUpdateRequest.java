package moadong.club.payload.request;

import java.time.LocalDateTime;

public record ClubRecruitmentInfoUpdateRequest(
    LocalDateTime recruitmentStart,
    LocalDateTime recruitmentEnd,
    String recruitmentTarget,
    String description
) {

}
