package moadong.club.repository;

import java.util.List;
import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.enums.ClubState;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends MongoRepository<Club, String> {

    Optional<Club> findClubById(ObjectId id);

    Optional<List<Club>> findClubByState(ClubState clubState);

    Optional<Club> findClubByUserId(String userId);

    @Query("{'division': {$regex: '^?0$', $options: 'i'}}")
    Optional<List<Club>> findClubByDivisionIgnoreCaseExact(String division);

    @Query("{'category': {$regex: '^?0$', $options: 'i'}}")
    Optional<List<Club>> findClubByCategoryIgnoreCaseExact(String category);

    @Query("{'state': ?0, 'category': {$regex: '^?1$', $options: 'i'}}")
    Optional<List<Club>> findClubByStateAndCategoryIgnoreCaseExact(ClubState clubState,
        String category);

    @Query("{'state': ?0, 'division': {$regex: '^?1$', $options: 'i'}}")
    Optional<List<Club>> findClubByStateAndDivisionIgnoreCaseExact(ClubState clubState,
        String division);

    @Query("{'category': {$regex: '^?0$', $options: 'i'}, 'division': {$regex: '^?1$', $options: 'i'}}")
    Optional<List<Club>> findClubByCategoryAndDivisionIgnoreCaseExact(String category,
        String division);

    @Query("{'state': ?0, 'category': {$regex: '^?1$', $options: 'i'}, 'division': {$regex: '^?2$', $options: 'i'}}")
    Optional<List<Club>> findClubByStateAndCategoryAndDivisionIgnoreCaseExact(ClubState clubState,
        String category, String division);

    List<Club> findAllByName(List<String> clubs);
}
