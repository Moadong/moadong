package moadong.club.repository;

import java.util.Optional;
import moadong.club.entity.ClubQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubQuestionRepository extends MongoRepository<ClubQuestion, String> {

    Optional<ClubQuestion> findByClubId(String clubId);

}
