package moadong.feedback.prompt.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;

public record FeedbackPromptDefinitionRequest(
        @NotNull FeedbackPromptTriggerType triggerType,
        @NotNull FeedbackPromptAudience audience,
        @NotBlank String title,
        String description,
        @Size(min = 1, max = 3) List<@Valid RatingOptionRequest> ratingOptions,
        @Valid FollowUpRequest followUp,
        @Valid ExposurePolicyRequest exposurePolicy,
        int displayOrder,
        boolean active
) {

    public FeedbackPromptDefinition toEntity() {
        return FeedbackPromptDefinition.builder()
                .triggerType(triggerType)
                .audience(audience)
                .title(title)
                .description(description)
                .ratingOptions(ratingOptions == null ? List.of() : ratingOptions.stream()
                        .map(RatingOptionRequest::toEntity)
                        .toList())
                .followUp(followUp == null ? null : followUp.toEntity())
                .exposurePolicy(exposurePolicy == null ? null : exposurePolicy.toEntity())
                .displayOrder(displayOrder)
                .active(active)
                .build();
    }

    public record RatingOptionRequest(
            @NotNull FeedbackPromptRating rating,
            @NotBlank String label,
            int displayOrder,
            boolean requiresFollowUp
    ) {
        FeedbackPromptRatingOption toEntity() {
            return FeedbackPromptRatingOption.builder()
                    .rating(rating)
                    .label(label)
                    .displayOrder(displayOrder)
                    .requiresFollowUp(requiresFollowUp)
                    .build();
        }
    }

    public record FollowUpRequest(
            String reasonQuestion,
            @Size(max = 8) List<@Valid ReasonOptionRequest> reasonOptions,
            String commentQuestion,
            String commentPlaceholder,
            int commentMaxLength
    ) {
        FeedbackPromptFollowUp toEntity() {
            return FeedbackPromptFollowUp.builder()
                    .reasonQuestion(reasonQuestion)
                    .reasonOptions(reasonOptions == null ? List.of() : reasonOptions.stream()
                            .map(ReasonOptionRequest::toEntity)
                            .toList())
                    .commentQuestion(commentQuestion)
                    .commentPlaceholder(commentPlaceholder)
                    .commentMaxLength(commentMaxLength)
                    .build();
        }
    }

    public record ReasonOptionRequest(
            @NotBlank String id,
            @NotBlank String label,
            int displayOrder,
            boolean active
    ) {
        FeedbackPromptReasonOption toEntity() {
            return FeedbackPromptReasonOption.builder()
                    .id(id)
                    .label(label)
                    .displayOrder(displayOrder)
                    .active(active)
                    .build();
        }
    }

    public record ExposurePolicyRequest(
            int answeredCooldownDays,
            int dismissedCooldownDays,
            int shownCooldownHours,
            boolean oncePerClub,
            int dailyExposureLimit
    ) {
        FeedbackPromptExposurePolicy toEntity() {
            return FeedbackPromptExposurePolicy.builder()
                    .answeredCooldownDays(answeredCooldownDays)
                    .dismissedCooldownDays(dismissedCooldownDays)
                    .shownCooldownHours(shownCooldownHours)
                    .oncePerClub(oncePerClub)
                    .dailyExposureLimit(dailyExposureLimit)
                    .build();
        }
    }
}
