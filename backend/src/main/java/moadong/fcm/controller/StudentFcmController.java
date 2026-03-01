package moadong.fcm.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.fcm.payload.request.StudentFcmTokenRotateRequest;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
import moadong.fcm.payload.response.StudentFcmTokenRotateResponse;
import moadong.fcm.service.StudentFcmTokenService;
import moadong.global.payload.Response;
import moadong.user.service.StudentJwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@Tag(name = "Student FCM", description = "학생 FCM 토큰 관리 API")
public class StudentFcmController {

    private final StudentJwtService studentJwtService;
    private final StudentFcmTokenService studentFcmTokenService;

    @PutMapping("/fcm-token")
    @Operation(summary = "학생 FCM 토큰 교체", description = "Authorization의 학생 토큰 sub(UUID) 기준으로 FCM 토큰을 교체합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> rotateFcmToken(
            @RequestHeader("Authorization") String authorization,
            @RequestBody @Validated StudentFcmTokenRotateRequest request
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        StudentFcmTokenRotateResponse response = studentFcmTokenService.rotateFcmToken(studentId, request.fcmToken());
        return Response.ok(response);
    }

    @GetMapping("/subscriptions")
    @Operation(summary = "학생 구독 동아리 목록 조회", description = "Authorization의 학생 토큰 sub(UUID) 기준으로 구독 중인 동아리 목록을 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getSubscribedClubs(
            @RequestHeader("Authorization") String authorization
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        ClubSubscribeListResponse response = studentFcmTokenService.getSubscribedClubs(studentId);
        return Response.ok(response);
    }
}
