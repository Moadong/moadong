package moadong.feedback.prompt.payload.response;

import java.util.List;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;

public record FeedbackPromptListResponse(
        List<FeedbackPromptDefinitionResponse> prompts
) {

    public static FeedbackPromptListResponse from(List<FeedbackPromptDefinition> definitions) {
        return new FeedbackPromptListResponse(definitions.stream()
                .map(definition -> FeedbackPromptAdminDefinitionResponse.from(definition).prompt())
                .toList());
    }
}
