package moadong.fcm.service;

import com.google.firebase.FirebaseException;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.TopicManagementResponse;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class FcmService {
    private final FcmTokenRepository fcmTokenRepository;
    private final ClubRepository clubRepository;

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

    public void subscribeClubs(String token, ArrayList<String> newClubIds) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token)
                .orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        ArrayList<String> oldClubIds = existToken.getClubIds();

        // 구독할 목록
        ArrayList<String> clubsToSubscribe = new ArrayList<>(newClubIds);
        clubsToSubscribe.removeAll(oldClubIds);

        // 구독 해제할 목록
        ArrayList<String> clubsToUnsubscribe = new ArrayList<>(oldClubIds);
        clubsToUnsubscribe.removeAll(newClubIds);

        List<Club> allClubs = clubRepository.findAllById(clubsToSubscribe);

        if (allClubs.size() != clubsToSubscribe.size()) {
            throw new RestApiException(ErrorCode.CLUB_NOT_FOUND);
        }

        try {
            // 새로운 동아리 구독
            if (!clubsToSubscribe.isEmpty()) {
                for (String clubId : clubsToSubscribe) {
                    FirebaseMessaging.getInstance().subscribeToTopic(Collections.singletonList(token), clubId);
                }
            }

            // 더 이상 구독하지 않는 동아리 구독 해제
            if (!clubsToUnsubscribe.isEmpty()) {
                for (String clubId : clubsToUnsubscribe) {
                    FirebaseMessaging.getInstance().unsubscribeFromTopic(Collections.singletonList(token), clubId);
                }
            }

            // DB에 최신 동아리 목록으로 업데이트
            existToken.updateClubIds(newClubIds);
            fcmTokenRepository.save(existToken);

        } catch (FirebaseMessagingException e) {
            if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED) {
                fcmTokenRepository.delete(existToken);
            } else {
                log.error("Failed to update FCM subscriptions for token {}: {}", token, e.getMessage());
            }
            throw new RestApiException(ErrorCode.FCMTOKEN_SUBSCRIBE_ERROR);
        }
    }

    public ClubSubscribeListResponse getSubscribeClubs(String token) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        return new ClubSubscribeListResponse(existToken.getClubIds());
    }
}
