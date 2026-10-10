package moadong.feedback.prompt.payload.response;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;

public record FeedbackPromptDefinitionResponse(
        String id,
        FeedbackPromptTriggerType triggerType,
        FeedbackPromptAudience audience,
        String title,
        String description,
        List<RatingOptionResponse> ratingOptions,
        FollowUpResponse followUp,
        FeedbackPromptExposurePolicy exposurePolicy,
        int displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {

    public static FeedbackPromptDefinitionResponse from(FeedbackPromptDefinition definition) {
        return new FeedbackPromptDefinitionResponse(
                definition.getId(),
                definition.getTriggerType(),
                definition.getAudience(),
                definition.getTitle(),
                definition.getDescription(),
                definition.getRatingOptions().stream()
                        .sorted(Comparator.comparingInt(FeedbackPromptRatingOption::getDisplayOrder))
                        .map(RatingOptionResponse::from)
                        .toList(),
                FollowUpResponse.from(definition.getFollowUp()),
                definition.getExposurePolicy(),
                definition.getDisplayOrder(),
                definition.isActive(),
                definition.getCreatedAt(),
                definition.getUpdatedAt()
        );
    }

    public record RatingOptionResponse(
            FeedbackPromptRating rating,
            String label,
            int displayOrder,
            boolean requiresFollowUp
    ) {
        static RatingOptionResponse from(FeedbackPromptRatingOption option) {
            return new RatingOptionResponse(
                    option.getRating(),
                    option.getLabel(),
                    option.getDisplayOrder(),
                    option.isRequiresFollowUp());
        }
    }

    public record FollowUpResponse(
            String reasonQuestion,
            List<ReasonOptionResponse> reasonOptions,
            String commentQuestion,
            String commentPlaceholder,
            int commentMaxLength
    ) {
        static FollowUpResponse from(FeedbackPromptFollowUp followUp) {
            if (followUp == null) {
                return null;
            }
            return new FollowUpResponse(
                    followUp.getReasonQuestion(),
                    followUp.getReasonOptions().stream()
                            .filter(FeedbackPromptReasonOption::isActive)
                            .sorted(Comparator.comparingInt(FeedbackPromptReasonOption::getDisplayOrder))
                            .map(ReasonOptionResponse::from)
                            .toList(),
                    followUp.getCommentQuestion(),
                    followUp.getCommentPlaceholder(),
                    followUp.getCommentMaxLength());
        }

        public static FollowUpResponse adminFrom(FeedbackPromptFollowUp followUp) {
            if (followUp == null) {
                return null;
            }
            return new FollowUpResponse(
                    followUp.getReasonQuestion(),
                    followUp.getReasonOptions().stream()
                            .sorted(Comparator.comparingInt(FeedbackPromptReasonOption::getDisplayOrder))
                            .map(ReasonOptionResponse::from)
                            .toList(),
                    followUp.getCommentQuestion(),
                    followUp.getCommentPlaceholder(),
                    followUp.getCommentMaxLength());
        }
    }

    public record ReasonOptionResponse(
            String id,
            String label,
            int displayOrder,
            boolean active
    ) {
        static ReasonOptionResponse from(FeedbackPromptReasonOption option) {
            return new ReasonOptionResponse(
                    option.getId(),
                    option.getLabel(),
                    option.getDisplayOrder(),
                    option.isActive());
        }
    }
}
