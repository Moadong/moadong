package moadong.club.search;

import java.util.Comparator;
import java.util.List;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.dto.ClubSearchResult;
import org.springframework.stereotype.Component;

@Component
public class ClubSearchRanker {

    public List<ClubSearchResult> sort(List<ClubSearchCandidate> candidates) {
        return candidates.stream()
                .sorted(
                        Comparator
                                .comparingInt((ClubSearchCandidate candidate) -> candidate.matchType().getPriority())
                                .thenComparingInt(ClubSearchCandidate::detailScore)
                                .thenComparingInt(candidate -> ClubRecruitmentStatus.getPriorityFromString(candidate.club().recruitmentStatus()))
                                .thenComparing(candidate -> candidate.club().name(), Comparator.nullsLast(String::compareTo))
                )
                .map(ClubSearchCandidate::club)
                .toList();
    }
}
