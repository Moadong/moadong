package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.request.UpdateNicknameRequest;
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
@AllArgsConstructor
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

    @PatchMapping("/nickname")
    @Operation(summary = "닉네임 수정", description = "학생의 닉네임을 수정합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateNickname(
            @AuthenticationPrincipal String studentId,
            @Valid @RequestBody UpdateNicknameRequest request) {
        studentProfileService.updateNickname(studentId, request.nickname());
        return Response.ok("success");
    }
}
