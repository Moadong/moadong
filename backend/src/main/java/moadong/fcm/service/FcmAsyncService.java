package moadong.fcm.service;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.TopicManagementResponse;
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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@AllArgsConstructor
public class FcmAsyncService {

    private final FcmTokenRepository fcmTokenRepository;

    @Async
    @Transactional
    @Retryable(
        retryFor = DataAccessException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 100)
    )
    public void updateSubscriptions(String token, Set<String> newClubIds, Set<String> clubsToSubscribe, Set<String> clubsToUnsubscribe) {
        List<ApiFuture<TopicManagementResponse>> futures = new ArrayList<>();

        // 새로운 동아리 구독
        if (!clubsToSubscribe.isEmpty()) {
            for (String clubId : clubsToSubscribe) {
                futures.add(FirebaseMessaging.getInstance().subscribeToTopicAsync(Collections.singletonList(token), clubId));
            }
        }

        // 더 이상 구독하지 않는 동아리 구독 해제
        if (!clubsToUnsubscribe.isEmpty()) {
            for (String clubId : clubsToUnsubscribe) {
                futures.add(FirebaseMessaging.getInstance().unsubscribeFromTopicAsync(Collections.singletonList(token), clubId));
            }
        }

        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).get();

        try {
            if (!futures.isEmpty()) {
                List<TopicManagementResponse> responses = ApiFutures.allAsList(futures).get();

                for (TopicManagementResponse response : responses) {
                    if (response.getFailureCount() > 0) {
                        log.error("Fcm topic subscription failed token {}. Response: {}", token, response.getErrors());

                        for (TopicManagementResponse.Error error : response.getErrors()) {
                            if (!error.getReason().equals("registration-token-not-registered")) continue;

                            fcmTokenRepository.delete(existToken);
                            throw new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND);
                        }
                    }
                }
            }
        } catch (ExecutionException | InterruptedException e) {
            log.error("error: {}", e.getMessage());
            throw new RuntimeException(e);
        }

        existToken.updateClubIds(newClubIds.stream().toList());
        fcmTokenRepository.save(existToken);
    }
}
