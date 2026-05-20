package moadong.club.search;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;
import moadong.club.payload.dto.ClubSearchResult;
import org.junit.jupiter.api.Test;

class ClubSearchMatcherTest {

    private final ClubSearchMatcher matcher = new ClubSearchMatcher(
            new ClubSearchTextNormalizer(),
            new KoreanInitialExtractor(),
            new EditDistanceCalculator()
    );

    @Test
    void 이름이_정확히_같으면_exact로_매칭한다() {
        ClubSearchCandidate candidate = match(club("야구", "운동", List.of()));

        assertEquals(ClubSearchMatchType.EXACT, candidate.matchType());
    }

    @Test
    void 이름이_검색어로_시작하면_prefix로_매칭한다() {
        ClubSearchCandidate candidate = match(club("야구부", "운동", List.of()));

        assertEquals(ClubSearchMatchType.PREFIX, candidate.matchType());
    }

    @Test
    void 이름_중간에_검색어가_있으면_substring으로_매칭한다() {
        ClubSearchCandidate candidate = match(club("PKNU야구회", "운동", List.of()));

        assertEquals(ClubSearchMatchType.SUBSTRING, candidate.matchType());
    }

    @Test
    void 초성_검색어는_choseong으로_매칭한다() {
        Optional<ClubSearchCandidate> candidate = matcher.match(
                club("플레이어스", "공연", List.of()),
                "ㅍㄹ",
                List.of("ㅍㄹ")
        );

        assertTrue(candidate.isPresent());
        assertEquals(ClubSearchMatchType.CHOSEONG, candidate.get().matchType());
    }

    @Test
    void 오타는_fuzzy로_보정한다() {
        Optional<ClubSearchCandidate> candidate = matcher.match(
                club("야구부", "운동", List.of()),
                "야규",
                List.of("야규")
        );

        assertTrue(candidate.isPresent());
        assertEquals(ClubSearchMatchType.FUZZY, candidate.get().matchType());
    }

    @Test
    void 편집거리가_가까워도_첫_글자와_초성이_다르면_fuzzy에서_제외한다() {
        Optional<ClubSearchCandidate> candidate = matcher.match(
                club("축구", "운동", List.of()),
                "야규",
                List.of("야규")
        );

        assertTrue(candidate.isEmpty());
    }

    @Test
    void 확장어가_태그에_걸리면_semantic으로_매칭한다() {
        Optional<ClubSearchCandidate> candidate = matcher.match(
                club("캐치볼", "운동", List.of("구기")),
                "야구",
                List.of("야구", "구기", "운동")
        );

        assertTrue(candidate.isPresent());
        assertEquals(ClubSearchMatchType.SEMANTIC, candidate.get().matchType());
    }

    @Test
    void 이름_매칭은_semantic보다_우선한다() {
        Optional<ClubSearchCandidate> candidate = matcher.match(
                club("야구부", "운동", List.of("운동")),
                "야구",
                List.of("야구", "운동")
        );

        assertTrue(candidate.isPresent());
        assertEquals(ClubSearchMatchType.PREFIX, candidate.get().matchType());
    }

    private ClubSearchCandidate match(ClubSearchResult club) {
        return matcher.match(club, "야구", List.of("야구")).orElseThrow();
    }

    private ClubSearchResult club(String name, String category, List<String> tags) {
        return ClubSearchResult.builder()
                .name(name)
                .category(category)
                .tags(tags)
                .recruitmentStatus("OPEN")
                .build();
    }
}
