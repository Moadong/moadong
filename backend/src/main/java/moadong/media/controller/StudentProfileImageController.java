package moadong.media.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadProfileImageUrlRequest;
import moadong.media.service.StudentProfileImageService;
import moadong.user.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/profile/image")
@RequiredArgsConstructor
@Tag(name = "Student Profile Image", description = "학생 프로필 이미지 API")
public class StudentProfileImageController {

    private final StudentProfileImageService studentProfileImageService;
    private final StudentProfileService studentProfileService;

    @PostMapping("/upload-url")
    @Operation(summary = "프로필 이미지 업로드 URL 발급", description = "프로필 이미지 업로드를 위한 presigned URL을 발급합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getImageUploadUrl(
            @AuthenticationPrincipal String studentId,
            @Valid @RequestBody UploadProfileImageUrlRequest request) {
        PresignedUploadResponse response = studentProfileImageService.generateUploadUrl(
                studentId, request.fileName(), request.contentType());
        return Response.ok(response);
    }

    @DeleteMapping
    @Operation(summary = "프로필 이미지 삭제", description = "프로필 이미지를 삭제하고 기본 이미지로 초기화합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteProfileImage(@AuthenticationPrincipal String studentId) {
        studentProfileService.deleteProfileImage(studentId);
        return Response.ok("success");
    }
}
