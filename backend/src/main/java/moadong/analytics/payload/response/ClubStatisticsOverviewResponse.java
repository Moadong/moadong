package moadong.analytics.payload.response;

import java.time.LocalDate;

public record ClubStatisticsOverviewResponse(
        String clubId,
        String clubName,
        LocalDate from,
        LocalDate to,
        long totalDetailViews,
        long averageDetailDurationSeconds,
        long totalApplicants
) {
}
