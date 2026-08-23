package moadong.feedback.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.feedback.enums.FeedbackStatus;

public record FeedbackStatusUpdateRequest(
        @NotNull(message = "상태는 필수입니다.")
        FeedbackStatus status
) {
}
