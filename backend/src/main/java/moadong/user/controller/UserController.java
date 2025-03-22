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
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Validated UserLoginRequest request,
        HttpServletResponse response) {
        LoginResponse loginResponse = userCommandService.loginUser(request, response);
        return Response.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
        @CookieValue(value = "refresh_token", required = false) String refreshToken) {
        AccessTokenResponse accessTokenResponse = userCommandService.refreshAccessToken(
            refreshToken);
        return Response.ok(accessTokenResponse);
    }

    @PutMapping("/")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> update(@CurrentUser CustomUserDetails user,
        @RequestBody @Validated UserUpdateRequest userUpdateRequest) {
        userCommandService.update(user.getUserId(), userUpdateRequest);
        return Response.ok("success update");
    }

    @PostMapping("/find/club")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> findUserClub(@AuthenticationPrincipal CustomUserDetails userDetails){
        return Response.ok(new FindUserClubResponse(userDetails.getId()));
    }

}
