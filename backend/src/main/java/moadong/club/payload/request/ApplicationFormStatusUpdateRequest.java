package moadong.club.payload.request;

import jakarta.validation.constraints.NotNull;

public record ApplicationFormStatusUpdateRequest(
        @NotNull Boolean active
) {
}
