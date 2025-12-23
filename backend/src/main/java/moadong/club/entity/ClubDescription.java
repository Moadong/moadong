package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.club.payload.dto.ClubDescriptionDto;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClubDescription {

    private String introDescription;

    private String activityDescription;

    private List<ClubAward> awards;

    private ClubIdealCandidate idealCandidate;

    private String benefits;

    private List<Faq> faqs;

    public static ClubDescription from(ClubDescriptionDto dto) {
        if (dto == null) return null;
        return ClubDescription.builder()
                .introDescription(dto.introDescription())
                .activityDescription(dto.activityDescription())
                .awards(dto.awards() == null ? null : dto.awards().stream().map(ClubAward::from).toList())
                .idealCandidate(ClubIdealCandidate.from(dto.idealCandidate()))
                .benefits(dto.benefits())
                .faqs(dto.faqs() == null ? null : dto.faqs().stream().map(Faq::from).toList())
                .build();
    }
}
