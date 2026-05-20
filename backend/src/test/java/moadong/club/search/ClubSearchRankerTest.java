package moadong.club.search;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;

import java.util.List;
import moadong.club.payload.dto.ClubSearchResult;
import org.junit.jupiter.api.Test;

class ClubSearchRankerTest {

    private final ClubSearchRanker ranker = new ClubSearchRanker();

    @Test
    void 매칭_타입이_모집상태보다_우선한다() {
        ClubSearchResult semanticOpen = club("semantic", "OPEN");
        ClubSearchResult prefixClosed = club("prefix", "CLOSED");
        ClubSearchResult substringOpen = club("substring", "OPEN");
        ClubSearchResult exactClosed = club("exact", "CLOSED");
        ClubSearchResult fuzzyOpen = club("fuzzy", "OPEN");

        List<ClubSearchResult> sorted = ranker.sort(List.of(
                new ClubSearchCandidate(semanticOpen, ClubSearchMatchType.SEMANTIC, 0),
                new ClubSearchCandidate(prefixClosed, ClubSearchMatchType.PREFIX, 0),
                new ClubSearchCandidate(substringOpen, ClubSearchMatchType.SUBSTRING, 0),
                new ClubSearchCandidate(exactClosed, ClubSearchMatchType.EXACT, 0),
                new ClubSearchCandidate(fuzzyOpen, ClubSearchMatchType.FUZZY, 0)
        ));

        assertIterableEquals(
                List.of(exactClosed, prefixClosed, substringOpen, fuzzyOpen, semanticOpen),
                sorted
        );
    }

    @Test
    void 매칭_타입과_점수가_같으면_모집상태와_이름순으로_정렬한다() {
        ClubSearchResult closedA = club("A", "CLOSED");
        ClubSearchResult openB = club("B", "OPEN");
        ClubSearchResult openA = club("A", "OPEN");

        List<ClubSearchResult> sorted = ranker.sort(List.of(
                new ClubSearchCandidate(closedA, ClubSearchMatchType.PREFIX, 0),
                new ClubSearchCandidate(openB, ClubSearchMatchType.PREFIX, 0),
                new ClubSearchCandidate(openA, ClubSearchMatchType.PREFIX, 0)
        ));

        assertIterableEquals(List.of(openA, openB, closedA), sorted);
    }

    private ClubSearchResult club(String name, String recruitmentStatus) {
        return ClubSearchResult.builder()
                .name(name)
                .recruitmentStatus(recruitmentStatus)
                .build();
    }
}
