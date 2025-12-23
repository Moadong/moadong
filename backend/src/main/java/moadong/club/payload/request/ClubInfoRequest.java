package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import moadong.club.entity.ClubDescription;
import moadong.club.enums.ClubCategory;
import moadong.club.enums.ClubDivision;
import moadong.global.annotation.PhoneNumber;

import java.util.List;
import java.util.Map;

public record ClubInfoRequest(
    @NotBlank
    String name,
    ClubCategory category,
    ClubDivision division,
    List<String> tags,
    String introduction,
    String presidentName,
    ClubDescription description,
    @PhoneNumber
    String presidentPhoneNumber,
    Map<String, String> socialLinks
) {

}
