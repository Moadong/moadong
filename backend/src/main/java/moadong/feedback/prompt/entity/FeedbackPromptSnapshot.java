package moadong.feedback.prompt.entity;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptSnapshot {

    private String title;
    private String description;
    private String ratingLabel;
    private String reasonQuestion;

    @Builder.Default
    private List<FeedbackPromptReasonSnapshot> selectedReasons = List.of();

    private String commentQuestion;
    private FeedbackPromptExposurePolicy exposurePolicy;
}
