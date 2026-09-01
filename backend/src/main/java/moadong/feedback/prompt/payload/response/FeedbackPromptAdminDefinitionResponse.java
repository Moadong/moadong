package moadong.feedback.prompt.payload.response;

import moadong.feedback.prompt.entity.FeedbackPromptDefinition;

public record FeedbackPromptAdminDefinitionResponse(
        FeedbackPromptDefinitionResponse prompt
) {

    public static FeedbackPromptAdminDefinitionResponse from(FeedbackPromptDefinition definition) {
        FeedbackPromptDefinitionResponse base = FeedbackPromptDefinitionResponse.from(definition);
        return new FeedbackPromptAdminDefinitionResponse(new FeedbackPromptDefinitionResponse(
                base.id(),
                base.triggerType(),
                base.audience(),
                base.title(),
                base.description(),
                base.ratingOptions(),
                FeedbackPromptDefinitionResponse.FollowUpResponse.adminFrom(definition.getFollowUp()),
                base.exposurePolicy(),
                base.displayOrder(),
                base.active(),
                base.createdAt(),
                base.updatedAt()));
    }
}
