package moadong.club.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.club.util.RecruitmentStateCalculator;
import moadong.fcm.model.PushPayload;
import moadong.fcm.port.PushNotificationPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RecruitmentStateCheckerTest {

    @InjectMocks
    private RecruitmentStateChecker recruitmentStateChecker;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private RecruitmentStateCalculator recruitmentStateCalculator;

    @Mock
    private PushNotificationPort pushNotificationPort;

    static final ZonedDateTime NOW = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

    @Test
    void 모집상태_ALWAYS_이면_변경되지_않음() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.ALWAYS);

        when(clubRepository.findAll()).thenReturn(List.of(club));

        recruitmentStateChecker.performTask();

        verify(recruitmentStateCalculator, never()).calculate(any(), any(), any());
        verify(clubRepository, never()).save(club);
    }

    @Test
    void 모집시작전_14일이내면_calculate호출() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        ZonedDateTime start = NOW.plusDays(10);
        ZonedDateTime end = NOW.plusDays(20);

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.CLOSED);
        when(info.getRecruitmentStart()).thenReturn(start);
        when(info.getRecruitmentEnd()).thenReturn(end);
        when(clubRepository.findAll()).thenReturn(List.of(club));

        recruitmentStateChecker.performTask();

        verify(recruitmentStateCalculator).calculate(eq(club), eq(start), eq(end));
        verify(clubRepository).save(club);
    }

    @Test
    void 모집기간중이면_calculate호출() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        ZonedDateTime start = NOW.minusDays(1);
        ZonedDateTime end = NOW.plusDays(5);

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.CLOSED);
        when(info.getRecruitmentStart()).thenReturn(start);
        when(info.getRecruitmentEnd()).thenReturn(end);
        when(clubRepository.findAll()).thenReturn(List.of(club));

        recruitmentStateChecker.performTask();

        verify(recruitmentStateCalculator).calculate(eq(club), eq(start), eq(end));
        verify(clubRepository).save(club);
    }

    @Test
    void 모집마감_이후면_calculate호출() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        ZonedDateTime start = NOW.minusDays(10);
        ZonedDateTime end = NOW.minusDays(1);

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.OPEN);
        when(info.getRecruitmentStart()).thenReturn(start);
        when(info.getRecruitmentEnd()).thenReturn(end);
        when(clubRepository.findAll()).thenReturn(List.of(club));

        recruitmentStateChecker.performTask();

        verify(recruitmentStateCalculator).calculate(eq(club), eq(start), eq(end));
        verify(clubRepository).save(club);
    }

    @Test
    void 시작_또는_종료날짜_null이면_calculate호출() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.OPEN);
        when(info.getRecruitmentStart()).thenReturn(null);
        when(info.getRecruitmentEnd()).thenReturn(null);
        when(clubRepository.findAll()).thenReturn(List.of(club));

        recruitmentStateChecker.performTask();

        verify(recruitmentStateCalculator).calculate(eq(club), eq(null), eq(null));
        verify(clubRepository).save(club);
    }

    @Test
    void 모집상태가_변경되면_알림을_전송한다() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);
        ZonedDateTime start = NOW.minusDays(1);
        ZonedDateTime end = NOW.plusDays(5);
        PushPayload payload = new PushPayload("title", "body", "topic", java.util.Map.of("clubId", "1"));

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.CLOSED);
        when(info.getRecruitmentStart()).thenReturn(start);
        when(info.getRecruitmentEnd()).thenReturn(end);
        when(clubRepository.findAll()).thenReturn(List.of(club));
        when(recruitmentStateCalculator.calculate(eq(club), eq(start), eq(end))).thenReturn(true);
        when(recruitmentStateCalculator.buildRecruitmentMessage(eq(club), any())).thenReturn(payload);

        recruitmentStateChecker.performTask();

        verify(pushNotificationPort).send(payload);
        verify(clubRepository).save(club);
    }
}
