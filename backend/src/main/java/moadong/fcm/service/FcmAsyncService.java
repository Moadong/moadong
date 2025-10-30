package moadong.fcm.service;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.TopicManagementResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
@RequiredArgsConstructor
public class FcmAsyncService {

    private final FcmTxService fcmTxService;

    private final FirebaseMessaging firebaseMessaging;

    @Value("${fcm.topic.timeout-seconds:5}")
    private int timeoutSeconds;

    @Async("fcmAsync")
    public CompletableFuture<Void> updateSubscriptions(String token, Set<String> newClubIds, Set<String> clubsToSubscribe, Set<String> clubsToUnsubscribe) {
        List<ApiFuture<TopicManagementResponse>> futures = new ArrayList<>();

        // 새로운 동아리 구독
        if (!clubsToSubscribe.isEmpty()) {
            for (String clubId : clubsToSubscribe) {
                futures.add(firebaseMessaging.subscribeToTopicAsync(Collections.singletonList(token), clubId));
            }
        }

        // 더 이상 구독하지 않는 동아리 구독 해제
        if (!clubsToUnsubscribe.isEmpty()) {
            for (String clubId : clubsToUnsubscribe) {
                futures.add(firebaseMessaging.unsubscribeFromTopicAsync(Collections.singletonList(token), clubId));
            }
        }

        try {
            if (futures.isEmpty()) return null;

            List<TopicManagementResponse> responses = ApiFutures.allAsList(futures).get(timeoutSeconds, TimeUnit.SECONDS);

            for (TopicManagementResponse response : responses) {
                if (response.getFailureCount() > 0) {
                    boolean notRegistered = response.getErrors().stream()
                            .anyMatch(e -> "registration-token-not-registered".equals(e.getReason()));

                    if (notRegistered) {
                        fcmTxService.deleteUnregisteredFcmToken(token);
                        return null;
                    }

                    log.error("FCM topic sub failed for {}. errors={}", token, response.getErrors());
                    throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
                }
            }

            fcmTxService.updateFcmToken(token, newClubIds);

        } catch (ExecutionException | TimeoutException e) {
            log.error("error: {}", e.getMessage());
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }

        return null;
    }
}
