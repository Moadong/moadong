package moadong.feedback.prompt.entity;

import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("feedback_prompt_responses")
@CompoundIndex(name = "prompt_created_idx", def = "{'promptId': 1, 'createdAt': -1}")
@CompoundIndex(name = "trigger_created_idx", def = "{'triggerType': 1, 'createdAt': -1}")
@CompoundIndex(name = "audience_created_idx", def = "{'audience': 1, 'createdAt': -1}")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptResponse {

    @Id
    private String id;

    private String promptId;
    private FeedbackPromptTriggerType triggerType;
    private FeedbackPromptAudience audience;
    private String userId;
    private String anonymousClientId;
    private String clubId;
    private FeedbackPromptRating rating;

    @Builder.Default
    private List<String> reasonOptionIds = List.of();

    private String comment;
    private FeedbackPromptClientContext clientContext;
    private FeedbackPromptSnapshot snapshot;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
