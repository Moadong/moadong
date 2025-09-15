package moadong.club.payload.dto;

import java.time.LocalDateTime;

public record ClubQuestionResultItem (
       String id,
       String title,
       LocalDateTime editedAt
) { }
