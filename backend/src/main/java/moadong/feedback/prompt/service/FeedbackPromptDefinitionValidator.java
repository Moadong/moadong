package moadong.feedback.prompt.service;

import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class FeedbackPromptDefinitionValidator {

    private static final int MAX_REASON_COUNT = 8;
    private static final int MAX_COMMENT_LENGTH = 500;
    private static final int MAX_COOLDOWN_DAYS = 365;
    private static final int MAX_SHOWN_COOLDOWN_HOURS = 24 * 30;
    private static final int MAX_DAILY_EXPOSURE_LIMIT = 20;

    public void validateForCreate(FeedbackPromptDefinition definition) {
        validateDefinition(definition);
    }

    public void validateForUpdate(FeedbackPromptDefinition existing, FeedbackPromptDefinition next) {
        validateDefinition(next);
        Set<String> existingIds = reasonIds(existing.getFollowUp());
        Set<String> nextIds = reasonIds(next.getFollowUp());
        if (!nextIds.containsAll(existingIds)) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
    }

    private void validateDefinition(FeedbackPromptDefinition definition) {
        if (definition.getTriggerType() == null || definition.getAudience() == null
                || !StringUtils.hasText(definition.getTitle())) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        if (definition.getTriggerType().isAdminTrigger() && definition.getAudience() != FeedbackPromptAudience.ADMIN) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        if (definition.getTriggerType().isUserTrigger() && definition.getAudience() != FeedbackPromptAudience.USER) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        validateRatingOptions(definition.getRatingOptions());
        validateFollowUp(definition.getFollowUp());
        validatePolicy(definition.getExposurePolicy());
    }

    private void validateRatingOptions(List<FeedbackPromptRatingOption> ratingOptions) {
        if (ratingOptions == null || ratingOptions.isEmpty()) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        Set<FeedbackPromptRating> ratings = EnumSet.noneOf(FeedbackPromptRating.class);
        for (FeedbackPromptRatingOption option : ratingOptions) {
            if (option.getRating() == null || !StringUtils.hasText(option.getLabel())) {
                throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
            }
            if (!ratings.add(option.getRating())) {
                throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
            }
        }
    }

    private void validateFollowUp(FeedbackPromptFollowUp followUp) {
        if (followUp == null) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
        }
        if (followUp.getReasonOptions() != null && followUp.getReasonOptions().size() > MAX_REASON_COUNT) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_REASON_LIMIT_EXCEEDED);
        }
        int commentMaxLength = followUp.getCommentMaxLength();
        if (commentMaxLength < 0 || commentMaxLength > MAX_COMMENT_LENGTH) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_POLICY_INVALID);
        }
        Set<String> ids = new HashSet<>();
        for (FeedbackPromptReasonOption option : followUp.getReasonOptions()) {
            if (!StringUtils.hasText(option.getId()) || !StringUtils.hasText(option.getLabel())) {
                throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
            }
            if (!ids.add(option.getId())) {
                throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST);
            }
        }
    }

    private void validatePolicy(FeedbackPromptExposurePolicy policy) {
        if (policy == null) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_POLICY_INVALID);
        }
        if (policy.getAnsweredCooldownDays() < 0 || policy.getAnsweredCooldownDays() > MAX_COOLDOWN_DAYS
                || policy.getDismissedCooldownDays() < 0 || policy.getDismissedCooldownDays() > MAX_COOLDOWN_DAYS
                || policy.getShownCooldownHours() < 0 || policy.getShownCooldownHours() > MAX_SHOWN_COOLDOWN_HOURS
                || policy.getDailyExposureLimit() < 0 || policy.getDailyExposureLimit() > MAX_DAILY_EXPOSURE_LIMIT) {
            throw new RestApiException(ErrorCode.FEEDBACK_PROMPT_POLICY_INVALID);
        }
    }

    private Set<String> reasonIds(FeedbackPromptFollowUp followUp) {
        if (followUp == null || followUp.getReasonOptions() == null) {
            return Set.of();
        }
        return followUp.getReasonOptions().stream()
                .map(FeedbackPromptReasonOption::getId)
                .collect(java.util.stream.Collectors.toSet());
    }
}
