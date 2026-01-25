package moadong.club.payload.dto;

import lombok.Builder;

@Builder
public record ClubActiveFormResult(
        String id,
        String title
) {
}
