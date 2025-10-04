package moadong.club.payload.dto;

import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;

import java.time.LocalDateTime;

public interface ClubApplicationFormSlim {
    String getId();
    String getTitle();
    LocalDateTime getEditedAt();
    Integer getSemesterYear();
    SemesterTerm getSemesterTerm();
    ApplicationFormStatus getStatus();
}
