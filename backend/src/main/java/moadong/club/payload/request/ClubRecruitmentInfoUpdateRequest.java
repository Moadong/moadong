package moadong.club.payload.request;

import java.time.LocalDateTime;

public record ClubRecruitmentInfoUpdateRequest(
        String id,
        LocalDateTime recruitmentStart,
        LocalDateTime recruitmentEnd,
        String recruitmentTarget,
        String description
) {

}
