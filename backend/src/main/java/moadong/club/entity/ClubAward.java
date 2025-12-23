package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.club.payload.dto.ClubAwardDto;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClubAward {

    private String semester;

    private List<String> achievements;

    public static ClubAward from(ClubAwardDto dto) {
        if (dto == null) return null;
        return ClubAward.builder()
                .semester(dto.semester())
                .achievements(dto.achievements())
                .build();
    }
}
