package moadong.club.search;

import moadong.club.payload.dto.ClubSearchResult;

public record ClubSearchCandidate(
        ClubSearchResult club,
        ClubSearchMatchType matchType,
        int detailScore
) {
}
