package moadong.fcm.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.payload.request.FcmScheduleCreateRequest;
import moadong.fcm.service.FcmScheduledNotificationService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/fcm/schedules")
@RequiredArgsConstructor
@Tag(name = "Fcm_Scheduled_Notification_Admin", description = "FCM 예약 알림 관리자 페이지 기능")
public class FcmScheduledNotificationAdminController {

    private final FcmScheduledNotificationService service;

    @PostMapping
    @Operation(summary = "FCM 예약 알림 생성", description = "지정한 시각에 발송될 FCM 알림을 예약합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> create(@RequestBody @Valid FcmScheduleCreateRequest request) {
        return Response.ok("FCM 예약 알림이 생성되었습니다.", service.create(request));
    }

    @GetMapping
    @Operation(summary = "FCM 예약 알림 목록 조회", description = "FCM 예약 알림 목록을 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getSchedules(@RequestParam(required = false) FcmScheduleStatus status) {
        return Response.ok(service.getSchedules(status));
    }

    @GetMapping("/{scheduleId}")
    @Operation(summary = "FCM 예약 알림 상세 조회", description = "FCM 예약 알림 상세를 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getSchedule(@PathVariable String scheduleId) {
        return Response.ok(service.getSchedule(scheduleId));
    }

    @DeleteMapping("/{scheduleId}")
    @Operation(summary = "FCM 예약 알림 취소", description = "발송 전 예약 알림을 취소합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> cancel(@PathVariable String scheduleId) {
        return Response.ok("FCM 예약 알림이 취소되었습니다.", service.cancel(scheduleId));
    }
}
