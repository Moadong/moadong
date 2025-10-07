package moadong.fcm.repository;

import moadong.fcm.entity.FcmToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
    Optional<FcmToken> findFcmTokenByToken(String fcmToken);
}
