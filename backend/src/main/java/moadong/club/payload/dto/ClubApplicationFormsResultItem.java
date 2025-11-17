package moadong.club.payload.dto;

import moadong.club.enums.ApplicationFormStatus;

import java.time.LocalDateTime;

public record ClubApplicationFormsResultItem(
       String id,
       String title,
       LocalDateTime editedAt,
       ApplicationFormStatus status
) { }
