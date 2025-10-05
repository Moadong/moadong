package moadong.fcm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.fcm.payload.request.FcmSaveRequest;
import moadong.fcm.service.FcmService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fcm")
@AllArgsConstructor
@Tag(name = "FCM", description = "FCM 토큰 관리 및 알림 전송 기능 API")
public class FcmController {
    private final FcmService fcmService;

    @PostMapping
    public ResponseEntity<?> saveFcmToken(@RequestBody @Validated FcmSaveRequest request) {
        fcmService.saveFcmToken(request.fcmToken());
        return Response.ok("success save fcm token");
    }
}
