package moadong.club.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubTagRepository extends MongoRepository<ClubTag, String> {

    Optional<List<ClubTagProjection>> findAllByClubId(String clubId);

    List<ClubTag> findClubTagsByClubId(String clubId);

    void deleteAllByClubId(String clubId);
}
