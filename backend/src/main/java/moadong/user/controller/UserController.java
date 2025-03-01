package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.request.UserRegisterRequest;
import moadong.user.payload.request.UserUpdateRequest;
import moadong.user.payload.response.AccessTokenResponse;
import moadong.user.service.UserCommandService;
import moadong.user.view.UserSwaggerView;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> loginUser(@RequestBody @Validated UserLoginRequest request, HttpServletResponse response) {
        AccessTokenResponse accessTokenResponse = userCommandService.loginUser(request, response);
        return Response.ok(accessTokenResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refresh_token", required = false) String refreshToken) {
        AccessTokenResponse accessTokenResponse = userCommandService.refreshAccessToken(refreshToken);
        return Response.ok(accessTokenResponse);
    }

    @PutMapping("/")
    public ResponseEntity<?> update(@CurrentUser CustomUserDetails user,
        @RequestBody @Validated UserUpdateRequest userUpdateRequest) {
        userCommandService.update(user.getUserId(), userUpdateRequest);
        return Response.ok("success update");
    }

}
