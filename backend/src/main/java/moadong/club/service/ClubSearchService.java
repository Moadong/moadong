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
import moadong.media.resolver.ImageDisplayUrlResolver;
import org.springframework.stereotype.Service;

import static java.util.Arrays.*;
import java.util.Objects;

@Service
@AllArgsConstructor
@Slf4j
public class ClubSearchService {

    private final ClubSearchRepository clubSearchRepository;
    private final ImageDisplayUrlResolver imageDisplayUrlResolver;
    private final ClubImageUrlPersistenceService clubImageUrlPersistenceService;

    public ClubSearchResponse searchClubsByKeyword(String keyword,
                                                   String recruitmentStatus,
                                                   String division,
                                                   String category
    ) {
        // 단어사전 확장 검색은 ClubSearchRepository에서 처리
        // keyword는 그대로 전달 (Repository에서 단어사전 확장 처리)
        List<ClubSearchResult> results = clubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category);
        
        // 정렬 및 반환
        return sortAndBuildResponse(results);
    }

    // 정렬 및 응답 생성
    private ClubSearchResponse sortAndBuildResponse(List<ClubSearchResult> result) {
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
                                .thenComparing(ClubSearchResult::name)
                )
                .map(r -> {
                    String resolvedLogo = imageDisplayUrlResolver.resolveDisplayUrl(r.logo());
                    if (!Objects.equals(resolvedLogo, r.logo())) {
                        clubImageUrlPersistenceService.schedulePersistResolvedUrls(r.id(), resolvedLogo, null, null);
                    }
                    return new ClubSearchResult(
                            r.id(),
                            r.name(),
                            resolvedLogo,
                            r.tags(),
                            r.state(),
                            r.category(),
                            r.division(),
                            r.introduction(),
                            r.recruitmentStatus());
                })
                .collect(Collectors.toList());

        return ClubSearchResponse.builder()
                .clubs(sortedResult)
                .totalCount(sortedResult.size())
                .build();
    }

}
