package moadong.feedback.prompt.entity;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("feedback_prompt_interactions")
@CompoundIndex(name = "user_trigger_type_created_idx", def = "{'audience': 1, 'userId': 1, 'triggerType': 1, 'type': 1, 'createdAt': -1}")
@CompoundIndex(name = "anonymous_trigger_club_type_created_idx", def = "{'audience': 1, 'anonymousClientId': 1, 'triggerType': 1, 'clubId': 1, 'type': 1, 'createdAt': -1}")
@CompoundIndex(name = "user_type_created_idx", def = "{'audience': 1, 'userId': 1, 'type': 1, 'createdAt': -1}")
@CompoundIndex(name = "anonymous_type_created_idx", def = "{'audience': 1, 'anonymousClientId': 1, 'type': 1, 'createdAt': -1}")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptInteraction {

    @Id
    private String id;

    private String promptId;
    private FeedbackPromptTriggerType triggerType;
    private FeedbackPromptAudience audience;
    private String userId;
    private String anonymousClientId;
    private String clubId;
    private FeedbackPromptInteractionType type;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
