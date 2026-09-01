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
public class FeedbackPromptFollowUp {

    private String reasonQuestion;

    @Builder.Default
    private List<FeedbackPromptReasonOption> reasonOptions = List.of();

    private String commentQuestion;
    private String commentPlaceholder;
    private int commentMaxLength;
}
