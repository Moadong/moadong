package moadong.club.repository;

import moadong.club.entity.ClubApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubApplicationRepository extends MongoRepository<ClubApplication, String> {
}
