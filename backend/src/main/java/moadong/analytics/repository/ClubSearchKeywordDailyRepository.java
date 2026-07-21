package moadong.analytics.repository;

import moadong.analytics.entity.ClubSearchKeywordDaily;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubSearchKeywordDailyRepository extends MongoRepository<ClubSearchKeywordDaily, String> {
}
