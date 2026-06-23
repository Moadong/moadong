package moadong.club.service;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.club.util.RecruitmentDdayNotificationBuilder;
import moadong.fcm.model.PushPayload;
import moadong.fcm.port.PushNotificationPort;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class RecruitmentDdayNotifierTest {

    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    @InjectMocks
    private RecruitmentDdayNotifier recruitmentDdayNotifier;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private RecruitmentDdayNotificationBuilder notificationBuilder;

    @Mock
    private PushNotificationPort pushNotificationPort;

    @Test
    void Dday가_7_3_1일이면_알림을_전송한다() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);
        PushPayload payload = new PushPayload("title", "body", "topic", Map.of("clubId", "1"));

        ZonedDateTime recruitmentEnd = ZonedDateTime.now(SEOUL_ZONE).plusDays(3).withHour(18).withMinute(0);

        when(clubRepository.findAllByClubRecruitmentInformation_ClubRecruitmentStatus(ClubRecruitmentStatus.OPEN))
                .thenReturn(List.of(club));
        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(club.getId()).thenReturn("club-id");
        when(club.getName()).thenReturn("테스트 동아리");
        when(info.getRecruitmentEnd()).thenReturn(recruitmentEnd);
        when(notificationBuilder.build(club, 3L)).thenReturn(payload);

        recruitmentDdayNotifier.sendDdayNotifications();

        verify(pushNotificationPort).send(payload);
    }

    @Test
    void Dday가_7_3_1일이_아니면_알림을_전송하지_않는다() {
        Club club = mock(Club.class);
        ClubRecruitmentInformation info = mock(ClubRecruitmentInformation.class);

        ZonedDateTime recruitmentEnd = ZonedDateTime.now(SEOUL_ZONE).plusDays(2).withHour(18).withMinute(0);

        when(clubRepository.findAllByClubRecruitmentInformation_ClubRecruitmentStatus(ClubRecruitmentStatus.OPEN))
                .thenReturn(List.of(club));
        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(info.getRecruitmentEnd()).thenReturn(recruitmentEnd);

        recruitmentDdayNotifier.sendDdayNotifications();

        verify(notificationBuilder, never()).build(club, 2L);
        verify(pushNotificationPort, never()).send(org.mockito.ArgumentMatchers.any());
    }
}
