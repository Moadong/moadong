package moadong.media.webhook.dto;

import jakarta.validation.constraints.NotBlank;

public record ImageEntry(
        @NotBlank String source,
        @NotBlank String destination
) {
}
