package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.payload.dto.ClubDetailedResult;
import moadong.club.payload.request.ClubCreateRequest;
import moadong.club.payload.request.ClubDescriptionUpdateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClubProfileService {

    private final ClubRepository clubRepository;
    private final RecruitmentScheduler recruitmentScheduler;

    public String createClub(ClubCreateRequest request) {
        Club club = Club.builder()
                .name(request.name())
                .category(request.category())
                .division(request.division())
                .build();
        clubRepository.save(club);

        return club.getId();
    }

    public void updateClubInfo(ClubInfoRequest request) {
        Club club = clubRepository.findById(request.id())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        club.update(request);
        clubRepository.save(club);

    }

    public void updateClubDescription(ClubDescriptionUpdateRequest request) {
        Club club = clubRepository.findById(request.id())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        clubRepository.save(club);

        //모집일정을 동적스케쥴러에 달아둠
        if (request.recruitmentStart() != null && request.recruitmentEnd() != null) {
            recruitmentScheduler.scheduleRecruitment(club.getId(), request.recruitmentStart(),
                    request.recruitmentEnd());
        }
    }

    public ClubDetailedResponse getClubDetail(String clubId) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        ClubDetailedResult clubDetailedResult = ClubDetailedResult.of(
                club
        );
        return new ClubDetailedResponse(clubDetailedResult);
    }
}
