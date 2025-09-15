package moadong.club.payload.dto;

import moadong.club.enums.SemesterTerm;
import java.util.List;

public record ClubQuestionsResult (
        Integer semesterYear,
        SemesterTerm semesterTerm,
        List<ClubQuestionResultItem> questions
){ }