package moadong.fcm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import moadong.fcm.payload.request.ClubSubscribeRequest;
import moadong.fcm.payload.request.FcmSaveRequest;
import moadong.fcm.service.FcmService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribeRecruitment(@RequestBody @Validated ClubSubscribeRequest request) {
        fcmService.subscribeClubs(request.fcmToken(), request.clubIds());
        return Response.ok("success subscribe club");
    }

    @GetMapping("/subscribe")
    public ResponseEntity<?> getSubscribedClubs(@RequestParam("fcmToken")
                                                @Validated @NotNull String fcmToken) {
        return Response.ok(fcmService.getSubscribeClubs(fcmToken));
    }
}
