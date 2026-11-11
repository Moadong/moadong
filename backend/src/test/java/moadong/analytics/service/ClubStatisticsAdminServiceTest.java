package moadong.analytics.service;

import moadong.analytics.entity.ClubAnalyticsDaily;
import moadong.analytics.repository.ClubAnalyticsDailyRepository;
import moadong.analytics.payload.response.ClubStatisticsOverviewResponse;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.util.annotations.UnitTest;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@UnitTest
class ClubStatisticsAdminServiceTest {

    @Mock
    private ClubAnalyticsDailyRepository clubAnalyticsDailyRepository;

    @Mock
    private ClubApplicantStatisticsService clubApplicantStatisticsService;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @Test
    void overview는_방문_세션_평균과_인당_평균_체류_시간을_계산한다() {
        // given
        ClubStatisticsAdminService service = service();
        LocalDate from = LocalDate.of(2026, 8, 1);
        LocalDate to = LocalDate.of(2026, 8, 2);
        Club club = mock(Club.class);
        when(club.getName()).thenReturn("테스트동아리");
        when(clubRepository.findById("club-id")).thenReturn(Optional.of(club));
        when(clubAnalyticsDailyRepository.findByClubIdAndDateBetweenOrderByDateAsc("club-id", from, to))
                .thenReturn(List.of(
                        daily(from, 10, 30, 2),
                        daily(to, 5, 90, 3)
                ));
        when(clubApplicantStatisticsService.countApplicantsByDate("club-id", from, to))
                .thenReturn(Map.of(from, 2L, to, 1L));
        Document visitorSummary = new Document()
                .append("uniqueVisitors", 3L)
                .append("durationSumSeconds", 120L);
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("club_detail_visitor_daily"), eq(Document.class)))
                .thenReturn(new AggregationResults<>(List.of(visitorSummary), new Document()));

        // when
        ClubStatisticsOverviewResponse response = service.getOverview("club-id", from, to);

        // then
        assertEquals(15, response.totalDetailViews());
        assertEquals(24, response.averageDetailDurationSeconds());
        assertEquals(3, response.uniqueDetailVisitors());
        assertEquals(40, response.averageDetailDurationSecondsPerVisitor());
        assertEquals(3, response.totalApplicants());
    }

    private ClubStatisticsAdminService service() {
        return new ClubStatisticsAdminService(
                clubAnalyticsDailyRepository,
                clubApplicantStatisticsService,
                clubRepository,
                mongoTemplate
        );
    }

    private ClubAnalyticsDaily daily(LocalDate date, long views, long durationSum, long durationCount) {
        return ClubAnalyticsDaily.builder()
                .date(date)
                .clubId("club-id")
                .detailViewCount(views)
                .detailDurationSumSeconds(durationSum)
                .detailDurationCount(durationCount)
                .build();
    }
}
