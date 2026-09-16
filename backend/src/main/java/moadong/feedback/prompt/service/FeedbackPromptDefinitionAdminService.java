package moadong.feedback.prompt.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.payload.request.FeedbackPromptDefinitionRequest;
import moadong.feedback.prompt.payload.response.FeedbackPromptAdminDefinitionResponse;
import moadong.feedback.prompt.payload.response.FeedbackPromptDefinitionResponse;
import moadong.feedback.prompt.payload.response.FeedbackPromptListResponse;
import moadong.feedback.prompt.repository.FeedbackPromptDefinitionRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackPromptDefinitionAdminService {

    private final FeedbackPromptDefinitionRepository definitionRepository;
    private final FeedbackPromptDefinitionValidator validator;

    public FeedbackPromptListResponse getPrompts() {
        return FeedbackPromptListResponse.from(definitionRepository.findAllByOrderByAudienceAscTriggerTypeAscDisplayOrderAsc());
    }

    public FeedbackPromptAdminDefinitionResponse getPrompt(String promptId) {
        FeedbackPromptDefinition definition = getDefinition(promptId);
        return FeedbackPromptAdminDefinitionResponse.from(definition);
    }

    public FeedbackPromptDefinitionResponse createPrompt(FeedbackPromptDefinitionRequest request) {
        FeedbackPromptDefinition definition = request.toEntity();
        validator.validateForCreate(definition);
        validateActiveDuplicate(definition.getTriggerType(), definition.isActive(), null);
        return FeedbackPromptDefinitionResponse.from(definitionRepository.save(definition));
    }

    public FeedbackPromptDefinitionResponse updatePrompt(String promptId, FeedbackPromptDefinitionRequest request) {
        FeedbackPromptDefinition existing = getDefinition(promptId);
        FeedbackPromptDefinition next = request.toEntity();
        if (existing.getTriggerType() != next.getTriggerType() || existing.getAudience() != next.getAudience()) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        validator.validateForUpdate(existing, next);
        validateActiveDuplicate(existing.getTriggerType(), next.isActive(), existing.getId());
        existing.updateFrom(next);
        return FeedbackPromptDefinitionResponse.from(definitionRepository.save(existing));
    }

    private FeedbackPromptDefinition getDefinition(String promptId) {
        return definitionRepository.findById(promptId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_PROMPT_NOT_FOUND));
    }

    private void validateActiveDuplicate(FeedbackPromptTriggerType triggerType, boolean active, String currentId) {
        if (!active) {
            return;
        }
        List<FeedbackPromptDefinition> activeDefinitions =
                definitionRepository.findByTriggerTypeAndActiveTrueOrderByDisplayOrderAsc(triggerType);
        boolean hasOtherActive = activeDefinitions.stream()
                .anyMatch(definition -> currentId == null || !currentId.equals(definition.getId()));
        if (hasOtherActive) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_ACTIVE_DUPLICATED);
        }
    }
}
