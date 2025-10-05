package moadong.fcm.repository;

import moadong.fcm.entity.FcmToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
}
