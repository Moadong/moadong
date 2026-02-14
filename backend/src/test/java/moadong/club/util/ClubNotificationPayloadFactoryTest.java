package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.fcm.model.PushPayload;
import moadong.fcm.util.FcmTopicResolver;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@UnitTest
class ClubNotificationPayloadFactoryTest {

    @InjectMocks
    private ClubNotificationPayloadFactory payloadFactory;

    @Mock
    private FcmTopicResolver fcmTopicResolver;

    @Test
    void create_클럽_공통_푸시_페이로드를_생성한다() {
        Club club = new Club(
                "club-id",
                "테스트 동아리",
                "category",
                "division",
                null,
                null,
                null,
                ClubRecruitmentInformation.builder().build(),
                null,
                null
        );
        when(fcmTopicResolver.resolveTopic("club-id")).thenReturn("club_topic");

        PushPayload payload = payloadFactory.create(club, "본문");

        PushPayload expected = new PushPayload(
                "테스트 동아리",
                "본문",
                "club_topic",
                java.util.Map.of(
                        "path", "/webview/clubDetail/club-id",
                        "action", "NAVIGATE_WEBVIEW",
                        "clubId", "club-id"
                )
        );

        assertThat(payload).isEqualTo(expected);
    }
}
