package moadong.analytics.payload.response;

import java.time.LocalDate;

public record MixpanelBackfillResponse(
        LocalDate from,
        LocalDate to,
        int fetchedEvents,
        int processedEvents,
        int duplicatedEvents,
        int skippedEvents
) {
}
