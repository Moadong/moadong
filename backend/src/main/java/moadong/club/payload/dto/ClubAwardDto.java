package moadong.club.payload.dto;

import jakarta.validation.constraints.Size;
import moadong.club.entity.ClubAward;
import moadong.club.enums.SemesterTerm;
import org.hibernate.validator.constraints.Range;

import java.util.List;

public record ClubAwardDto(
    @Range(min = 1900, max = 2050)
    int year,
    SemesterTerm semesterTerm,
    
    List<@Size(max = 100) String> achievements
) {
    public static ClubAwardDto from(ClubAward clubAward) {
        if (clubAward == null) return null;
        return new ClubAwardDto(clubAward.getYear(), clubAward.getSemesterTerm(), clubAward.getAchievements());
    }

    public ClubAward toEntity() {
        return ClubAward.builder()
                .year(year)
                .semesterTerm(semesterTerm)
                .achievements(achievements)
                .build();
    }
}
