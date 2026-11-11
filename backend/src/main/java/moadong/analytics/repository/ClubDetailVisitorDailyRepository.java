package moadong.analytics.repository;

import moadong.analytics.entity.ClubDetailVisitorDaily;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubDetailVisitorDailyRepository extends MongoRepository<ClubDetailVisitorDaily, String> {
}
