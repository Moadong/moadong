package moadong.club.service;

import java.util.*;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.enums.ClubCategory;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import moadong.club.util.search.ClubSearchCandidate;
import moadong.club.util.search.ClubSearchMatcher;
import moadong.club.util.search.ClubSearchRanker;
import org.springframework.stereotype.Service;

import static java.util.Arrays.*;

@Service
@AllArgsConstructor
@Slf4j
public class ClubSearchService {

    private final ClubSearchRepository clubSearchRepository;
    private final WordDictionaryService wordDictionaryService;
    private final ClubSearchMatcher clubSearchMatcher;
    private final ClubSearchRanker clubSearchRanker;

    public ClubSearchResponse searchClubsByKeyword(String keyword,
                                                   String recruitmentStatus,
                                                   String division,
                                                   String category
    ) {
        List<ClubSearchResult> candidates = clubSearchRepository.findSearchCandidates(
                recruitmentStatus,
                division,
                category
        );

        if (keyword == null || keyword.trim().isEmpty()) {
            return sortAndBuildBrowseResponse(candidates);
        }

        List<String> expandedKeywords = wordDictionaryService.expandKeywords(keyword);
        List<ClubSearchCandidate> matchedCandidates = candidates.stream()
                .map(candidate -> clubSearchMatcher.match(candidate, keyword, expandedKeywords))
                .flatMap(Optional::stream)
                .toList();

        List<ClubSearchResult> sortedResult = clubSearchRanker.sort(matchedCandidates);

        return ClubSearchResponse.builder()
                .clubs(sortedResult)
                .totalCount(sortedResult.size())
                .build();
    }

    // 정렬 및 응답 생성
    private ClubSearchResponse sortAndBuildBrowseResponse(List<ClubSearchResult> result) {
        List<ClubCategory> categories = new ArrayList<>(asList(ClubCategory.values()));
        Collections.shuffle(categories);

        Map<String, Integer> randomCategoryPriorities = new HashMap<>();
        for (int i = 0; i < categories.size(); i++) {
            randomCategoryPriorities.put(categories.get(i).name(), i);
        }

        List<ClubSearchResult> sortedResult = result.stream()
                .sorted(
                        Comparator
                                .comparingInt((ClubSearchResult club) -> ClubRecruitmentStatus.getPriorityFromString(club.recruitmentStatus()))
                                .thenComparingInt((ClubSearchResult club) ->
                                        randomCategoryPriorities.getOrDefault(
                                                club.category() != null ? club.category().toUpperCase() : null,
                                                Integer.MAX_VALUE))
                                .thenComparing(ClubSearchResult::name, Comparator.nullsLast(String::compareTo))
                )
                .map(r -> new ClubSearchResult(
                        r.id(),
                        r.name(),
                        r.logo(),
                        r.tags(),
                        r.state(),
                        r.category(),
                        r.division(),
                        r.introduction(),
                        r.recruitmentStatus()))
                .collect(Collectors.toList());

        return ClubSearchResponse.builder()
                .clubs(sortedResult)
                .totalCount(sortedResult.size())
                .build();
    }

}
