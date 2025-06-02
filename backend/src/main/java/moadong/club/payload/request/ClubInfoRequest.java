package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public record ClubInfoRequest(
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
    Map<String, String> socialLinks
) {

}
