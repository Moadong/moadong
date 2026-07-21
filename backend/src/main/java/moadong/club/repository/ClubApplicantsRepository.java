package moadong.club.repository;

import java.util.List;
import java.time.LocalDateTime;
import moadong.club.entity.ClubApplicant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ClubApplicantsRepository extends MongoRepository<ClubApplicant, String> {
    @Query("{ 'formId': ?0, 'status': { $exists: true, $ne: 'DRAFT' } }")
    List<ClubApplicant> findAllByFormId(String questionId);

    List<ClubApplicant> findAllByIdInAndFormId(List<String> ids, String formId);

    List<ClubApplicant> findByFormIdInAndCreatedAtBetween(
            List<String> formIds,
            LocalDateTime from,
            LocalDateTime to
    );

    void deleteAllByFormId(String formId);
}
