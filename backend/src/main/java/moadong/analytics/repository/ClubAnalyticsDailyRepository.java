package moadong.analytics.repository;

import moadong.analytics.entity.ClubAnalyticsDaily;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ClubAnalyticsDailyRepository extends MongoRepository<ClubAnalyticsDaily, String> {

    List<ClubAnalyticsDaily> findByClubIdAndDateBetweenOrderByDateAsc(
            String clubId,
            LocalDate from,
            LocalDate to
    );
}
