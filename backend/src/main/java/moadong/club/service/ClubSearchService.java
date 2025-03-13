package moadong.club.service;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClubSearchService {

    private final ClubSearchRepository clubSearchRepository;
    private final ClubInformationRepository clubInformationRepository;
    private final ClubTagRepository clubTagRepository;

    public ClubSearchResponse searchClubsByKeyword(String keyword,
        String recruitmentStatus,
        String division,
        String category
    ) {
        List<ClubSearchResult> clubSearchResults = clubSearchRepository.searchResult(
            keyword,
            recruitmentStatus,
            division,
            category
        );

        List<ClubSearchResult> result = assignInformation(clubSearchResults);

        return ClubSearchResponse.builder()
            .clubs(result)
            .build();
    }

    private List<ClubSearchResult> assignInformation(List<ClubSearchResult> clubSearchResults) {
        List<ClubSearchResult> list = new ArrayList<>();
        for (ClubSearchResult clubSearchResult : clubSearchResults) {
            ClubRecruitmentInformation clubRecruitmentInformation = clubInformationRepository.findByClubId(
                    clubSearchResult.id())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND));

            List<ClubTag> tags = clubTagRepository.findClubTagsByClubId(clubSearchResult.id());
            List<String> tagNames = tags.stream()
                .map(ClubTag::getTag)
                .toList();

            list.add(ClubSearchResult.of(clubSearchResult, clubRecruitmentInformation, tagNames));
        }
        return list;
    }
}
