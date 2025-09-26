package moadong.user.repository;

import java.util.Optional;
import moadong.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findUserByUserId(String userId);

    Optional<User> findUserByRefreshToken_Token(String token);
}
