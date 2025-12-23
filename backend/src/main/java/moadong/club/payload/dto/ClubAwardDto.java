package moadong.club.payload.dto;

import jakarta.validation.constraints.Size;
import moadong.club.entity.ClubAward;

import java.util.List;

public record ClubAwardDto(
    @Size(max = 50)
    String semester,
    
    List<@Size(max = 100) String> achievements
) {
    public static ClubAwardDto from(ClubAward clubAward) {
        if (clubAward == null) return null;
        return new ClubAwardDto(clubAward.getSemester(), clubAward.getAchievements());
    }

    public ClubAward toEntity() {
        return ClubAward.builder()
                .semester(semester)
                .achievements(achievements)
                .build();
    }
}
