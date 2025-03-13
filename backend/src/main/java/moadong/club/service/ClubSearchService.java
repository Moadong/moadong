package moadong.club.service;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubSearchRepository;
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
        List<ClubSearchResult> clubSearchResults = clubSearchRepository.searchClubsByKeyword(
            keyword,
            recruitmentStatus,
            division,
            category
        );
        //TODO: 변경된 컬렉션 구조에 맞춰 수정할 것
        List<ClubSearchResult> result = clubSearchResults;

        return ClubSearchResponse.builder()
            .clubs(result)
            .build();
    }
}
