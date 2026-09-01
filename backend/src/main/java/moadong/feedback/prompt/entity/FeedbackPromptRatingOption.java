package moadong.feedback.prompt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.prompt.enums.FeedbackPromptRating;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptRatingOption {

    private FeedbackPromptRating rating;
    private String label;
    private int displayOrder;
    private boolean requiresFollowUp;
}
