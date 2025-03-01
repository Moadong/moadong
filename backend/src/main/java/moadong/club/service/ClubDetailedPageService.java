package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.ClubInformation;
import moadong.club.payload.dto.ClubDetailedResult;
import moadong.club.payload.dto.ClubFeedImageProjection;
import moadong.club.payload.dto.ClubTagProjection;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.repository.ClubFeedImageRepository;
import moadong.club.repository.ClubInformationRepository;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubTagRepository;
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
    private final ClubInformationRepository clubInformationRepository;
    private final ClubFeedImageRepository clubFeedImageRepository;
    private final ClubTagRepository clubTagRepository;

    public ClubDetailedResponse getClubDetailedPage(String clubId) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        ClubInformation clubInformation = clubInformationRepository.findByClubId(clubId)
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
                clubInformation,
                clubFeedImages,
                clubTags
        );
        return new ClubDetailedResponse(clubDetailedResult);
    }
}
