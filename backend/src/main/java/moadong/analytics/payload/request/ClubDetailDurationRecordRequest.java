package moadong.analytics.payload.request;

import java.time.Instant;

public record ClubDetailDurationRecordRequest(
        String clubId,
        String clubName,
        String sessionId,
        String visitorId,
        Instant enteredAt,
        Instant leftAt,
        Long durationSeconds
) {
}
