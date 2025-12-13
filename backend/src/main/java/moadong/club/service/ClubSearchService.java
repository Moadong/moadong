package moadong.club.service;

import java.util.*;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import moadong.club.enums.ClubCategory;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import org.springframework.stereotype.Service;

import static java.util.Arrays.*;

@Service
@AllArgsConstructor
public class ClubSearchService {

    private final ClubSearchRepository clubSearchRepository;

    public ClubSearchResponse searchClubsByKeyword(String keyword,
                                                   String recruitmentStatus,
                                                   String division,
                                                   String category
    ) {
        String normalizedKeyword = normalizeKeyword(keyword);

        List<ClubSearchResult> result = clubSearchRepository.searchClubsByKeyword(
                normalizedKeyword,
                recruitmentStatus,
                division,
                category
        );
        // 정렬
        // 1. ClubCategory Enum의 모든 값을 가져와 리스트로 만들고 순서를 랜덤하게 섞습니다.
        List<ClubCategory> categories = new ArrayList<>(asList(ClubCategory.values()));
        Collections.shuffle(categories);

        // 2. 섞인 순서를 기반으로 Category에 대한 랜덤 우선순위 Map을 생성합니다.
        Map<String, Integer> randomCategoryPriorities = new HashMap<>();
        for (int i = 0; i < categories.size(); i++) {
            randomCategoryPriorities.put(categories.get(i).name(), i);
        }

        result = result.stream()
                .sorted(
                        Comparator
                                // 1차: recruitmentStatus는 기존 enum의 우선순위로 정렬
                                .comparingInt((ClubSearchResult club) -> ClubRecruitmentStatus.getPriorityFromString(club.recruitmentStatus()))
                                // 2차: category는 랜덤하게 생성된 우선순위로 정렬
                                .thenComparingInt((ClubSearchResult club) ->
                                        randomCategoryPriorities.getOrDefault(
                                                club.category() != null ? club.category().toUpperCase() : null,
                                                Integer.MAX_VALUE))
                                // 3차: 이름순으로 정렬
                                .thenComparing(ClubSearchResult::name)
                )
                .collect(Collectors.toList());

        return ClubSearchResponse.builder()
                .clubs(result)
                .totalCount(result.size())
                .build();
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null) return null;

        String trimmedKeyword = keyword.trim();
        if (trimmedKeyword.isEmpty()) return "";

        return trimmedKeyword.replaceAll("[^0-9A-Za-z가-힣\\s]", "").trim();
    }
}
