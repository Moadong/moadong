package moadong.club.payload.request;

import java.time.LocalDateTime;
import java.util.List;

public record ClubUpdateRequest(
    String clubId,
    String name,
    String classification,
    String division,
    List<String> tags,
    String introduction,
    String description,
    String clubPresidentName,
    String telephoneNumber,
    LocalDateTime recruitmentStart,
    LocalDateTime recruitmentEnd,
    String recruitmentTarget
) {

}
