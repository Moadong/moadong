package moadong.feedback.prompt.repository;

import java.util.List;
import java.util.Optional;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackPromptDefinitionRepository extends MongoRepository<FeedbackPromptDefinition, String> {

    List<FeedbackPromptDefinition> findByTriggerTypeAndActiveTrueOrderByDisplayOrderAsc(FeedbackPromptTriggerType triggerType);

    List<FeedbackPromptDefinition> findAllByOrderByAudienceAscTriggerTypeAscDisplayOrderAsc();

    Optional<FeedbackPromptDefinition> findByTriggerTypeAndActiveTrue(FeedbackPromptTriggerType triggerType);

    boolean existsByTriggerType(FeedbackPromptTriggerType triggerType);

    boolean existsByTriggerTypeAndActiveTrue(FeedbackPromptTriggerType triggerType);
}
