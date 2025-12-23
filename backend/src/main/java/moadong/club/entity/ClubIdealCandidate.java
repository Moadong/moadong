package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.club.payload.dto.ClubIdealCandidateDto;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClubIdealCandidate {

    private List<String> tags;

    private String content;

    public static ClubIdealCandidate from(ClubIdealCandidateDto dto) {
        if (dto == null) return null;
        return ClubIdealCandidate.builder()
                .tags(dto.tags())
                .content(dto.content())
                .build();
    }
}
