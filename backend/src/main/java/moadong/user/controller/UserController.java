package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.global.util.JwtProvider;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.request.UserRegisterRequest;
import moadong.user.payload.request.UserUpdateRequest;
import moadong.user.payload.response.AccessTokenResponse;
import moadong.user.payload.response.FindUserClubResponse;
import moadong.user.payload.response.LoginResponse;
import moadong.user.service.UserCommandService;
import moadong.user.view.UserSwaggerView;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/user")
@AllArgsConstructor
@Tag(name = "User", description = "동아리 담당자 계정 API")
public class UserController {

    private final UserCommandService userCommandService;
    private final JwtProvider jwtProvider;

    @PostMapping("/register")
    @Operation(
        summary = UserSwaggerView.ADMIN_REGISTER_SUMMARY,
        description = UserSwaggerView.ADMIN_PWD_ROLE_DESCRIPTION
    )
    public ResponseEntity<?> registerUser(@RequestBody @Validated UserRegisterRequest request) {
        userCommandService.registerUser(request);
        return Response.ok("success register");
    }

    @PostMapping("/login")@Operation(
        summary = UserSwaggerView.ADMIN_LOGIN_SUMMARY,
        description = UserSwaggerView.ADMIN_LOGIN_DESCRIPTION
    )
    public ResponseEntity<?> loginUser(@RequestBody @Validated UserLoginRequest request,
        HttpServletResponse response) {
        LoginResponse loginResponse = userCommandService.loginUser(request, response);
        return Response.ok(loginResponse);
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 재발급", description = "refresh token을 이용하여 access token을 재발급합니다.")
    public ResponseEntity<?> refresh(
        @CookieValue(value = "refresh_token", required = false) String refreshToken) {
        AccessTokenResponse accessTokenResponse = userCommandService.refreshAccessToken(
            refreshToken);
        return Response.ok(accessTokenResponse);
    }

    @PutMapping("/")
    @Operation(summary = "사용자 정보 수정", description = "사용자 정보를 수정합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> update(@CurrentUser CustomUserDetails user,
        @RequestBody @Validated UserUpdateRequest userUpdateRequest) {
        userCommandService.update(user.getUserId(), userUpdateRequest);
        return Response.ok("success update");
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
