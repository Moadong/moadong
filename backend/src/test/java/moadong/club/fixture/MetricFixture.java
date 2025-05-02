package moadong.club.fixture;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import moadong.club.entity.ClubMetric;

public class MetricFixture {

    public static ClubMetric createClubMetric(LocalDate date) {
        ClubMetric metric = mock(ClubMetric.class);
        when(metric.getDate()).thenReturn(date);
        return metric;
    }

    public static ClubMetric createClubMetric(String clubId, LocalDate date) {
        ClubMetric metric = mock(ClubMetric.class);
        when(metric.getClubId()).thenReturn(clubId);
        when(metric.getDate()).thenReturn(date);
        return metric;
    }

}
