package moadong.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.TopicManagementResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.util.FcmTopicResolver;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentFcmSubscriptionService {

    private final FirebaseMessaging firebaseMessaging;
    private final FcmTopicResolver fcmTopicResolver;

    public void transferSubscriptions(String studentId, String oldFcmToken, String newFcmToken, List<String> finalClubIds) {
        for (String clubId : finalClubIds) {
            subscribeToClub(studentId, newFcmToken, clubId);
        }

        for (String clubId : finalClubIds) {
            unsubscribeFromClub(studentId, oldFcmToken, clubId);
        }
    }

    private void subscribeToClub(String studentId, String token, String clubId) {
        String topic = fcmTopicResolver.resolveTopic(clubId);
        try {
            TopicManagementResponse response = firebaseMessaging.subscribeToTopic(Collections.singletonList(token), topic);
            if (response.getFailureCount() > 0) {
                log.error("Student FCM subscribe failed. studentId={}, token={}, clubId={}, topic={}, errors={}",
                        studentId, mask(token), clubId, topic, response.getErrors());
                throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
            }
        } catch (FirebaseMessagingException e) {
            log.error("Student FCM subscribe exception. studentId={}, token={}, clubId={}, topic={}, message={}",
                    studentId, mask(token), clubId, topic, e.getMessage());
            throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
        }
    }

    private void unsubscribeFromClub(String studentId, String token, String clubId) {
        String topic = fcmTopicResolver.resolveTopic(clubId);
        try {
            TopicManagementResponse response = firebaseMessaging.unsubscribeFromTopic(Collections.singletonList(token), topic);
            if (response.getFailureCount() > 0) {
                log.error("Student FCM unsubscribe failed. studentId={}, token={}, clubId={}, topic={}, errors={}",
                        studentId, mask(token), clubId, topic, response.getErrors());
                throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
            }
        } catch (FirebaseMessagingException e) {
            log.error("Student FCM unsubscribe exception. studentId={}, token={}, clubId={}, topic={}, message={}",
                    studentId, mask(token), clubId, topic, e.getMessage());
            throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
        }
    }

    private String mask(String token) {
        if (token == null || token.length() < 10) {
            return "***";
        }
        return token.substring(0, 6) + "..." + token.substring(token.length() - 4);
    }
}
