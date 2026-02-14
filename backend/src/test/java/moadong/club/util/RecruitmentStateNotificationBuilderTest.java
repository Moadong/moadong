package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.fcm.model.PushPayload;
import moadong.fcm.util.FcmTopicResolver;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@UnitTest
class RecruitmentStateNotificationBuilderTest {

    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    @Mock
    private FcmTopicResolver fcmTopicResolver;

    private RecruitmentStateNotificationBuilder builder;

    @BeforeEach
    void setUp() {
        builder = new RecruitmentStateNotificationBuilder(new ClubNotificationPayloadFactory(fcmTopicResolver));
    }

    @Test
    void build_OPEN_상태_알림_페이로드를_생성한다() {
        ZonedDateTime start = ZonedDateTime.of(2026, 2, 13, 9, 0, 0, 0, SEOUL_ZONE);
        ZonedDateTime end = ZonedDateTime.of(2026, 2, 20, 18, 30, 0, 0, SEOUL_ZONE);
        Club club = createClub(start, end);
        when(fcmTopicResolver.resolveTopic("club-id")).thenReturn("club_topic");

        PushPayload payload = builder.build(club, ClubRecruitmentStatus.OPEN);

        String body = end.format(DateTimeFormatter.ofPattern("M월 d일 a h시 m분", Locale.KOREAN))
                + "까지 모집 중이니 서둘러 지원하세요!";
        PushPayload expected = new PushPayload(
                "테스트 동아리",
                body,
                "club_topic",
                Map.of(
                        "path", "/webview/clubDetail/club-id",
                        "action", "NAVIGATE_WEBVIEW",
                        "clubId", "club-id"
                )
        );
        assertThat(payload).isEqualTo(expected);
    }

    @Test
    void build_CLOSED_상태_알림_페이로드를_생성한다() {
        ZonedDateTime start = ZonedDateTime.of(2026, 2, 13, 9, 0, 0, 0, SEOUL_ZONE);
        ZonedDateTime end = ZonedDateTime.of(2026, 2, 20, 18, 30, 0, 0, SEOUL_ZONE);
        Club club = createClub(start, end);
        when(fcmTopicResolver.resolveTopic("club-id")).thenReturn("club_topic");

        PushPayload payload = builder.build(club, ClubRecruitmentStatus.CLOSED);

        PushPayload expected = new PushPayload(
                "테스트 동아리",
                "모집이 마감되었습니다. 다음 모집을 기대해주세요.",
                "club_topic",
                Map.of(
                        "path", "/webview/clubDetail/club-id",
                        "action", "NAVIGATE_WEBVIEW",
                        "clubId", "club-id"
                )
        );
        assertThat(payload).isEqualTo(expected);
    }

    private Club createClub(ZonedDateTime recruitmentStart, ZonedDateTime recruitmentEnd) {
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .clubRecruitmentStatus(ClubRecruitmentStatus.CLOSED)
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
