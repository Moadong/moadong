package moadong.user.repository;

import moadong.user.entity.StudentUser;
import moadong.user.entity.enums.SocialProvider;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StudentUserRepository extends MongoRepository<StudentUser, String> {
    Optional<StudentUser> findByStudentId(String studentId);
    Optional<StudentUser> findByProviderAndSocialId(SocialProvider provider, String socialId);
    Optional<StudentUser> findByRefreshTokens_Token(String token);
}
