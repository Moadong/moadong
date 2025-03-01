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
    @Query("{'division': {$regex: '^?0$', $options: 'i'}}")
    Optional<List<Club>> findClubByDivisionIgnoreCaseExact(String division);

    @Query("{'classification': {$regex: '^?0$', $options: 'i'}}")
    Optional<List<Club>> findClubByClassificationIgnoreCaseExact(String classification);

    @Query("{'state': ?0, 'classification': {$regex: '^?1$', $options: 'i'}}")
    Optional<List<Club>> findClubByStateAndClassificationIgnoreCaseExact(ClubState clubState, String classification);

    @Query("{'state': ?0, 'division': {$regex: '^?1$', $options: 'i'}}")
    Optional<List<Club>> findClubByStateAndDivisionIgnoreCaseExact(ClubState clubState, String division);

    @Query("{'classification': {$regex: '^?0$', $options: 'i'}, 'division': {$regex: '^?1$', $options: 'i'}}")
    Optional<List<Club>> findClubByClassificationAndDivisionIgnoreCaseExact(String classification, String division);

    @Query("{'state': ?0, 'classification': {$regex: '^?1$', $options: 'i'}, 'division': {$regex: '^?2$', $options: 'i'}}")
    Optional<List<Club>> findClubByStateAndClassificationAndDivisionIgnoreCaseExact(ClubState clubState, String classification, String division);
}
