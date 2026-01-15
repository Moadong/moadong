package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.club.enums.SemesterTerm;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClubAward {

    private int year;

    private SemesterTerm semesterTerm;

    private List<String> achievements;
}
