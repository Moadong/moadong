package moadong.analytics.service;

import lombok.RequiredArgsConstructor;
import moadong.analytics.entity.ClubAnalyticsDaily;
import moadong.analytics.payload.response.ClubStatisticsOverviewResponse;
import moadong.analytics.payload.response.ClubStatisticsTrendResponse;
import moadong.analytics.payload.response.SearchKeywordStatisticsResponse;
import moadong.analytics.repository.ClubAnalyticsDailyRepository;
import moadong.analytics.support.AnalyticsDateRangeValidator;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubStatisticsAdminService {

    private final ClubAnalyticsDailyRepository clubAnalyticsDailyRepository;
    private final ClubApplicantStatisticsService clubApplicantStatisticsService;
    private final ClubRepository clubRepository;
    private final MongoTemplate mongoTemplate;

    public ClubStatisticsOverviewResponse getOverview(String clubId, LocalDate from, LocalDate to) {
        AnalyticsDateRangeValidator.validateQueryRange(from, to);
        Club club = findClub(clubId);
        List<ClubAnalyticsDaily> dailyStats = clubAnalyticsDailyRepository
                .findByClubIdAndDateBetweenOrderByDateAsc(clubId, from, to);
        Map<LocalDate, Long> applicantCounts = clubApplicantStatisticsService.countApplicantsByDate(clubId, from, to);

        long totalDetailViews = dailyStats.stream().mapToLong(ClubAnalyticsDaily::getDetailViewCount).sum();
        long durationSum = dailyStats.stream().mapToLong(ClubAnalyticsDaily::getDetailDurationSumSeconds).sum();
        long durationCount = dailyStats.stream().mapToLong(ClubAnalyticsDaily::getDetailDurationCount).sum();
        long totalApplicants = applicantCounts.values().stream().mapToLong(Long::longValue).sum();

        return new ClubStatisticsOverviewResponse(
                clubId,
                club.getName(),
                from,
                to,
                totalDetailViews,
                average(durationSum, durationCount),
                totalApplicants
        );
    }

    public ClubStatisticsTrendResponse getTrend(String clubId, LocalDate from, LocalDate to) {
        AnalyticsDateRangeValidator.validateQueryRange(from, to);
        findClub(clubId);
        Map<LocalDate, ClubAnalyticsDaily> analyticsByDate = clubAnalyticsDailyRepository
                .findByClubIdAndDateBetweenOrderByDateAsc(clubId, from, to)
                .stream()
                .collect(Collectors.toMap(ClubAnalyticsDaily::getDate, Function.identity()));
        Map<LocalDate, Long> applicantCounts = clubApplicantStatisticsService.countApplicantsByDate(clubId, from, to);

        List<ClubStatisticsTrendResponse.ClubStatisticsDailyPoint> points = new ArrayList<>();
        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {
            ClubAnalyticsDaily analytics = analyticsByDate.get(date);
            long detailViews = analytics == null ? 0 : analytics.getDetailViewCount();
            long durationSum = analytics == null ? 0 : analytics.getDetailDurationSumSeconds();
            long durationCount = analytics == null ? 0 : analytics.getDetailDurationCount();
            points.add(new ClubStatisticsTrendResponse.ClubStatisticsDailyPoint(
                    date,
                    detailViews,
                    average(durationSum, durationCount),
                    applicantCounts.getOrDefault(date, 0L)
            ));
        }

        return new ClubStatisticsTrendResponse(clubId, from, to, points);
    }

    public SearchKeywordStatisticsResponse getSearchKeywords(LocalDate from, LocalDate to, int limit) {
        AnalyticsDateRangeValidator.validateQueryRange(from, to);
        int safeLimit = Math.max(1, Math.min(limit, 50));

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("date").gte(from).lte(to)),
                Aggregation.group("normalizedKeyword")
                        .first("keyword").as("keyword")
                        .sum("count").as("count"),
                Aggregation.sort(Sort.by(Sort.Order.desc("count"), Sort.Order.asc("keyword"))),
                Aggregation.limit(safeLimit),
                Aggregation.project("keyword", "count").andExclude("_id")
        );

        AggregationResults<SearchKeywordStatisticsResponse.SearchKeywordRankItem> results =
                mongoTemplate.aggregate(
                        aggregation,
                        "club_search_keyword_daily",
                        SearchKeywordStatisticsResponse.SearchKeywordRankItem.class
                );
        return new SearchKeywordStatisticsResponse(from, to, results.getMappedResults());
    }

    public void validateClubManager(String clubId) {
        findClub(clubId);
    }

    private Club findClub(String clubId) {
        if (clubId == null || clubId.isBlank()) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
    }

    private long average(long sum, long count) {
        return count == 0 ? 0 : Math.round((double) sum / count);
    }
}
