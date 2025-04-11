package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.enums.ClubCategory;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import org.apache.logging.log4j.util.PropertySource;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
        // 정렬
        result = result.stream()
                .sorted(Comparator.comparingInt(club -> {
                    ClubCategory clubCategory = ClubCategory.fromString(club.category());
                    return clubCategory != null ? clubCategory.getOrder() : Integer.MAX_VALUE; // If not found, place it at the end
                }))
                .collect(Collectors.toList());

        return ClubSearchResponse.builder()
                .clubs(result)
                .build();
    }
}
