package moadong.feedback.prompt.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;

public record FeedbackPromptDismissRequest(
        @NotNull FeedbackPromptTriggerType triggerType,
        String clubId,
        String anonymousClientId
) {
}
