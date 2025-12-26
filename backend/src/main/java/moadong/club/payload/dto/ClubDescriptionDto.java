package moadong.club.payload.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import moadong.club.entity.ClubDescription;

import java.util.List;

public record ClubDescriptionDto(
    @Size(max = 500)
    String introDescription,

    @Size(max = 1000)
    String activityDescription,

    @Valid
    List<ClubAwardDto> awards,

    @Valid
    ClubIdealCandidateDto idealCandidate,

    @Size(max = 1000)
    String benefits,

    @Valid
    List<FaqDto> faqs
) {
    public static ClubDescriptionDto from(ClubDescription description) {
        if (description == null) return null;
        return new ClubDescriptionDto(
            description.getIntroDescription(),
            description.getActivityDescription(),
            description.getAwards() == null ? null : description.getAwards().stream().map(ClubAwardDto::from).toList(),
            ClubIdealCandidateDto.from(description.getIdealCandidate()),
            description.getBenefits(),
            description.getFaqs() == null ? null : description.getFaqs().stream().map(FaqDto::from).toList()
        );
    }

    public ClubDescription toEntity() {
        return ClubDescription.builder()
                .introDescription(introDescription)
                .activityDescription(activityDescription)
                .awards(awards == null ? null : awards.stream().map(ClubAwardDto::toEntity).toList())
                .idealCandidate(idealCandidate == null ? null : idealCandidate.toEntity())
                .benefits(benefits)
                .faqs(faqs == null ? null : faqs.stream().map(FaqDto::toEntity).toList())
                .build();
    }
}
