package moadong.fcm.controller;

import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;
import moadong.fcm.payload.request.FcmScheduleCreateRequest;
import moadong.fcm.payload.response.FcmScheduleCancelResponse;
import moadong.fcm.payload.response.FcmScheduleDetailResponse;
import moadong.fcm.payload.response.FcmScheduleSummaryResponse;
import moadong.fcm.service.FcmScheduledNotificationService;
import moadong.global.payload.Response;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FcmScheduledNotificationAdminControllerTest {

    @InjectMocks
    private FcmScheduledNotificationAdminController controller;

    @Mock
    private FcmScheduledNotificationService service;

    @Test
    void 예약을_생성한다() {
        FcmScheduleCreateRequest request = new FcmScheduleCreateRequest(
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(10)
        );
        FcmScheduleDetailResponse serviceResponse = detailResponse("schedule-id", FcmScheduleStatus.SCHEDULED);
        when(service.create(request)).thenReturn(serviceResponse);

        ResponseEntity<?> responseEntity = controller.create(request);

        Response<?> response = (Response<?>) responseEntity.getBody();
        assertThat(response.message()).isEqualTo("FCM 예약 알림이 생성되었습니다.");
        assertThat(response.data()).isEqualTo(serviceResponse);
        verify(service).create(request);
    }

    @Test
    void 예약_목록을_조회한다() {
        List<FcmScheduleSummaryResponse> serviceResponse = List.of(new FcmScheduleSummaryResponse(
                "schedule-id",
                FcmScheduleTargetType.ALL_TOKENS,
                "title",
                "body",
                Instant.now(),
                FcmScheduleStatus.SCHEDULED,
                Instant.now(),
                null,
                null,
                null,
                0,
                0,
                0
        ));
        when(service.getSchedules(FcmScheduleStatus.SCHEDULED)).thenReturn(serviceResponse);

        ResponseEntity<?> responseEntity = controller.getSchedules(FcmScheduleStatus.SCHEDULED);

        Response<?> response = (Response<?>) responseEntity.getBody();
        assertThat(response.data()).isEqualTo(serviceResponse);
    }

    @Test
    void 예약_상세를_조회한다() {
        FcmScheduleDetailResponse serviceResponse = detailResponse("schedule-id", FcmScheduleStatus.SCHEDULED);
        when(service.getSchedule("schedule-id")).thenReturn(serviceResponse);

        ResponseEntity<?> responseEntity = controller.getSchedule("schedule-id");

        Response<?> response = (Response<?>) responseEntity.getBody();
        assertThat(response.data()).isEqualTo(serviceResponse);
    }

    @Test
    void 예약을_취소한다() {
        FcmScheduleCancelResponse serviceResponse = new FcmScheduleCancelResponse(
                "schedule-id",
                FcmScheduleStatus.CANCELED,
                Instant.now()
        );
        when(service.cancel("schedule-id")).thenReturn(serviceResponse);

        ResponseEntity<?> responseEntity = controller.cancel("schedule-id");

        Response<?> response = (Response<?>) responseEntity.getBody();
        assertThat(response.message()).isEqualTo("FCM 예약 알림이 취소되었습니다.");
        assertThat(response.data()).isEqualTo(serviceResponse);
    }

    private FcmScheduleDetailResponse detailResponse(String id, FcmScheduleStatus status) {
        Instant now = Instant.now();
        return new FcmScheduleDetailResponse(
                id,
                FcmScheduleTargetType.ALL_TOKENS,
                null,
                "title",
                "body",
                Map.of(),
                now.plusSeconds(600),
                status,
                now,
                null,
                null,
                null,
                null,
                null,
                null,
                0,
                0,
                0,
                List.of()
        );
    }
}
