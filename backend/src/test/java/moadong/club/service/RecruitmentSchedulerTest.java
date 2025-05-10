package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;
import moadong.club.entity.Club;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
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

    @Captor
    private ArgumentCaptor<Runnable> runnableCaptor;

    @Captor
    private ArgumentCaptor<Date> dateCaptor;

    private Map<String, ScheduledFuture<?>> scheduledTasks;

    @BeforeEach
    void setUp() {
        scheduledTasks = recruitmentScheduler.getScheduledTasks();
    }

    @Nested
    class scheduleRecruitment {

        @Test
        void 모집_스케줄링_성공() {
            // given
            String clubId = "club-1";

            ZoneId koreaZoneId = ZoneId.of("Asia/Seoul");
            LocalDateTime now = ZonedDateTime.now(koreaZoneId).toLocalDateTime();
            LocalDateTime startDate = now.plusDays(1);
            Instant expectedStartInstant = startDate.atZone(koreaZoneId).toInstant()
                .truncatedTo(ChronoUnit.MILLIS);
            LocalDateTime endDate = now.plusDays(2);
            Instant expectedEndInstant = endDate.atZone(koreaZoneId).toInstant()
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

    @Nested
    class cancelScheduledTask {

        @Test
        void 기존_스케줄_취소_성공() {
            // given
            String clubId = "club123";
            scheduledTasks.put(clubId, scheduledFuture);

            // when
            recruitmentScheduler.cancelScheduledTask(clubId);

            // then
            verify(scheduledFuture).cancel(false);
            assert (scheduledTasks.get(clubId) == null); // 태스크가 맵에서 제거되었는지 확인
        }
    }

    @Nested
    class updateRecruitmentStatus {

        @Test
        void 모집상태_업데이트_성공() {
            // given
            String clubId = new ObjectId().toHexString();
            ClubRecruitmentStatus status = ClubRecruitmentStatus.OPEN;

            Club club = new Club();

            when(clubRepository.findClubById(any(ObjectId.class))).thenReturn(Optional.of(club));

            // when
            recruitmentScheduler.updateRecruitmentStatus(clubId, status);

            // then
            verify(clubRepository).findClubById(any(ObjectId.class));
            verify(clubRepository).save(club);
        }

        @Test
        void 모집상태_업데이트_실패_존재하지않는_클럽() {
            // given
            String clubId = new ObjectId().toHexString();
            ClubRecruitmentStatus status = ClubRecruitmentStatus.OPEN;

            when(clubRepository.findClubById(any(ObjectId.class))).thenReturn(Optional.empty());

            // when, then
            try {
                recruitmentScheduler.updateRecruitmentStatus(clubId, status);
            } catch (Exception e) {
                assert (e instanceof RestApiException);
                assert (((RestApiException) e).getErrorCode().equals(
                    ErrorCode.CLUB_NOT_FOUND));
            }
        }
    }
}
