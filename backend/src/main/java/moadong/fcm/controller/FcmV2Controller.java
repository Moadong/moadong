package moadong.fcm.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.fcm.payload.request.ClubSubscribeV2Request;
import moadong.fcm.service.StudentFcmTokenService;
import moadong.global.payload.Response;
import moadong.user.service.StudentJwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/fcm")
@RequiredArgsConstructor
@Tag(name = "FCM V2", description = "JWT 기반 FCM 구독 API")
public class FcmV2Controller {

    private final StudentJwtService studentJwtService;
    private final StudentFcmTokenService studentFcmTokenService;

    @PutMapping("/subscribe")
    @Operation(summary = "동아리 모집정보 알림 구독(v2)", description = "Authorization의 학생 토큰 sub(UUID) 기준으로 구독 동아리 목록을 갱신합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> subscribeRecruitment(
            @RequestHeader("Authorization") String authorization,
            @RequestBody @Validated ClubSubscribeV2Request request
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        studentFcmTokenService.subscribeClubs(studentId, request.clubIds());
        return Response.ok("success subscribe club");
    }
}
