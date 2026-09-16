package moadong.feedback.prompt.repository;

import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.entity.FeedbackPromptInteraction;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
@RequiredArgsConstructor
public class FeedbackPromptInteractionQueryRepository {

    private final MongoTemplate mongoTemplate;

    public Optional<FeedbackPromptInteraction> findLatest(
            FeedbackPromptAudience audience,
            String userId,
            String anonymousClientId,
            FeedbackPromptTriggerType triggerType,
            String clubId,
            FeedbackPromptInteractionType type
    ) {
        Query query = identityQuery(audience, userId, anonymousClientId)
                .addCriteria(Criteria.where("triggerType").is(triggerType))
                .addCriteria(Criteria.where("type").is(type));
        if (StringUtils.hasText(clubId)) {
            query.addCriteria(Criteria.where("clubId").is(clubId));
        }
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        query.limit(1);
        return Optional.ofNullable(mongoTemplate.findOne(query, FeedbackPromptInteraction.class));
    }

    public boolean existsAnsweredForClub(
            FeedbackPromptAudience audience,
            String userId,
            String anonymousClientId,
            FeedbackPromptTriggerType triggerType,
            String clubId
    ) {
        Query query = identityQuery(audience, userId, anonymousClientId)
                .addCriteria(Criteria.where("triggerType").is(triggerType))
                .addCriteria(Criteria.where("clubId").is(clubId))
                .addCriteria(Criteria.where("type").is(FeedbackPromptInteractionType.ANSWERED));
        return mongoTemplate.exists(query, FeedbackPromptInteraction.class);
    }

    public long countShownBetween(
            FeedbackPromptAudience audience,
            String userId,
            String anonymousClientId,
            Instant from,
            Instant to
    ) {
        Query query = identityQuery(audience, userId, anonymousClientId)
                .addCriteria(Criteria.where("type").is(FeedbackPromptInteractionType.SHOWN))
                .addCriteria(Criteria.where("createdAt").gte(from).lt(to));
        return mongoTemplate.count(query, FeedbackPromptInteraction.class);
    }

    private Query identityQuery(FeedbackPromptAudience audience, String userId, String anonymousClientId) {
        Query query = new Query().addCriteria(Criteria.where("audience").is(audience));
        if (StringUtils.hasText(userId)) {
            return query.addCriteria(Criteria.where("userId").is(userId));
        }
        return query.addCriteria(Criteria.where("anonymousClientId").is(anonymousClientId));
    }
}
