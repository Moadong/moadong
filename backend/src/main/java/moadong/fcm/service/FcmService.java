package moadong.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.repository.ClubRepository;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

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

        Set<String> newClubIdSet = Set.copyOf(newClubIds);
        Set<String> oldClubIdSet = Set.copyOf(oldClubIds);

        Set<String> clubsToSubscribe = new HashSet<>(newClubIdSet);
        clubsToSubscribe.removeAll(oldClubIdSet);

        Set<String> clubsToUnsubscribe = new HashSet<>(oldClubIdSet);
        clubsToUnsubscribe.removeAll(newClubIdSet);
        Long countClub = clubRepository.countByIdIn(clubsToSubscribe.stream().toList());

        if (countClub != clubsToSubscribe.size()) {
            throw new RestApiException(ErrorCode.CLUB_NOT_FOUND);
        }

        // 새로운 동아리 구독
        if (!clubsToSubscribe.isEmpty()) {
            for (String clubId : clubsToSubscribe) {
                FirebaseMessaging.getInstance().subscribeToTopicAsync(Collections.singletonList(token), clubId);
            }
        }

        // 더 이상 구독하지 않는 동아리 구독 해제
        if (!clubsToUnsubscribe.isEmpty()) {
            for (String clubId : clubsToUnsubscribe) {
                FirebaseMessaging.getInstance().unsubscribeFromTopicAsync(Collections.singletonList(token), clubId);
            }
        }

        // DB에 최신 동아리 목록으로 업데이트
        existToken.updateClubIds(newClubIds);
        fcmTokenRepository.save(existToken);

    }

    public ClubSubscribeListResponse getSubscribeClubs(String token) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        return new ClubSubscribeListResponse(existToken.getClubIds());
    }
}
