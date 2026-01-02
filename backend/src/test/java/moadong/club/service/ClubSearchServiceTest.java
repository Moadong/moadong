package moadong.club.service;

import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubSearchRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClubSearchServiceTest {

    @Mock
    private ClubSearchRepository clubSearchRepository;

    @InjectMocks
    private ClubSearchService clubSearchService;

    @Test
    void 클럽검색결과는_모집상태우선순위를적용하고_상태내카테고리는랜덤이지만_카테고리내에서는수정일최신순정렬을유지한다() {
        // given
        String keyword = "동아리";
        String recruitmentStatus = "all";
        String division = "all";
        String category = "all";

        // 1) OPEN 그룹 (같은 카테고리 2개 + 다른 카테고리 1개)
        // 봉사(2): RCY, 동반 / 종교(1): CCC
        ClubSearchResult rcy = club("RCY", ClubRecruitmentStatus.OPEN, "봉사");
        ClubSearchResult dongban = club("동반", ClubRecruitmentStatus.OPEN, "봉사");
        ClubSearchResult ccc = club("CCC", ClubRecruitmentStatus.OPEN, "종교");

        // 2) ALWAYS 그룹
        ClubSearchResult baguni = club("바구니", ClubRecruitmentStatus.ALWAYS, "운동");

        // 3) UPCOMING 그룹
        ClubSearchResult wap = club("WAP", ClubRecruitmentStatus.UPCOMING, "학술");

        // 4) CLOSED 그룹
        ClubSearchResult ivf = club("IVF", ClubRecruitmentStatus.CLOSED, "종교");

        // repository 결과
        // [RCY(Latest), CCC, 바구니, WAP, 동반(Old), IVF(Oldest)]
        List<ClubSearchResult> repositoryResult = List.of(rcy, ccc, baguni, wap, dongban, ivf);

        given(clubSearchRepository.searchClubsByKeyword(
                Pattern.quote(keyword), recruitmentStatus, division, category
        )).willReturn(repositoryResult);

        // when
        ClubSearchResponse response =
                clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        List<ClubSearchResult> actual = response.clubs();

        // OPEN 블록에서 카테고리(봉사/종교) 우선순위가 랜덤이라 2가지 경우만 허용
        // - 봉사가 먼저면: [RCY, 동반] -> (봉사 내부는 기존 순서 유지) + [CCC]
        // - 종교가 먼저면: [CCC] + [RCY, 동반]
        List<ClubSearchResult> expected1 = List.of(rcy, dongban, ccc, baguni, wap, ivf);
        List<ClubSearchResult> expected2 = List.of(ccc, rcy, dongban, baguni, wap, ivf);
        assertThat(actual)
                .as("상태(OPEN>ALWAYS>UPCOMING>CLOSED) → 랜덤 카테고리 → 카테고리안 정렬순서 유지")
                .satisfiesAnyOf(
                        list -> assertThat(list).isEqualTo(expected1),
                        list -> assertThat(list).isEqualTo(expected2)
                );
    }

    private static ClubSearchResult club(String name, ClubRecruitmentStatus recruitmentStatus, String category) {
        return ClubSearchResult.builder()
                .name(name)
                .recruitmentStatus(recruitmentStatus.name())
                .category(category)
                .build();
    }

    @Test
    void 모집상태에_해당하는_동아리가_없으면_빈_리스트를_반환한다() {
        // given
        String keyword = "없는키워드";
        String recruitmentStatus = "OPEN";
        String division = "중동";
        String category = "봉사";

        when(clubSearchRepository.searchClubsByKeyword(Pattern.quote(keyword), recruitmentStatus, division, category))
                .thenReturn(List.of()); // 빈 리스트 반환

        // when
        ClubSearchResponse response = clubSearchService.searchClubsByKeyword(keyword, recruitmentStatus, division, category);

        // then
        assertTrue(response.clubs().isEmpty());
    }


}