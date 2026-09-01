package moadong.feedback.prompt.repository;

import java.util.List;
import moadong.feedback.prompt.entity.FeedbackPromptResponse;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackPromptResponseRepository extends MongoRepository<FeedbackPromptResponse, String> {

    List<FeedbackPromptResponse> findByPromptIdOrderByCreatedAtDesc(String promptId);

    List<FeedbackPromptResponse> findByTriggerTypeOrderByCreatedAtDesc(FeedbackPromptTriggerType triggerType);
}
