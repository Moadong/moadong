package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.entity.ClubApplicationQuestion;
import moadong.club.enums.SemesterTerm;

import java.util.List;

@Builder
public record ClubApplicationResponse(
        String title,
        String description,
        List<ClubApplicationQuestion> questions,
        Integer semesterYear,
        SemesterTerm semesterTerm
) {
}