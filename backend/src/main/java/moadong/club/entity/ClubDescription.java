package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
}
