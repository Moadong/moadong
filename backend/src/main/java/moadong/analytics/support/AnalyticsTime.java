package moadong.analytics.support;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

public final class AnalyticsTime {

    public static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private AnalyticsTime() {
    }

    public static LocalDate todayKst() {
        return LocalDate.now(KST);
    }

    public static LocalDate toKstDateFromEpochSeconds(long epochSeconds) {
        return Instant.ofEpochSecond(epochSeconds).atZone(KST).toLocalDate();
    }

    public static LocalDateTime toKstDateTimeFromEpochSeconds(long epochSeconds) {
        return Instant.ofEpochSecond(epochSeconds).atZone(KST).toLocalDateTime();
    }
}
