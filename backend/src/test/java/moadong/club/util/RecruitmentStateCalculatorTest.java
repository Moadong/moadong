package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.fcm.model.PushPayload;
import moadong.fcm.port.PushNotificationPort;
import moadong.fcm.util.FcmTopicResolver;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class RecruitmentStateCalculatorTest {

    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    @InjectMocks
    private RecruitmentStateCalculator recruitmentStateCalculator;

    @Mock
    private FcmTopicResolver fcmTopicResolver;

    @Mock
    private PushNotificationPort pushNotificationPort;

    @Test
    void calculate_모집상태가_변경되면_알림을_전송한다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);

        Club club = createClub(ClubRecruitmentStatus.CLOSED, start, end);
        when(fcmTopicResolver.resolveTopic("club-id")).thenReturn("club_topic");

        recruitmentStateCalculator.calculate(club, start, end);

        assertThat(club.getClubRecruitmentInformation().getClubRecruitmentStatus())
                .isEqualTo(ClubRecruitmentStatus.OPEN);

        ArgumentCaptor<PushPayload> captor = ArgumentCaptor.forClass(PushPayload.class);
        verify(pushNotificationPort).send(captor.capture());
        PushPayload payload = captor.getValue();
        assertThat(payload.topic()).isEqualTo("club_topic");
        assertThat(payload.title()).isEqualTo("테스트 동아리");
        assertThat(payload.data()).containsEntry("clubId", "club-id");
    }

    @Test
    void calculate_모집상태가_변경되지_않으면_알림을_전송하지_않는다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);

        Club club = createClub(ClubRecruitmentStatus.OPEN, start, end);

        recruitmentStateCalculator.calculate(club, start, end);

        assertThat(club.getClubRecruitmentInformation().getClubRecruitmentStatus())
                .isEqualTo(ClubRecruitmentStatus.OPEN);
        verify(pushNotificationPort, never()).send(any(PushPayload.class));
    }

    private Club createClub(ClubRecruitmentStatus status, ZonedDateTime recruitmentStart, ZonedDateTime recruitmentEnd) {
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .clubRecruitmentStatus(status)
                .recruitmentStart(recruitmentStart.toInstant())
                .recruitmentEnd(recruitmentEnd.toInstant())
                .build();

        return new Club(
                "club-id",
                "테스트 동아리",
                "category",
                "division",
                null,
                null,
                null,
                info,
                null,
                null
        );
    }
}
