package moadong.feedback.prompt.entity;

import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("feedback_prompt_definitions")
@CompoundIndex(name = "trigger_active_order_idx", def = "{'triggerType': 1, 'active': 1, 'displayOrder': 1}")
@CompoundIndex(name = "audience_trigger_order_idx", def = "{'audience': 1, 'triggerType': 1, 'displayOrder': 1}")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptDefinition {

    @Id
    private String id;

    private FeedbackPromptTriggerType triggerType;
    private FeedbackPromptAudience audience;
    private String title;
    private String description;

    @Builder.Default
    private List<FeedbackPromptRatingOption> ratingOptions = List.of();

    private FeedbackPromptFollowUp followUp;
    private FeedbackPromptExposurePolicy exposurePolicy;
    private int displayOrder;
    private boolean active;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();

    public void updateFrom(FeedbackPromptDefinition next) {
        this.title = next.title;
        this.description = next.description;
        this.ratingOptions = next.ratingOptions == null ? List.of() : List.copyOf(next.ratingOptions);
        this.followUp = next.followUp;
        this.exposurePolicy = next.exposurePolicy;
        this.displayOrder = next.displayOrder;
        this.active = next.active;
        this.updatedAt = Instant.now();
    }
}
