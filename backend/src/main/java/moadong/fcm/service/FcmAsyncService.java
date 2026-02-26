package moadong.fcm.service;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.TopicManagementResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.util.FcmTopicResolver;
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

    private final FcmTopicResolver fcmTopicResolver;

    @Value("${fcm.topic.timeout-seconds:5}")
    private int timeoutSeconds;

    /**
     * @deprecated
     * @param token
     * @param newClubIds
     * @param clubsToSubscribe
     * @param clubsToUnsubscribe
     * @return
     */
    @Async("fcmAsync")
    public CompletableFuture<Void> updateSubscriptions(String token, Set<String> newClubIds, Set<String> clubsToSubscribe, Set<String> clubsToUnsubscribe) {
        return updateSubscriptionsInternal(
                token,
                clubsToSubscribe,
                clubsToUnsubscribe,
                () -> fcmTxService.deleteUnregisteredFcmToken(token),
                () -> fcmTxService.updateFcmToken(token, newClubIds)
        );
    }

    @Async("fcmAsync")
    public CompletableFuture<Void> updateStudentSubscriptions(String token, Set<String> newClubIds, Set<String> clubsToSubscribe, Set<String> clubsToUnsubscribe) {
        return updateSubscriptionsInternal(
                token,
                clubsToSubscribe,
                clubsToUnsubscribe,
                () -> fcmTxService.deleteUnregisteredStudentFcmToken(token),
                () -> fcmTxService.updateStudentFcmToken(token, newClubIds)
        );
    }

    private CompletableFuture<Void> updateSubscriptionsInternal(
            String token,
            Set<String> clubsToSubscribe,
            Set<String> clubsToUnsubscribe,
            Runnable notRegisteredTokenHandler,
            Runnable tokenUpdater
    ) {
        List<ApiFuture<TopicManagementResponse>> futures = new ArrayList<>();

        // 새로운 동아리 구독
        if (!clubsToSubscribe.isEmpty()) {
            for (String clubId : clubsToSubscribe) {
                String topic = fcmTopicResolver.resolveTopic(clubId);
                futures.add(firebaseMessaging.subscribeToTopicAsync(Collections.singletonList(token), topic));
            }
        }

        // 더 이상 구독하지 않는 동아리 구독 해제
        if (!clubsToUnsubscribe.isEmpty()) {
            for (String clubId : clubsToUnsubscribe) {
                String topic = fcmTopicResolver.resolveTopic(clubId);
                futures.add(firebaseMessaging.unsubscribeFromTopicAsync(Collections.singletonList(token), topic));
            }
        }

        try {
            if (futures.isEmpty()) return CompletableFuture.completedFuture(null);

            List<TopicManagementResponse> responses = ApiFutures.allAsList(futures).get(timeoutSeconds, TimeUnit.SECONDS);

            for (TopicManagementResponse response : responses) {
                if (response.getFailureCount() > 0) {
                    boolean notRegistered = response.getErrors().stream()
                            .anyMatch(e -> "registration-token-not-registered".equals(e.getReason()));

                    if (notRegistered) {
                        notRegisteredTokenHandler.run();
                        return CompletableFuture.completedFuture(null);
                    }

                    log.error("FCM topic sub failed for {}. errors={}", token, response.getErrors());
                    throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
                }
            }

            tokenUpdater.run();

        } catch (ExecutionException | TimeoutException e) {
            log.error("error: {}", e.getMessage());
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }

        return CompletableFuture.completedFuture(null);
    }
}
