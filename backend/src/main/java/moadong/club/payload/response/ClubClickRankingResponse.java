package moadong.club.payload.response;

import java.util.List;

public record ClubClickRankingResponse(List<ClubRankItem> clubs, String resetAt) {

    public record ClubRankItem(int rank, String clubName, long clickCount) {
    }
}
