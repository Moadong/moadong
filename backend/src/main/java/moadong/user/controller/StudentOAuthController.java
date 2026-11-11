package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.request.SocialCallbackRequest;
import moadong.user.payload.response.RefreshResponse;
import moadong.user.payload.response.StudentLoginResponse;
import moadong.user.service.StudentOAuthService;
import moadong.user.util.CookieMaker;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
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
    private final CookieMaker cookieMaker;

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

    @GetMapping("/logout")
    @Operation(summary = "학생 로그아웃", description = "클라이언트의 refresh token을 제거합니다.")
    public ResponseEntity<?> logout(
            @CookieValue(value = CookieMaker.REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response) {
        studentOAuthService.logout(refreshToken);
        ResponseCookie cookie = cookieMaker.makeExpiredRefreshTokenCookie();
        response.addHeader("Set-Cookie", cookie.toString());
        return Response.ok("success logout");
    }

    @PostMapping("/refresh")
    @Operation(summary = "학생 토큰 재발급", description = "refresh token을 이용하여 access token을 재발급합니다.")
    public ResponseEntity<?> refresh(
            @CookieValue(value = CookieMaker.REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response) {
        RefreshResponse refreshResponse = studentOAuthService.refreshAccessToken(refreshToken, response);
        return Response.ok(refreshResponse);
    }
}
