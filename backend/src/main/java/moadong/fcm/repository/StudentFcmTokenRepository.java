package moadong.fcm.repository;

import moadong.fcm.entity.StudentFcmToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StudentFcmTokenRepository extends MongoRepository<StudentFcmToken, String> {
    Optional<StudentFcmToken> findByToken(String token);

    Optional<StudentFcmToken> findByStudentId(String studentId);
}
