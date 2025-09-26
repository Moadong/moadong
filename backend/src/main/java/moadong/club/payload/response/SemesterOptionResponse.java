package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.enums.SemesterTerm;

@Builder(toBuilder = true)
public record SemesterOptionResponse(
        int semesterYear,
        SemesterTerm term,
        boolean isExist //해당 학기에 이미 지원서가 존재하는지
) {
}
