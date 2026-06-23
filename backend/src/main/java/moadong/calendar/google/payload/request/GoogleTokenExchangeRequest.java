package moadong.calendar.google.payload.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleTokenExchangeRequest(
        @NotBlank String code
) {
}
