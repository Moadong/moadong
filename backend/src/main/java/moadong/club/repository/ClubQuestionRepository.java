package moadong.club.repository;

import moadong.club.entity.ClubQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubQuestionRepository extends MongoRepository<ClubQuestion, String> {

    Optional<ClubQuestion> findByClubId(String clubId);
    Optional<ClubQuestion> findByClubIdAndId(String clubId, String id);

}
