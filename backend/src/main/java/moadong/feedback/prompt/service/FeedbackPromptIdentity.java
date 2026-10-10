package moadong.feedback.prompt.service;

import moadong.feedback.prompt.enums.FeedbackPromptAudience;

public record FeedbackPromptIdentity(
        FeedbackPromptAudience audience,
        String userId,
        String anonymousClientId,
        String clubId
) {
}
