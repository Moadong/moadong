package moadong.club.payload.request;

import java.time.LocalDateTime;
import java.util.List;
import moadong.club.entity.Faq;

public record ClubRecruitmentInfoUpdateRequest(
    LocalDateTime recruitmentStart,
    LocalDateTime recruitmentEnd,
    String recruitmentTarget,
    String description,
    List<Faq> faqs
) {

}
