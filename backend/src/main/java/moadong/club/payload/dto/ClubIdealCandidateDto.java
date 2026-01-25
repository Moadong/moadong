package moadong.club.payload.dto;

import jakarta.validation.constraints.Size;
import moadong.club.entity.ClubIdealCandidate;

import java.util.List;

public record ClubIdealCandidateDto(
    List<@Size(max = 10) String> tags,

    @Size(max = 700)
    String content
) {
    public static ClubIdealCandidateDto from(ClubIdealCandidate candidate) {
        if (candidate == null) return null;
        return new ClubIdealCandidateDto(candidate.getTags(), candidate.getContent());
    }

    public ClubIdealCandidate toEntity() {
        return ClubIdealCandidate.builder()
                .tags(tags)
                .content(content)
                .build();
    }
}
