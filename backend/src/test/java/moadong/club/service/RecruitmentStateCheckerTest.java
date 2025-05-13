package moadong.club.service;

import static org.mockito.ArgumentMatchers.any;
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

    static final ZonedDateTime NOW = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

    @Test
    void 모집상태_ALWAYS_이면_변경되지_않음() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getClubRecruitmentStatus()).thenReturn(ClubRecruitmentStatus.ALWAYS);

        when(clubRepository.findAll()).thenReturn(List.of(club));

        recruitmentStateChecker.performTask();

        verify(club, never()).updateRecruitmentStatus(any());
        verify(clubRepository, never()).save(club);
    }

    @Test
    void 모집시작전_14일이내면_UPCOMING() {
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

        verify(club).updateRecruitmentStatus(ClubRecruitmentStatus.UPCOMING);
        verify(clubRepository).save(club);
    }

    @Test
    void 모집기간중이면_OPEN() {
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

        verify(club).updateRecruitmentStatus(ClubRecruitmentStatus.OPEN);
        verify(clubRepository).save(club);
    }
}
