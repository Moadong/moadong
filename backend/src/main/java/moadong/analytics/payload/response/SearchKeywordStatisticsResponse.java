package moadong.analytics.payload.response;

import java.time.LocalDate;
import java.util.List;

public record SearchKeywordStatisticsResponse(
        LocalDate from,
        LocalDate to,
        List<SearchKeywordRankItem> keywords
) {
    public record SearchKeywordRankItem(
            String keyword,
            long count
    ) {
    }
}
