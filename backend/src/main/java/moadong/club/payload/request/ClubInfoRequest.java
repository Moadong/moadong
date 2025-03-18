package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ClubInfoRequest(
    @NotBlank
    String id,
    @NotBlank
    String name,
    @NotBlank
    String category,
    @NotBlank
    String division,
    List<String> tags,
    String introduction,
    String presidentName,
    String presidentPhoneNumber,
    String recruitmentForm
) {

}
