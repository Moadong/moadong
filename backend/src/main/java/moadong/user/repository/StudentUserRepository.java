package moadong.user.repository;

import moadong.user.entity.StudentUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StudentUserRepository extends MongoRepository<StudentUser, String> {
    Optional<StudentUser> findByStudentId(String studentId);
}
