package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import moadong.club.repository.ClubRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.TaskScheduler;

@ExtendWith(MockitoExtension.class)
public class RecruitmentSchedulerTest {

    @InjectMocks
    private RecruitmentScheduler recruitmentScheduler;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private ScheduledFuture<?> scheduledFuture;

    @Mock
    private TaskScheduler taskScheduler;

    private final Map<String, ScheduledFuture<?>> scheduledTasks = new HashMap<>();

    @Captor
    private ArgumentCaptor<Runnable> runnableCaptor;

    @Captor
    private ArgumentCaptor<Date> dateCaptor;

    @Nested
    class scheduleRecruitment {

        @Test
        void 모집_스케줄링_성공() {
            // given
            String clubId = "club-1";

            LocalDateTime startDate = LocalDateTime.now().plusDays(1);
            Instant expectedStartInstant = startDate.atZone(ZoneId.of("Asia/Seoul")).toInstant()
                .truncatedTo(ChronoUnit.MILLIS);

            LocalDateTime endDate = LocalDateTime.now().plusDays(2);
            Instant expectedEndInstant = endDate.atZone(ZoneId.of("Asia/Seoul")).toInstant()
                .truncatedTo(ChronoUnit.MILLIS);

            when(taskScheduler.schedule(any(Runnable.class), any(Date.class)))
                .thenReturn((ScheduledFuture) scheduledFuture);

            // when
            recruitmentScheduler.scheduleRecruitment(clubId, startDate, endDate);

            //then
            verify(taskScheduler, times(2)).schedule(runnableCaptor.capture(),
                dateCaptor.capture());

            // 모집 시장 스케줄링 검증
            List<Date> dates = dateCaptor.getAllValues();
            Date startScheduleDate = dates.get(0);
            assertEquals(expectedStartInstant,
                startScheduleDate.toInstant());

            // 모집 종료 스케줄링 검증
            Date endScheduleDate = dates.get(1);
            assertEquals(expectedEndInstant,
                endScheduleDate.toInstant());
        }
    }


}
