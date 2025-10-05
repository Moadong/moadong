package moadong.fcm.service;

import lombok.AllArgsConstructor;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.repository.FcmTokenRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FcmService {
    private final FcmTokenRepository fcmTokenRepository;

    public void saveFcmToken(String fcmTokenString) {
        FcmToken fcmToken = FcmToken.builder()
                .fcmToken(fcmTokenString)
                .build();

        fcmTokenRepository.insert(fcmToken);
    }
}
