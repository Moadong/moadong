package moadong.analytics.payload.response;

import java.time.LocalDate;
import java.util.List;

public record FunnelDashboardResponse(
        LocalDate from,
        LocalDate to,
        int requestedDays,
        int collectedDays,
        List<LocalDate> missingDates,
        List<FunnelResult> funnels,
        List<ScrollDepthResult> scrollDepths
) {
    public record FunnelResult(
            String key,
            String name,
            List<StepResult> steps,
            List<ConversionResult> conversions,
            Double overallRate
    ) {
    }

    public record StepResult(String name, long users) {
    }

    /** rate는 분모(from 단계 users)가 0이면 null */
    public record ConversionResult(String from, String to, Double rate) {
    }

    public record ScrollDepthResult(String page, List<DepthResult> depths) {
    }

    /** rateFrom25는 25% 도달 사용자가 0이면 null */
    public record DepthResult(int percent, long users, Double rateFrom25) {
    }
}
