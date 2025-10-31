package moadong.fcm.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.dao.DataAccessException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.Set;

@Slf4j
@Service
@Retryable(
        retryFor = DataAccessException.class,
        maxAttempts = 2,
        backoff = @Backoff(delay = 100)
)
@AllArgsConstructor
public class FcmTxService {

    private final FcmTokenRepository fcmTokenRepository;

    @Transactional
    public void deleteUnregisteredFcmToken(String token) {
        fcmTokenRepository.findFcmTokenByToken(token).ifPresent(t -> {
            fcmTokenRepository.delete(t);
            log.info("Deleted unregistered FCM token {}", token);
        });
    }

    @Transactional
    public void updateFcmToken(String token, Set<String> newClubIds) {
        FcmToken fcmToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));
        fcmToken.updateClubIds(newClubIds.stream().toList());

        fcmTokenRepository.save(fcmToken);
    }
}
