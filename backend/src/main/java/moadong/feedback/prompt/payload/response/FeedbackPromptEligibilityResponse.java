package moadong.feedback.prompt.payload.response;

import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.enums.FeedbackPromptIneligibleReason;

public record FeedbackPromptEligibilityResponse(
        boolean eligible,
        FeedbackPromptIneligibleReason reason,
        FeedbackPromptDefinitionResponse prompt
) {

    public static FeedbackPromptEligibilityResponse eligible(FeedbackPromptDefinition definition) {
        return new FeedbackPromptEligibilityResponse(true, null, FeedbackPromptDefinitionResponse.from(definition));
    }

    public static FeedbackPromptEligibilityResponse ineligible(FeedbackPromptIneligibleReason reason) {
        return new FeedbackPromptEligibilityResponse(false, reason, null);
    }
}
