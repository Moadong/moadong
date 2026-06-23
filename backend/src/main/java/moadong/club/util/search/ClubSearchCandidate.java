package moadong.club.util.search;

import moadong.club.payload.dto.ClubSearchResult;

public record ClubSearchCandidate(
        ClubSearchResult club,
        ClubSearchMatchType matchType,
        int detailScore
) {
}
