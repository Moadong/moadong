package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.request.SocialCallbackRequest;
import moadong.user.payload.response.StudentLoginResponse;
import moadong.user.service.StudentOAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/student/oauth")
@RequiredArgsConstructor
@Tag(name = "Student OAuth", description = "학생 소셜 로그인 API")
public class StudentOAuthController {

    private final StudentOAuthService studentOAuthService;

    @PostMapping("/kakao/callback")
    @Operation(summary = "카카오 OAuth 콜백", description = "카카오 인가 코드로 학생 JWT를 발급합니다.")
    public ResponseEntity<?> kakaoCallback(
            @Valid @RequestBody SocialCallbackRequest request,
            HttpServletResponse response) {
        StudentLoginResponse result = studentOAuthService.loginWithKakao(
                request.code(), request.redirectUri(), response);
        return Response.ok(result);
    }

    @PostMapping("/google/callback")
    @Operation(summary = "구글 OAuth 콜백", description = "구글 인가 코드로 학생 JWT를 발급합니다.")
    public ResponseEntity<?> googleCallback(
            @Valid @RequestBody SocialCallbackRequest request,
            HttpServletResponse response) {
        StudentLoginResponse result = studentOAuthService.loginWithGoogle(
                request.code(), request.redirectUri(), response);
        return Response.ok(result);
    }
}
