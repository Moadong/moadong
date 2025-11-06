package moadong.fcm.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.repository.ClubRepository;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class FcmService {
    private final FcmTokenRepository fcmTokenRepository;
    private final FcmAsyncService fcmAsyncService;
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

        Set<String> newClubIdSet = Set.copyOf(newClubIds);
        Set<String> oldClubIdSet = Set.copyOf(existToken.getClubIds());

        Set<String> clubsToSubscribe = new HashSet<>(newClubIdSet);
        clubsToSubscribe.removeAll(oldClubIdSet);

        Set<String> clubsToUnsubscribe = new HashSet<>(oldClubIdSet);
        clubsToUnsubscribe.removeAll(newClubIdSet);

        if (!clubsToSubscribe.isEmpty()) {
            Long countClub = clubRepository.countByIdIn(clubsToSubscribe.stream().toList());

            if (countClub != clubsToSubscribe.size()) {
                throw new RestApiException(ErrorCode.CLUB_NOT_FOUND);
            }
        }

        fcmAsyncService.updateSubscriptions(token, newClubIdSet, clubsToSubscribe, clubsToUnsubscribe)
                .exceptionally(ex -> {
                    log.error("FCM Token subscription error: {}", ex.getMessage());
                    return null;
                });
    }

    public ClubSubscribeListResponse getSubscribeClubs(String token) {
        FcmToken existToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        return new ClubSubscribeListResponse(existToken.getClubIds());
    }
}
