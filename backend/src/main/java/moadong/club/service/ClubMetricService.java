package moadong.club.service;

import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.ClubMetric;
import moadong.club.repository.ClubMetricRepository;
import moadong.club.repository.ClubRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClubMetricService {

    private final ClubRepository clubRepository;
    private final ClubMetricRepository clubMetricRepository;

    public void patch(String clubId, String remoteAddr) {
        LocalDate nowDate = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        Optional<ClubMetric> optional = clubMetricRepository.findByClubIdAndIpAndDate(
            clubId, remoteAddr, nowDate);

        ClubMetric metric;
        if (optional.isPresent()) {
            metric = optional.get();
            metric.update();
        } else {
            metric = ClubMetric.builder()
                .clubId(clubId)
                .ip(remoteAddr)
                .build();
        }
        clubMetricRepository.save(metric);

    }

    public int[] getDailyActiveUserWitClub(String clubId) {
        LocalDate now = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        LocalDate from = now.minusDays(30);
        List<ClubMetric> metrics = clubMetricRepository.findByClubIdAndDateAfter(clubId, from);

        //30일간의 통계를 일별로 나누어 저장할 배열
        int[] dailyMetric = new int[30];
        for (ClubMetric metric : metrics) {
            Period period = Period.between(metric.getDate(), now);

            dailyMetric[period.getDays()]++;
        }

        return dailyMetric;
    }

    public int[] getWeeklyActiveUserWitClub(String clubId) {
        LocalDate now = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        LocalDate from = now.minusDays(84);
        List<ClubMetric> metrics = clubMetricRepository.findByClubIdAndDateAfter(clubId, from);

        //12주간의 통계를 주별로 나누어 저장할 배열
        int[] weeklyMetric = new int[12];
        LocalDate nowMonday = now.with(ChronoField.DAY_OF_WEEK, 1);
        for (ClubMetric metric : metrics) {
            LocalDate metricMonday = metric.getDate()
                .with(ChronoField.DAY_OF_WEEK, 1); // metric의 해당 주 월요일
            int weeksAgo = (int) ChronoUnit.WEEKS.between(metricMonday, nowMonday);

            if (weeksAgo >= 0 && weeksAgo < 12) {
                weeklyMetric[weeksAgo]++;
            }
        }

        return weeklyMetric;
    }

    public int[] getMonthlyActiveUserWitClub(String clubId) {
        LocalDate now = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        YearMonth currentMonth = YearMonth.from(now); // 현재 년-월
        YearMonth fromMonth = currentMonth.minusMonths(12); // 12개월 전

        List<ClubMetric> metrics = clubMetricRepository.findByClubIdAndDateAfter(clubId,
            fromMonth.atDay(1));

        // 12개월간의 통계를 월별로 저장할 배열
        int[] monthlyMetric = new int[12];

        for (ClubMetric metric : metrics) {
            YearMonth metricMonth = YearMonth.from(metric.getDate()); // metric이 속한 년-월
            int monthsAgo = (int) ChronoUnit.MONTHS.between(metricMonth, currentMonth);

            if (monthsAgo >= 0 && monthsAgo < 12) {
                monthlyMetric[monthsAgo]++;
            }
        }

        return monthlyMetric;
    }

    public List<String> getDailyRanking(int n) {
        if (n <= 0) {
            return Collections.emptyList();
        }

        LocalDate now = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        List<ClubMetric> todayMetrics = clubMetricRepository.findAllByDate(now);
        Map<String, Long> clubViewCount = todayMetrics.stream()
            .collect(Collectors.groupingBy(ClubMetric::getClubId, Collectors.counting()));
        List<Map.Entry<String, Long>> sortedList = new ArrayList<>(clubViewCount.entrySet());
        sortedList.sort((a, b) -> Math.toIntExact(b.getValue()) - Math.toIntExact(a.getValue()));

        List<String> clubIds = sortedList.stream()
            .limit(n)
            .map(Entry::getKey)
            .collect(Collectors.toList());

        List<Club> clubs = clubRepository.findAllById(clubIds);

        return clubIds.stream()
            .map(id -> clubs.stream()
                .filter(club -> club.getId().equals(id))
                .findFirst()
                .map(Club::getName)
                .orElse(null))
            .toList();
    }

    public int[] getDailyActiveUser(int n) {
        if (n <= 0) {
            return new int[0];
        }

        LocalDate today = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        LocalDate fromDate = today.minusDays(n);
        List<ClubMetric> metrics = clubMetricRepository.findAllByDateAfter(fromDate);

        Map<LocalDate, Set<String>> daus = metrics.stream()
            .collect(Collectors.groupingBy(ClubMetric::getDate,
                Collectors.mapping(ClubMetric::getIp, Collectors.toSet())));

        int[] dausCount = new int[n];
        for (int i = 0; i < n; i++) {
            LocalDate targetDate = today.minusDays(i);
            dausCount[i] = daus.getOrDefault(targetDate, Collections.emptySet()).size();
        }

        return dausCount;
    }
}
