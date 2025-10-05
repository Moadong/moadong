package moadong.fcm.repository;

import moadong.fcm.entity.FcmToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
    FcmToken findFcmTokenByToken(String fcmToken);
}
