package moadong.club.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import moadong.club.entity.ClubMetric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubMetricRepository extends MongoRepository<ClubMetric, String> {

    Optional<ClubMetric> findByClubIdAndIpAndDate(String clubId, String ip, LocalDate date);

    List<ClubMetric> findByClubIdAndDateAfter(String clubId, LocalDate date);

}
