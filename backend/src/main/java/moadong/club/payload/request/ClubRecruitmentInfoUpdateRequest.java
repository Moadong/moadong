package moadong.club.payload.request;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import moadong.club.entity.Faq;

public record ClubRecruitmentInfoUpdateRequest(
    Instant recruitmentStart,
    Instant recruitmentEnd,
    String recruitmentTarget,
    String description,
    String externalApplicationUrl,
    List<Faq> faqs
) {

}
