package moadong.club.payload.request;

import jakarta.validation.constraints.Positive;

public record AiDraftQuotaGrantRequest(
        @Positive int amount
) {
}
