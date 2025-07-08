package moadong.club.repository;

import moadong.club.entity.ClubApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClubApplicationRepository extends MongoRepository<ClubApplication, String> {
    
    List<ClubApplication> findAllByQuestionId(String questionId);
}
