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
        //TODO: 변경된 컬렉션 구조에 맞춰 수정할 것
        List<ClubSearchResult> result = new ArrayList<>();

        return ClubSearchResponse.builder()
            .clubs(result)
            .build();
    }
}
