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
    String category,
    @NotBlank
    String division,
    List<String> tags,
    String introduction,
    String clubPresidentName,
    String telephoneNumber,
    LocalDateTime recruitmentStart,
    LocalDateTime recruitmentEnd,
    String recruitmentTarget
) {

}
