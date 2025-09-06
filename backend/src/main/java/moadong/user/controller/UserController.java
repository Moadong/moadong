package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.request.UserRegisterRequest;
import moadong.user.payload.request.UserResetRequest;
import moadong.user.payload.request.UserUpdateRequest;
import moadong.user.payload.response.FindUserClubResponse;
import moadong.user.payload.response.LoginResponse;
import moadong.user.payload.response.RefreshResponse;
import moadong.user.payload.response.TempPasswordResponse;
import moadong.user.service.UserCommandService;
import moadong.user.view.UserSwaggerView;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/user")
@AllArgsConstructor
@Tag(name = "User", description = "동아리 담당자 계정 API")
public class UserController {

    private final UserCommandService userCommandService;

    @PostMapping("/register")
    @Operation(
            summary = UserSwaggerView.ADMIN_REGISTER_SUMMARY,
            description = UserSwaggerView.ADMIN_PWD_ROLE_DESCRIPTION
    )
    public ResponseEntity<?> registerUser(@RequestBody @Validated UserRegisterRequest request) {
        userCommandService.registerUser(request);
        return Response.ok("success register");
    }

    @PostMapping("/login")
    @Operation(
            summary = UserSwaggerView.ADMIN_LOGIN_SUMMARY,
            description = UserSwaggerView.ADMIN_LOGIN_DESCRIPTION
    )
    public ResponseEntity<?> loginUser(@RequestBody @Validated UserLoginRequest request,
                                       HttpServletResponse response) {
        LoginResponse loginResponse = userCommandService.loginUser(request, response);
        return Response.ok(loginResponse);
    }
    //TODO : 토큰 회전 방식 + DB 리프레쉬 토큰 저장

    @GetMapping("/logout")
    @Operation(summary = "로그아웃", description = "클라이언트의 refresh token을 제거합니다.")
    public ResponseEntity<?> logout(
            @CookieValue(value = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        userCommandService.logoutUser(refreshToken);
        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .sameSite("None")
                .secure(true)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return Response.ok("success logout");
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 재발급", description = "refresh token을 이용하여 access token을 재발급합니다.")
    public ResponseEntity<?> refresh(
            @CookieValue(value = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        RefreshResponse refreshResponse = userCommandService.refreshAccessToken(
                refreshToken, response);
        return Response.ok(refreshResponse);
    }


    @PutMapping("/")
    @Operation(summary = "사용자 정보 수정", description = "사용자 정보를 수정합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> update(@CurrentUser CustomUserDetails user,
                                    @RequestBody @Validated UserUpdateRequest userUpdateRequest,
                                    HttpServletResponse response) {
        userCommandService.update(user.getUserId(), userUpdateRequest, response);
        return Response.ok("success update");
    }

    @PostMapping("/reset")
    @Operation(summary = "사용자 비밀번호 초기화", description = "사용자 비밀번호를 초기화합니다.")
    public ResponseEntity<?> reset(@RequestBody @Validated UserResetRequest userResetRequest) {
        TempPasswordResponse tempPwdResponse = userCommandService.reset(userResetRequest.userId());
        return Response.ok(tempPwdResponse);
    }

    @PostMapping("/find/club")
    @Operation(summary = "사용자 동아리 조회", description = "사용자의 동아리를 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> findUserClub(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String clubId = userCommandService.findClubIdByUserId(userDetails.getId());
        return Response.ok(new FindUserClubResponse(clubId));
    }


}
