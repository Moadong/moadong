package moadong.fcm.repository;

import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@IntegrationTest
class FcmScheduledNotificationRepositoryTest {

    @Autowired
    private FcmScheduledNotificationRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void claimForSending은_due_SCHEDULED_예약만_SENDING으로_전환한다() {
        FcmScheduledNotification saved = repository.save(FcmScheduledNotification.create(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                Instant.now().minusSeconds(10)
        ));

        Optional<FcmScheduledNotification> claimed = repository.claimForSending(saved.getId(), Instant.now());

        assertThat(claimed).isPresent();
        assertThat(claimed.get().getStatus()).isEqualTo(FcmScheduleStatus.SENDING);
        assertThat(claimed.get().getSendingStartedAt()).isNotNull();
        assertThat(claimed.get().getUpdatedAt()).isNotNull();
    }

    @Test
    void claimForSending은_미래_예약을_전환하지_않는다() {
        FcmScheduledNotification saved = repository.save(FcmScheduledNotification.create(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                Instant.now().plusSeconds(600)
        ));

        Optional<FcmScheduledNotification> claimed = repository.claimForSending(saved.getId(), Instant.now());

        assertThat(claimed).isEmpty();
    }

    @Test
    void cancelIfScheduled는_SCHEDULED_예약만_CANCELED로_전환한다() {
        FcmScheduledNotification saved = repository.save(FcmScheduledNotification.create(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                Instant.now().plusSeconds(600)
        ));

        Optional<FcmScheduledNotification> canceled = repository.cancelIfScheduled(saved.getId(), Instant.now());

        assertThat(canceled).isPresent();
        assertThat(canceled.get().getStatus()).isEqualTo(FcmScheduleStatus.CANCELED);
        assertThat(canceled.get().getCanceledAt()).isNotNull();
        assertThat(canceled.get().getUpdatedAt()).isNotNull();
    }
}
