package moadong.user.repository;

import moadong.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findUserByUserId(String userId);

    Optional<User> findUserByRefreshToken_Token(String token);
}
