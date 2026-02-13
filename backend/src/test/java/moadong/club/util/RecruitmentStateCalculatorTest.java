package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.fcm.model.PushPayload;
import moadong.fcm.util.FcmTopicResolver;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@UnitTest
class RecruitmentStateCalculatorTest {

    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    @InjectMocks
    private RecruitmentStateCalculator recruitmentStateCalculator;

    @Mock
    private FcmTopicResolver fcmTopicResolver;

    @Test
    void calculate_모집상태가_변경되면_true를_반환하고_상태를_갱신한다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);

        Club club = createClub(ClubRecruitmentStatus.CLOSED, start, end);
        boolean changed = recruitmentStateCalculator.calculate(club, start, end);

        assertThat(changed).isTrue();
        assertThat(club.getClubRecruitmentInformation().getClubRecruitmentStatus())
                .isEqualTo(ClubRecruitmentStatus.OPEN);
    }

    @Test
    void calculate_모집상태가_변경되지_않으면_false를_반환한다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);

        Club club = createClub(ClubRecruitmentStatus.OPEN, start, end);

        boolean changed = recruitmentStateCalculator.calculate(club, start, end);

        assertThat(changed).isFalse();
        assertThat(club.getClubRecruitmentInformation().getClubRecruitmentStatus())
                .isEqualTo(ClubRecruitmentStatus.OPEN);
    }

    @Test
    void buildRecruitmentMessage_상태에_맞는_페이로드를_생성한다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);
        Club club = createClub(ClubRecruitmentStatus.OPEN, start, end);
        when(fcmTopicResolver.resolveTopic("club-id")).thenReturn("club_topic");

        PushPayload payload = recruitmentStateCalculator.buildRecruitmentMessage(club, ClubRecruitmentStatus.OPEN);

        assertThat(payload.topic()).isEqualTo("club_topic");
        assertThat(payload.title()).isEqualTo("테스트 동아리");
        assertThat(payload.body()).contains("모집 중");
        assertThat(payload.data()).containsEntry("clubId", "club-id");
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
