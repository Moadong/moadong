package moadong.club.payload.request;

import java.time.LocalDateTime;

public record ClubDescriptionUpdateRequest(
    String id,
    LocalDateTime recruitmentStart,
    LocalDateTime recruitmentEnd,
    String recruitmentTarget,
    String description
) {

}
