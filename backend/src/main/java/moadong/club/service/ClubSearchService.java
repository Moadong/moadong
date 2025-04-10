package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClubSearchService {

    private final ClubSearchRepository clubSearchRepository;

    public ClubSearchResponse searchClubsByKeyword(String keyword,
                                                   String recruitmentStatus,
                                                   String division,
                                                   String category
    ) {
        List<ClubSearchResult> result = clubSearchRepository.searchClubsByKeyword(
                keyword,
                recruitmentStatus,
                division,
                category
        );

        return ClubSearchResponse.builder()
                .clubs(result)
                .build();
    }
}
