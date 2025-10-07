package moadong.fcm.service;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class FcmService {
    private final FcmTokenRepository fcmTokenRepository;

    public void saveFcmToken(String token) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).orElse(null);

        if (existToken == null) {
            FcmToken fcmToken = FcmToken.builder()
                    .token(token)
                    .build();

            fcmTokenRepository.save(fcmToken);
            return;
        }

        existToken.updateTimestamp();
        fcmTokenRepository.save(existToken);
    }

    public void subscribeClubs(String token, ArrayList<String> clubIds) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        existToken.updateClubIds(clubIds);
    }

    public ClubSubscribeListResponse getSubscribeClubs(String token) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        return new ClubSubscribeListResponse(existToken.getClubIds());
    }
}
