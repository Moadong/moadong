package moadong.fcm.service;

import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;
import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.payload.request.FcmScheduleCreateRequest;
import moadong.fcm.payload.response.FcmScheduleCancelResponse;
import moadong.fcm.payload.response.FcmScheduleDetailResponse;
import moadong.fcm.repository.FcmScheduledNotificationRepository;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FcmScheduledNotificationServiceTest {

    @InjectMocks
    private FcmScheduledNotificationService service;

    @Mock
    private FcmScheduledNotificationRepository repository;

    @Test
    void 단건_예약을_생성하면_SCHEDULED_상태로_저장한다() {
        FcmScheduleCreateRequest request = new FcmScheduleCreateRequest(
                FcmScheduleTargetType.SINGLE_TOKEN,
                "token",
                "title",
                "body",
                Map.of("path", "/webview"),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10)
        );
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        FcmScheduleDetailResponse response = service.create(request);

        assertThat(response.status()).isEqualTo(FcmScheduleStatus.SCHEDULED);
        assertThat(response.token()).isEqualTo("token");
        verify(repository).save(any(FcmScheduledNotification.class));
    }

    @Test
    void 전체_예약은_token을_저장하지_않는다() {
        FcmScheduleCreateRequest request = new FcmScheduleCreateRequest(
                FcmScheduleTargetType.ALL_TOKENS,
                "ignored-token",
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10)
        );
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        FcmScheduleDetailResponse response = service.create(request);

        assertThat(response.targetType()).isEqualTo(FcmScheduleTargetType.ALL_TOKENS);
        assertThat(response.token()).isNull();
    }

    @Test
    void 과거_예약시각이면_예외가_발생한다() {
        FcmScheduleCreateRequest request = new FcmScheduleCreateRequest(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).minusMinutes(1)
        );

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(RestApiException.class);
    }

    @Test
    void 단건_예약에서_token이_없으면_예외가_발생한다() {
        FcmScheduleCreateRequest request = new FcmScheduleCreateRequest(
                FcmScheduleTargetType.SINGLE_TOKEN,
                " ",
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10)
        );

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(RestApiException.class);
    }

    @Test
    void SCHEDULED_예약은_취소할_수_있다() {
        FcmScheduledNotification canceled = FcmScheduledNotification.create(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10).toInstant()
        );
        canceled.cancel(OffsetDateTime.now(ZoneOffset.UTC).toInstant());
        when(repository.cancelIfScheduled(any(), any())).thenReturn(Optional.of(canceled));

        FcmScheduleCancelResponse response = service.cancel("schedule-id");

        assertThat(response.status()).isEqualTo(FcmScheduleStatus.CANCELED);
    }

    @Test
    void 이미_처리된_예약은_취소할_수_없다() {
        FcmScheduledNotification sent = FcmScheduledNotification.create(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10).toInstant()
        );
        sent.markSending(OffsetDateTime.now(ZoneOffset.UTC).toInstant());
        sent.markBatchSent(0, 0, 0, List.of(), OffsetDateTime.now(ZoneOffset.UTC).toInstant());
        when(repository.cancelIfScheduled(any(), any())).thenReturn(Optional.empty());
        when(repository.findById("schedule-id")).thenReturn(Optional.of(sent));

        assertThatThrownBy(() -> service.cancel("schedule-id"))
                .isInstanceOf(RestApiException.class);
    }

    @Test
    void 목록은_상태가_없으면_전체를_조회한다() {
        when(repository.findAllByOrderByScheduledAtDesc()).thenReturn(List.of());

        assertThat(service.getSchedules(null)).isEmpty();

        verify(repository).findAllByOrderByScheduledAtDesc();
    }

    @Test
    void SENDING이_아닌_예약에는_발송_성공을_저장할_수_없다() {
        FcmScheduledNotification scheduled = FcmScheduledNotification.create(
                FcmScheduleTargetType.SINGLE_TOKEN,
                "token",
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10).toInstant()
        );
        when(repository.findById("schedule-id")).thenReturn(Optional.of(scheduled));

        assertThatThrownBy(() -> service.markSingleSent("schedule-id", "message-id", OffsetDateTime.now(ZoneOffset.UTC).toInstant()))
                .isInstanceOf(RestApiException.class);
    }
}
