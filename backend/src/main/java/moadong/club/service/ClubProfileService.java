package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.payload.dto.ClubDetailedResult;
import moadong.club.payload.request.ClubCreateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.ObjectIdConverter;
import moadong.user.payload.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClubProfileService {

    private final ClubRepository clubRepository;

    public String createClub(ClubCreateRequest request) {
        Club club = Club.builder()
            .name(request.name())
            .category(request.category())
            .division(request.division())
            .build();
        clubRepository.save(club);

        return club.getId();
    }

    public void updateClubInfo(ClubInfoRequest request, CustomUserDetails user) {
        Club club = validateClubUpdateRequest(request.id(), user);

        club.update(request);
        clubRepository.save(club);
    }

    public void updateClubRecruitmentInfo(ClubRecruitmentInfoUpdateRequest request,
        CustomUserDetails user) {
        Club club = validateClubUpdateRequest(request.id(), user);
        club.update(request);
        clubRepository.save(club);
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

    private Club validateClubUpdateRequest(String clubId, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        return club;
    }
}
