package moadong.fcm.service;

import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleTargetType;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.model.TokenPushResult;
import moadong.fcm.port.PushNotificationPort;
import moadong.fcm.payload.response.TokenListResponse;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FcmScheduledNotificationDispatcherTest {

    @InjectMocks
    private FcmScheduledNotificationDispatcher dispatcher;

    @Mock
    private FcmScheduledNotificationService scheduleService;

    @Mock
    private FcmAdminService fcmAdminService;

    @Mock
    private PushNotificationPort pushNotificationPort;

    @Test
    void due_단건_예약을_선점하고_발송한다() {
        FcmScheduledNotification schedule = FcmScheduledNotification.create(
                FcmScheduleTargetType.SINGLE_TOKEN,
                "token",
                "title",
                "body",
                Map.of("path", "/webview"),
                Instant.now().minusSeconds(10)
        );

        when(scheduleService.findDueSchedules(any())).thenReturn(List.of(schedule));
        when(scheduleService.claimForSending(any(), any())).thenReturn(Optional.of(schedule));
        when(pushNotificationPort.sendToToken(any())).thenReturn(new TokenPushResult(true, "message-id"));

        dispatcher.dispatchDueNotifications();

        verify(pushNotificationPort).sendToToken(any());
        verify(scheduleService).markSingleSent(any(), any(), any());
    }

    @Test
    void 선점에_실패한_예약은_발송하지_않는다() {
        FcmScheduledNotification schedule = FcmScheduledNotification.create(
                FcmScheduleTargetType.SINGLE_TOKEN,
                "token",
                "title",
                "body",
                Map.of(),
                Instant.now().minusSeconds(10)
        );

        when(scheduleService.findDueSchedules(any())).thenReturn(List.of(schedule));
        when(scheduleService.claimForSending(any(), any())).thenReturn(Optional.empty());

        dispatcher.dispatchDueNotifications();

        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 전체_예약은_전체_토큰으로_멀티캐스트_발송한다() {
        FcmScheduledNotification schedule = FcmScheduledNotification.create(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                Instant.now().minusSeconds(10)
        );

        when(scheduleService.findDueSchedules(any())).thenReturn(List.of(schedule));
        when(scheduleService.claimForSending(any(), any())).thenReturn(Optional.of(schedule));
        when(fcmAdminService.getAllAvailableToken()).thenReturn(new TokenListResponse(List.of("token1", "token2")));
        when(pushNotificationPort.sendToTokens(any())).thenReturn(new MulticastPushResult(1, 2, 0, List.of()));

        dispatcher.dispatchDueNotifications();

        verify(pushNotificationPort).sendToTokens(any());
        verify(scheduleService).markBatchSent(any(), org.mockito.ArgumentMatchers.eq(2), any(), any());
    }
}
