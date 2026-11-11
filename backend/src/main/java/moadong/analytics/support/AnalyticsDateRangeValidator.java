package moadong.analytics.support;

import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;

import java.time.LocalDate;

public final class AnalyticsDateRangeValidator {

    private static final long MAX_QUERY_DAYS = 370;

    private AnalyticsDateRangeValidator() {
    }

    public static void validateQueryRange(LocalDate from, LocalDate to) {
        validateRequiredAndOrder(from, to);
        if (from.plusDays(MAX_QUERY_DAYS - 1).isBefore(to)) {
            throw new RestApiException(ErrorCode.STATISTICS_DATE_RANGE_INVALID);
        }
    }

    public static void validateBackfillRange(LocalDate from, LocalDate to, int maxRangeDays) {
        validateRequiredAndOrder(from, to);
        if (from.plusDays(maxRangeDays - 1L).isBefore(to)) {
            throw new RestApiException(ErrorCode.STATISTICS_BACKFILL_RANGE_TOO_LONG);
        }
        if (to.isAfter(LocalDate.now(java.time.ZoneOffset.UTC))) {
            throw new RestApiException(ErrorCode.STATISTICS_DATE_RANGE_INVALID);
        }
    }

    private static void validateRequiredAndOrder(LocalDate from, LocalDate to) {
        if (from == null || to == null || from.isAfter(to)) {
            throw new RestApiException(ErrorCode.STATISTICS_DATE_RANGE_INVALID);
        }
    }
}
