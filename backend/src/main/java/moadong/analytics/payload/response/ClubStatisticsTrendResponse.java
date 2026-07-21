package moadong.analytics.payload.response;

import java.time.LocalDate;
import java.util.List;

public record ClubStatisticsTrendResponse(
        String clubId,
        LocalDate from,
        LocalDate to,
        List<ClubStatisticsDailyPoint> points
) {
    public record ClubStatisticsDailyPoint(
            LocalDate date,
            long detailViews,
            long averageDetailDurationSeconds,
            long applicants
    ) {
    }
}
