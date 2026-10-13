package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.media.dto.PresignedUploadResponse;
import moadong.user.payload.request.UpdateProfileRequest;
import moadong.user.payload.request.UploadProfileImageUrlRequest;
import moadong.user.payload.response.StudentProfileResponse;
import moadong.user.service.StudentProfileImageService;
import moadong.user.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/profile")
@AllArgsConstructor
@Tag(name = "Student Profile", description = "학생 프로필 API")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;
    private final StudentProfileImageService studentProfileImageService;

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

    @PostMapping("/image/upload-url")
    @Operation(summary = "프로필 이미지 업로드 URL 발급", description = "프로필 이미지 업로드를 위한 presigned URL을 발급합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getImageUploadUrl(
            @AuthenticationPrincipal String studentId,
            @Valid @RequestBody UploadProfileImageUrlRequest request) {
        PresignedUploadResponse response = studentProfileImageService.generateUploadUrl(
                studentId, request.fileName(), request.contentType());
        return Response.ok(response);
    }

    @DeleteMapping("/image")
    @Operation(summary = "프로필 이미지 삭제", description = "프로필 이미지를 삭제하고 기본 이미지로 초기화합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteProfileImage(@AuthenticationPrincipal String studentId) {
        studentProfileService.deleteProfileImage(studentId);
        return Response.ok("success");
    }
}
