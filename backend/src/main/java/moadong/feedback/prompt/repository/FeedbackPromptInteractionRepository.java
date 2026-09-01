package moadong.feedback.prompt.repository;

import moadong.feedback.prompt.entity.FeedbackPromptInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackPromptInteractionRepository extends MongoRepository<FeedbackPromptInteraction, String> {
}
