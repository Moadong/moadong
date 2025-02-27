package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public record ClubInfoRequest(
    @NotBlank
    String clubId,
    @NotBlank
    String name,
    @NotBlank
    String classification,
    @NotBlank
    String division,
    List<String> tags,
    String thumbnail,
    String introduction,
    String clubPresidentName,
    String telephoneNumber,
    LocalDateTime recruitmentStart,
    LocalDateTime recruitmentEnd,
    String recruitmentTarget
) {

}
