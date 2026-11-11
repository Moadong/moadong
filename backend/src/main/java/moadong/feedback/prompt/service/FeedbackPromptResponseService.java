package moadong.feedback.prompt.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonSnapshot;
import moadong.feedback.prompt.entity.FeedbackPromptResponse;
import moadong.feedback.prompt.entity.FeedbackPromptSnapshot;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.payload.request.FeedbackPromptDismissRequest;
import moadong.feedback.prompt.payload.request.FeedbackPromptResponseCreateRequest;
import moadong.feedback.prompt.payload.response.FeedbackPromptResponseCreateResponse;
import moadong.feedback.prompt.repository.FeedbackPromptDefinitionRepository;
import moadong.feedback.prompt.repository.FeedbackPromptResponseRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class FeedbackPromptResponseService {

    private static final String THANK_YOU_MESSAGE = "감사합니다. 더 편리한 모아동을 만들어볼게요.";

    private final FeedbackPromptDefinitionRepository definitionRepository;
    private final FeedbackPromptResponseRepository responseRepository;
    private final FeedbackPromptEligibilityService eligibilityService;

    public FeedbackPromptResponseCreateResponse createResponse(
            String promptId,
            FeedbackPromptResponseCreateRequest request,
            CustomUserDetails user
    ) {
        FeedbackPromptDefinition prompt = getPrompt(promptId);
        if (prompt.getTriggerType() != request.triggerType()) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        FeedbackPromptIdentity identity = eligibilityService.resolveIdentity(
                prompt, request.triggerType(), request.clubId(), request.anonymousClientId(), user);
        if (identity == null) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        validateResponse(prompt, request);
        FeedbackPromptResponse saved = responseRepository.save(FeedbackPromptResponse.builder()
                .promptId(prompt.getId())
                .triggerType(prompt.getTriggerType())
                .audience(prompt.getAudience())
                .userId(identity.userId())
                .anonymousClientId(identity.anonymousClientId())
                .clubId(identity.clubId())
                .rating(request.rating())
                .reasonOptionIds(request.normalizedReasonOptionIds())
                .comment(request.comment())
                .clientContext(request.clientContext() == null ? null : request.clientContext().toEntity())
                .snapshot(createSnapshot(prompt, request))
                .build());
        eligibilityService.saveInteraction(prompt, identity, FeedbackPromptInteractionType.ANSWERED);
        return new FeedbackPromptResponseCreateResponse(saved.getId(), THANK_YOU_MESSAGE);
    }

    public void dismiss(String promptId, FeedbackPromptDismissRequest request, CustomUserDetails user) {
        FeedbackPromptDefinition prompt = getPrompt(promptId);
        if (prompt.getTriggerType() != request.triggerType()) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        FeedbackPromptIdentity identity = eligibilityService.resolveIdentity(
                prompt, request.triggerType(), request.clubId(), request.anonymousClientId(), user);
        if (identity == null) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        eligibilityService.saveInteraction(prompt, identity, FeedbackPromptInteractionType.DISMISSED);
    }

    private FeedbackPromptDefinition getPrompt(String promptId) {
        return definitionRepository.findById(promptId)
                .filter(FeedbackPromptDefinition::isActive)
                .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_PROMPT_NOT_FOUND));
    }

    private void validateResponse(FeedbackPromptDefinition prompt, FeedbackPromptResponseCreateRequest request) {
        FeedbackPromptRatingOption selectedRating = prompt.getRatingOptions().stream()
                .filter(option -> option.getRating() == request.rating())
                .findFirst()
                .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST));
        int maxLength = prompt.getFollowUp() == null
                ? 500
                : prompt.getFollowUp().getCommentMaxLength();
        if (request.comment() != null && request.comment().length() > maxLength) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_COMMENT_TOO_LONG);
        }
        if (!selectedRating.isRequiresFollowUp()
                && (!request.normalizedReasonOptionIds().isEmpty() || StringUtils.hasText(request.comment()))) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        Map<String, FeedbackPromptReasonOption> activeReasons = activeReasonMap(prompt);
        for (String reasonId : request.normalizedReasonOptionIds()) {
            if (!activeReasons.containsKey(reasonId)) {
                throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
            }
        }
    }

    private FeedbackPromptSnapshot createSnapshot(
            FeedbackPromptDefinition prompt,
            FeedbackPromptResponseCreateRequest request
    ) {
        FeedbackPromptRatingOption ratingOption = prompt.getRatingOptions().stream()
                .filter(option -> option.getRating() == request.rating())
                .findFirst()
                .orElse(null);
        Map<String, FeedbackPromptReasonOption> activeReasons = activeReasonMap(prompt);
        List<FeedbackPromptReasonSnapshot> selectedReasons = request.normalizedReasonOptionIds().stream()
                .map(activeReasons::get)
                .map(reason -> FeedbackPromptReasonSnapshot.builder()
                        .id(reason.getId())
                        .label(reason.getLabel())
                        .build())
                .toList();
        return FeedbackPromptSnapshot.builder()
                .title(prompt.getTitle())
                .description(prompt.getDescription())
                .ratingLabel(ratingOption == null ? null : ratingOption.getLabel())
                .reasonQuestion(prompt.getFollowUp() == null ? null : prompt.getFollowUp().getReasonQuestion())
                .selectedReasons(selectedReasons)
                .commentQuestion(prompt.getFollowUp() == null ? null : prompt.getFollowUp().getCommentQuestion())
                .exposurePolicy(prompt.getExposurePolicy())
                .build();
    }

    private Map<String, FeedbackPromptReasonOption> activeReasonMap(FeedbackPromptDefinition prompt) {
        if (prompt.getFollowUp() == null || prompt.getFollowUp().getReasonOptions() == null) {
            return Map.of();
        }
        return prompt.getFollowUp().getReasonOptions().stream()
                .filter(FeedbackPromptReasonOption::isActive)
                .collect(Collectors.toMap(FeedbackPromptReasonOption::getId, Function.identity()));
    }
}
