package moadong.club.repository;

import java.util.List;
import java.util.Optional;
import moadong.club.entity.ClubApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ClubApplicationRepository extends MongoRepository<ClubApplication, String> {
    @Query("{ 'questionId': ?0, 'status': { $exists: true, $ne: 'DRAFT' } }")
    List<ClubApplication> findAllByQuestionId(String questionId);

    Optional<ClubApplication> findByIdAndQuestionId(String id, String questionId);

    List<ClubApplication> findAllByIdInAndQuestionId(List<String> ids, String clubId);
}