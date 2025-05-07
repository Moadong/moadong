package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.List;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClubSearchServiceTest {

    @Mock
    private ClubSearchRepository clubSearchRepository;

    @InjectMocks
    private ClubSearchService clubSearchService;

    @Test
    void 검색조건이_유효하면_모집상태순으로_정렬하여_반환한다() {
        // given
        String keyword = "동아리";
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

        when(clubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category))
                .thenReturn(unsorted);

        // when
        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        List<ClubSearchResult> sorted = response.clubs();
        assertEquals("club4", sorted.get(0).name());
        assertEquals("club1", sorted.get(1).name());
        assertEquals("club3", sorted.get(2).name());
        assertEquals("club2", sorted.get(3).name());
    }

    @Test
    void 모집상태에_해당하는_동아리가_없으면_빈_리스트를_반환한다() {
        // given
        String keyword = "없는키워드";
        String recruitmentStatus = "OPEN";
        String division = "중동";
        String category = "봉사";

        when(clubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category))
                .thenReturn(List.of()); // 빈 리스트 반환

        // when
        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        assertTrue(response.clubs().isEmpty());
    }

    @Test
    void 모집상태가_같다면_카테고리순으로_정렬하고_카테고리도_같다면_이름순으로_반환한다() {
        // given
        String keyword = "동아리";
        String recruitmentStatus = "all";
        String division = "all";
        String category = "all"; // 전체 카테고리

        ClubSearchResult club1 = ClubSearchResult.builder().name("club1").recruitmentStatus("OPEN")
                .division("중동").category("봉사").build();
        ClubSearchResult club2 = ClubSearchResult.builder().name("club2").recruitmentStatus("OPEN")
                .division("중동").category("종교").build();
        ClubSearchResult club3 = ClubSearchResult.builder().name("club3").recruitmentStatus("OPEN")
                .division("중동").category("종교").build();

        List<ClubSearchResult> unsorted = List.of(club3, club2, club1);

        when(clubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category))
                .thenReturn(unsorted);

        // when
        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        List<ClubSearchResult> sorted = response.clubs();
        assertEquals("club1", sorted.get(0).name());
        assertEquals("club2", sorted.get(1).name());
        assertEquals("club3", sorted.get(2).name());
    }


}