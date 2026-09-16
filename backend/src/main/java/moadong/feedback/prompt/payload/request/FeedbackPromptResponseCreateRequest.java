package moadong.feedback.prompt.payload.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;

public record FeedbackPromptResponseCreateRequest(
        @NotNull FeedbackPromptTriggerType triggerType,
        String clubId,
        String anonymousClientId,
        @NotNull FeedbackPromptRating rating,
        @Size(max = 8) List<String> reasonOptionIds,
        @Size(max = 500) String comment,
        FeedbackPromptClientContextRequest clientContext
) {
    public List<String> normalizedReasonOptionIds() {
        return reasonOptionIds == null ? List.of() : reasonOptionIds;
    }
}
