package moadong.club.payload.dto;

import java.util.List;

public record ClubApplicationFormsResult(
        Integer semesterYear,
        Boolean active,
        List<ClubApplicationFormsResultItem> forms
){ }
