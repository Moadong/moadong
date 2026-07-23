package moadong.club.payload.response;

public record ClubAiDraftQuotaResponse(
        int limit,
        int used,
        int remaining
) {
}
