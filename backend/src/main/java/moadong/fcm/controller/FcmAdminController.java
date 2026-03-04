package moadong.fcm.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.fcm.payload.request.FcmAdminBatchSendRequest;
import moadong.fcm.payload.request.FcmAdminSingleSendRequest;
import moadong.fcm.service.FcmAdminService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Tag(name = "Fcm_Notification_Admin", description = "FCM 알림관리자 페이지 기능")
public class FcmAdminController {

    private final FcmAdminService fcmAdminService;

    @GetMapping("/tokens")
    @Operation(summary = "전체 FCM 토큰 조회", description = "학생/비학생 토큰을 모두 합쳐 중복 제거된 토큰 목록을 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getAllAvailableToken() {
        return Response.ok(fcmAdminService.getAllAvailableToken());
    }

    @PostMapping("/fcm/send")
    @Operation(summary = "FCM 단건 발송", description = "특정 토큰으로 개별 FCM 메시지를 발송합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> sendToToken(@RequestBody @Valid FcmAdminSingleSendRequest request) {
        return Response.ok("FCM 단건 발송 완료", fcmAdminService.sendToToken(request));
    }

    @PostMapping("/fcm/send-all")
    @Operation(summary = "FCM 전체 배치 발송", description = "저장된 전체 토큰을 대상으로 FCM 메시지를 발송합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> sendToAll(@RequestBody @Valid FcmAdminBatchSendRequest request) {
        return Response.ok("FCM 전체 배치 발송 완료", fcmAdminService.sendToAll(request));
    }
}
