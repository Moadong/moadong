package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.payload.dto.ClubDetailedResult;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class ClubDetailedPageService {

    private final ClubRepository clubRepository;

    public ClubDetailedResponse getClubDetailedPage(String clubId) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        ClubRecruitmentInformation clubRecruitmentInformation = clubInformationRepository.findByClubId(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND));

        List<String> clubFeedImages = clubFeedImageRepository.findAllByClubId(clubId)
                .stream()
                .map(ClubFeedImageProjection::getImage)
                .toList();

        List<String> clubTags = clubTagRepository.findAllByClubId(clubId)
                .orElse(Collections.emptyList())
                .stream()
                .map(ClubTagProjection::getTag)
                .toList();
        
        ClubDetailedResult clubDetailedResult = ClubDetailedResult.of(
                club,
                clubRecruitmentInformation,
                clubFeedImages,
                clubTags
        );
        return new ClubDetailedResponse(clubDetailedResult);
    }
}
