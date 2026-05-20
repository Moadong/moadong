package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import moadong.club.util.search.ClubSearchCandidate;
import moadong.club.util.search.ClubSearchMatcher;
import moadong.club.util.search.ClubSearchMatchType;
import moadong.club.util.search.ClubSearchRanker;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClubSearchServiceTest {

    @Mock
    private ClubSearchRepository clubSearchRepository;

    @Mock
    private WordDictionaryService wordDictionaryService;

    @Mock
    private ClubSearchMatcher clubSearchMatcher;

    @Mock
    private ClubSearchRanker clubSearchRanker;

    @InjectMocks
    private ClubSearchService clubSearchService;

    @Test
    void 검색어가_비어있으면_모집상태순으로_탐색_정렬하여_반환한다() {
        // given
        String keyword = "";
        String recruitmentStatus = "all";
        String division = "all";
        String category = "all"; // 전체 카테고리

        ClubSearchResult club1 = ClubSearchResult.builder().name("club1").recruitmentStatus("OPEN")
                .division("중동").category("봉사").build();
        ClubSearchResult club2 = ClubSearchResult.builder().name("club2").recruitmentStatus("UPCOMING")
                .division("중동").category("종교").build();
        ClubSearchResult club3 = ClubSearchResult.builder().name("club3").recruitmentStatus("CLOSED")
                .division("중동").category("공연").build();
        ClubSearchResult club4 = ClubSearchResult.builder().name("club4").recruitmentStatus("ALWAYS")
                .division("중동").category("운동").build();

        List<ClubSearchResult> unsorted = List.of(club1, club2, club3,club4);

        when(clubSearchRepository.findSearchCandidates(recruitmentStatus, division, category))
                .thenReturn(unsorted);

        // when
        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        List<ClubSearchResult> sorted = response.clubs();
        assertIterableEquals(sorted, List.of(club1, club4, club2, club3));
    }

    @Test
    void 검색어가_있으면_매칭된_후보만_랭커로_정렬하여_반환한다() {
        // given
        String keyword = "야구";
        String recruitmentStatus = "all";
        String division = "all";
        String category = "all";

        ClubSearchResult matchedClub = ClubSearchResult.builder()
                .name("야구부")
                .recruitmentStatus("CLOSED")
                .build();
        ClubSearchResult unmatchedClub = ClubSearchResult.builder()
                .name("축구")
                .recruitmentStatus("OPEN")
                .build();
        ClubSearchCandidate matchedCandidate = new ClubSearchCandidate(
                matchedClub,
                ClubSearchMatchType.PREFIX,
                1
        );

        when(clubSearchRepository.findSearchCandidates(recruitmentStatus, division, category))
                .thenReturn(List.of(unmatchedClub, matchedClub));
        when(wordDictionaryService.expandKeywords(keyword))
                .thenReturn(List.of("야구", "구기"));
        when(clubSearchMatcher.match(unmatchedClub, keyword, List.of("야구", "구기")))
                .thenReturn(Optional.empty());
        when(clubSearchMatcher.match(matchedClub, keyword, List.of("야구", "구기")))
                .thenReturn(Optional.of(matchedCandidate));
        when(clubSearchRanker.sort(List.of(matchedCandidate)))
                .thenReturn(List.of(matchedClub));

        // when
        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        assertIterableEquals(List.of(matchedClub), response.clubs());
        assertEquals(1, response.totalCount());
    }

//    @Test
//    void 모집상태에_해당하는_동아리가_없으면_빈_리스트를_반환한다() {
//        // given
//        String keyword = "없는키워드";
//        String recruitmentStatus = "OPEN";
//        String division = "중동";
//        String category = "봉사";
//
//        when(clubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category))
//                .thenReturn(List.of()); // 빈 리스트 반환
//
//        // when
//        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);
//
//        // then
//        assertTrue(response.clubs().isEmpty());
//    }
//
//    @Test
//    void 모집상태가_같다면_카테고리순으로_정렬하고_카테고리도_같다면_이름순으로_반환한다() {
//        // given
//        String keyword = "동아리";
//        String recruitmentStatus = "all";
//        String division = "all";
//        String category = "all"; // 전체 카테고리
//
//        ClubSearchResult club1 = ClubSearchResult.builder().name("club1").recruitmentStatus("OPEN")
//                .division("중동").category("봉사").build();
//        ClubSearchResult club2 = ClubSearchResult.builder().name("club2").recruitmentStatus("OPEN")
//                .division("중동").category("종교").build();
//        ClubSearchResult club3 = ClubSearchResult.builder().name("club3").recruitmentStatus("OPEN")
//                .division("중동").category("종교").build();
//
//        List<ClubSearchResult> unsorted = List.of(club3, club2, club1);
//
//        when(clubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category))
//                .thenReturn(unsorted);
//
//        // when
//        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);
//
//        // then
//        List<ClubSearchResult> sorted = response.clubs();
//        assertEquals("club1", sorted.get(0).name());
//        assertEquals("club2", sorted.get(1).name());
//        assertEquals("club3", sorted.get(2).name());
//    }


}
