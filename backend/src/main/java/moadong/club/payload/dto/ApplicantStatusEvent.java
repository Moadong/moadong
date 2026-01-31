package moadong.club.payload.dto;

import moadong.club.enums.ApplicantStatus;
import java.time.LocalDateTime;

public record ApplicantStatusEvent(
    String applicantId,
    ApplicantStatus status,
    String memo,
    LocalDateTime timestamp,
    String clubId,
    String applicationFormId
) {}
