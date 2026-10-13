package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.request.UpdateProfileRequest;
import moadong.user.payload.response.StudentProfileResponse;
import moadong.user.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
@Tag(name = "Student Profile", description = "학생 프로필 API")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    @GetMapping
    @Operation(summary = "프로필 조회", description = "학생의 프로필 정보를 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal String studentId) {
        StudentProfileResponse profile = studentProfileService.getProfile(studentId);
        return Response.ok(profile);
    }

    @PatchMapping
    @Operation(summary = "프로필 수정", description = "학생의 닉네임과 프로필 이미지를 수정합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal String studentId,
            @Valid @RequestBody UpdateProfileRequest request) {
        studentProfileService.updateProfile(studentId, request.nickname(), request.imageUrl());
        return Response.ok("success");
    }
}
