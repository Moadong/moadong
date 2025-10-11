package moadong.fcm.service;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.TopicManagementResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.repository.ClubRepository;
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

@Slf4j
@Service
@AllArgsConstructor
public class FcmAsyncService {

    private final FcmTokenRepository fcmTokenRepository;
    private final ClubRepository clubRepository;

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

        try {
            if (!futures.isEmpty()) {
                List<TopicManagementResponse> responses = ApiFutures.allAsList(futures).get();

                for (TopicManagementResponse response : responses) {
                    if (response.getFailureCount() > 0) {
                        log.error("Fcm topic subscription failed token {}. Response: {}", token, response.getErrors());
                    }
                }
            }
        } catch (Exception e) {
            log.error("error: {}", e.getMessage());
            throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
        }

        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).get();
        existToken.updateClubIds(newClubIds.stream().toList());
        fcmTokenRepository.save(existToken);
    }
}
