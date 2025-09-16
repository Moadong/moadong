package moadong.club.payload.dto;

import java.time.LocalDateTime;

public record ClubApplicationFormsResultItem(
       String id,
       String title,
       LocalDateTime editedAt
) { }
