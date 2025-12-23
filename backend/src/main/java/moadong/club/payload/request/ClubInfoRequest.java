package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

import moadong.club.entity.Faq;
import moadong.club.enums.ClubCategory;
import moadong.club.enums.ClubDivision;
import moadong.global.annotation.PhoneNumber;

public record ClubInfoRequest(
    @NotBlank
    String name,
    ClubCategory category,
    ClubDivision division,
    List<String> tags,
    String introduction,
    String presidentName,
    String description,
    List<Faq> faqs,
    @PhoneNumber
    String presidentPhoneNumber,
    Map<String, String> socialLinks
) {

}
