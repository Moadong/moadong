package moadong.club.repository;

import moadong.club.entity.ClubApplicant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ClubApplicantsRepository extends MongoRepository<ClubApplicant, String> {
    @Query("{ 'formId': ?0, 'status': { $exists: true, $ne: 'DRAFT' } }")
    List<ClubApplicant> findAllByFormId(String questionId);

    List<ClubApplicant> findAllByIdInAndFormId(List<String> ids, String clubId);
}