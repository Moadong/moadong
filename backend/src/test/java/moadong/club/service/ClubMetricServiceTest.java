package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoField;
import java.util.List;
import java.util.Optional;
import moadong.club.entity.ClubMetric;
import moadong.club.fixture.MetricFixture;
import moadong.club.repository.ClubMetricRepository;
import moadong.club.repository.ClubRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
@SuppressWarnings("NonAsciiCharacters")
public class ClubMetricServiceTest {

    @Autowired
    private ClubMetricService clubMetricService;

    @MockBean
    private ClubRepository clubRepository;

    @MockBean
    private ClubMetricRepository clubMetricRepository;

    @Test
    void 메트릭이_이미_존재한다면_최신화() {
        // given
        String clubId = "testClubId";
        String ip = "192.168.0.1";
        LocalDate today = LocalDate.now();

        ClubMetric existingMetric = Mockito.mock(ClubMetric.class);

        when(clubMetricRepository.findByClubIdAndIpAndDate(clubId, ip, today))
            .thenReturn(Optional.of(existingMetric));

        // when
        clubMetricService.patch(clubId, ip);

        // then
        verify(existingMetric).update();
        verify(clubMetricRepository).save(existingMetric);
    }

    @Test
    void 일일_활성_사용자수_검증() {
        // given
        String clubId = "testClubId";
        LocalDate now = LocalDate.now();

        List<ClubMetric> metrics = List.of(
            MetricFixture.createClubMetric(now.minusDays(1)),
            MetricFixture.createClubMetric(now.minusDays(3)),
            MetricFixture.createClubMetric(now.minusDays(3)),
            MetricFixture.createClubMetric(now.minusDays(29))
        );

        when(clubMetricRepository.findByClubIdAndDateAfter(eq(clubId), eq(now.minusDays(30))))
            .thenReturn(metrics);

        // when
        int[] result = clubMetricService.getDailyActiveUserWitClub(clubId);

        // then
        assertEquals(1, result[1]);
        assertEquals(2, result[3]);
        assertEquals(1, result[29]);

        // 나머지 날짜는 0이어야 함
        for (int i = 0; i < result.length; i++) {
            if (i != 1 && i != 3 && i != 29) {
                assertEquals(0, result[i], "Expected 0 at index " + i);
            }
        }
    }

    @Test
    void 주간_활성_사용자수_검증() {
        // given
        String clubId = "testClubId";
        LocalDate now = LocalDate.now();
        LocalDate thisWeekMonday = now.with(ChronoField.DAY_OF_WEEK, 1);

        List<ClubMetric> metrics = List.of(
            MetricFixture.createClubMetric(thisWeekMonday.minusWeeks(1).plusDays(2)),
            MetricFixture.createClubMetric(thisWeekMonday.minusWeeks(3)),
            MetricFixture.createClubMetric(thisWeekMonday.minusWeeks(3).plusDays(5)),
            MetricFixture.createClubMetric(thisWeekMonday.minusWeeks(11))
        );

        when(clubMetricRepository.findByClubIdAndDateAfter(eq(clubId), eq(now.minusDays(84))))
            .thenReturn(metrics);

        // when
        int[] result = clubMetricService.getWeeklyActiveUserWitClub(clubId);

        // then
        assertEquals(1, result[1]);
        assertEquals(2, result[3]);
        assertEquals(1, result[11]);

        for (int i = 0; i < result.length; i++) {
            if (i != 1 && i != 3 && i != 11) {
                assertEquals(0, result[i], "Expected 0 at index " + i);
            }
        }
    }

    @Test
    void 월간_활성_사용자수_검증() {
        // given
        String clubId = "testClubId";
        LocalDate now = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(now);

        List<ClubMetric> metrics = List.of(
            MetricFixture.createClubMetric(currentMonth.minusMonths(1).atDay(10)),
            MetricFixture.createClubMetric(currentMonth.minusMonths(3).atDay(5)),
            MetricFixture.createClubMetric(currentMonth.minusMonths(3).atEndOfMonth()),
            MetricFixture.createClubMetric(currentMonth.minusMonths(11).atDay(15))
        );

        when(clubMetricRepository.findByClubIdAndDateAfter(eq(clubId), eq(currentMonth.minusMonths(12).atDay(1))))
            .thenReturn(metrics);

        // when
        int[] result = clubMetricService.getMonthlyActiveUserWitClub(clubId);

        // then
        assertEquals(1, result[1]);
        assertEquals(2, result[3]);
        assertEquals(1, result[11]);

        for (int i = 0; i < result.length; i++) {
            if (i != 1 && i != 3 && i != 11) {
                assertEquals(0, result[i], "Expected 0 at index " + i);
            }
        }
    }

}
