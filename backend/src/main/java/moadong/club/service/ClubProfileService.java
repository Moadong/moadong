package moadong.club.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.payload.dto.ClubDetailedResult;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.payload.response.ClubListResponse;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubSearchRepository;
import moadong.club.util.RecruitmentStateCalculator;
import moadong.club.util.RecruitmentStateNotificationBuilder;
import moadong.fcm.port.PushNotificationPort;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.ObjectIdConverter;
import moadong.user.payload.CustomUserDetails;
import org.bson.types.ObjectId;
import org.javers.core.Javers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class ClubProfileService {

    private final ClubRepository clubRepository;
    private final ClubSearchRepository clubSearchRepository;
    private final RecruitmentStateCalculator recruitmentStateCalculator;
    private final RecruitmentStateNotificationBuilder recruitmentStateNotificationBuilder;
    private final PushNotificationPort pushNotificationPort;
    private final Javers javers;

    @Transactional
    public void updateClubInfo(ClubInfoRequest request, CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        Club saved = clubRepository.save(club);
        javers.commit(user.getUsername(), saved);
    }

    public void updateClubRecruitmentInfo(ClubRecruitmentInfoUpdateRequest request,
                                          CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        boolean changed = recruitmentStateCalculator.calculate(
                club,
                club.getClubRecruitmentInformation().getRecruitmentStart(),
                club.getClubRecruitmentInformation().getRecruitmentEnd()
        );
        if (changed && request.shouldSendNotification()) {
            pushNotificationPort.send(
                    recruitmentStateNotificationBuilder.build(
                            club,
                            club.getClubRecruitmentInformation().getClubRecruitmentStatus()
                    )
            );
        }
        club.getClubRecruitmentInformation().updateLastModifiedDate();
        Club saved = clubRepository.save(club);
        javers.commit(user.getUsername(), saved);
    }

    public ClubListResponse getAllClubsForAdmin() {
        List<Club> all = clubRepository.findAll();
        List<ClubListResponse.ClubListResponseItem> items = all.stream()
                .map(c -> new ClubListResponse.ClubListResponseItem(
                        c.getId() != null ? c.getId() : "",
                        c.getName() != null ? c.getName() : "",
                        c.getUserId() != null ? c.getUserId() : ""
                ))
                .toList();
        return new ClubListResponse(items);
    }

    public ClubDetailedResponse getClubDetail(String clubId) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        ClubDetailedResult clubDetailedResult = ClubDetailedResult.of(
                club
        );
        return new ClubDetailedResponse(clubDetailedResult);
    }

    @Transactional
    public void updateClubInfoByClubId(String clubId, ClubInfoRequest request, CustomUserDetails user) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        Club saved = clubRepository.save(club);
        javers.commit(user.getUsername(), saved);
    }

    @Transactional
    public void updateClubRecruitmentInfoByClubId(String clubId, ClubRecruitmentInfoUpdateRequest request,
                                                  CustomUserDetails user) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        boolean changed = recruitmentStateCalculator.calculate(
                club,
                club.getClubRecruitmentInformation().getRecruitmentStart(),
                club.getClubRecruitmentInformation().getRecruitmentEnd()
        );
        if (changed && request.shouldSendNotification()) {
            pushNotificationPort.send(
                    recruitmentStateNotificationBuilder.build(
                            club,
                            club.getClubRecruitmentInformation().getClubRecruitmentStatus()
                    )
            );
        }
        club.getClubRecruitmentInformation().updateLastModifiedDate();
        Club saved = clubRepository.save(club);
        javers.commit(user.getUsername(), saved);
    }
}
