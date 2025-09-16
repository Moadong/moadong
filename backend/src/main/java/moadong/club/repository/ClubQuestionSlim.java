package moadong.club.repository;

import moadong.club.enums.SemesterTerm;

import java.time.LocalDateTime;

public interface ClubQuestionSlim {
    String getId();
    String getTitle();
    LocalDateTime getEditedAt();
    Integer getSemesterYear();
    SemesterTerm getSemesterTerm();
}
