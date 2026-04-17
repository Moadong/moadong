package moadong.club.repository;

import moadong.club.entity.ClubClickCount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubClickCountRepository extends MongoRepository<ClubClickCount, String> {

    List<ClubClickCount> findAllByOrderByClickCountDesc();
}
