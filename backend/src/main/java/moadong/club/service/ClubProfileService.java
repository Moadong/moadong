package moadong.club.service;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.payload.dto.ClubDetailedResult;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubSearchRepository;
import moadong.club.util.RecruitmentStateCalculator;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.ObjectIdConverter;
import moadong.user.payload.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class ClubProfileService {

    private final ClubRepository clubRepository;
    private final ClubSearchRepository clubSearchRepository;

    @Transactional
    public void updateClubInfo(ClubInfoRequest request, CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        clubRepository.save(club);
    }

    public void updateClubRecruitmentInfo(ClubRecruitmentInfoUpdateRequest request,
        CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        club.update(request);
        RecruitmentStateCalculator.calculate(
                club,
                club.getClubRecruitmentInformation().getRecruitmentStart(),
                club.getClubRecruitmentInformation().getRecruitmentEnd()
        );
        club.getClubRecruitmentInformation().updateLastModifiedDate();
        clubRepository.save(club);
    }

    public ClubDetailedResponse getClubDetail(String clubId) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        List<ClubSearchResult> clubSearchResults = clubSearchRepository.searchRecommendClubs(club.getCategory(), clubId);

        ClubDetailedResult clubDetailedResult = ClubDetailedResult.of(
                club,clubSearchResults
        );
        return new ClubDetailedResponse(clubDetailedResult);
    }
}
