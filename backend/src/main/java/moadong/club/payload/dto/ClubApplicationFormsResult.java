package moadong.club.payload.dto;

import moadong.club.enums.SemesterTerm;
import java.util.List;

public record ClubApplicationFormsResult(
        Integer semesterYear,
        SemesterTerm semesterTerm,
        List<ClubApplicationFormsResultItem> forms
){ }