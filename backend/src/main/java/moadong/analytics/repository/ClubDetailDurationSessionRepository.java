package moadong.analytics.repository;

import moadong.analytics.entity.ClubDetailDurationSession;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubDetailDurationSessionRepository extends MongoRepository<ClubDetailDurationSession, String> {
}
