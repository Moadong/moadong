package moadong.club.repository;

import moadong.club.entity.ClubApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ClubApplicationRepository extends MongoRepository<ClubApplication, String> {
    @Query("{ 'questionId': ?0, 'status': { $exists: true, $ne: 'DRAFT' } }")
    List<ClubApplication> findAllByQuestionId(String questionId);
}