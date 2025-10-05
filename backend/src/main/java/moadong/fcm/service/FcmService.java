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
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(fcmTokenString);

        if (existToken == null) {
            FcmToken fcmToken = FcmToken.builder()
                    .token(fcmTokenString)
                    .build();

            fcmTokenRepository.save(fcmToken);
            return;
        }

        existToken.updateTimestamp();
        fcmTokenRepository.save(existToken);
    }
}
