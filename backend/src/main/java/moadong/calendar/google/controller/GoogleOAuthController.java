package moadong.calendar.google.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.calendar.google.payload.request.GoogleCalendarSelectRequest;
import moadong.calendar.google.payload.request.GoogleTokenExchangeRequest;
import moadong.calendar.google.payload.response.GoogleTokenExchangeResponse;
import moadong.calendar.google.service.GoogleOAuthService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integration/google")
@RequiredArgsConstructor
@Tag(name = "Google Calendar Integration", description = "Google Calendar OAuth 연동 API")
public class GoogleOAuthController {

    private final GoogleOAuthService googleOAuthService;

    @GetMapping("/oauth/authorize")
    @Operation(summary = "Google OAuth 인가 URL 생성", description = "Google OAuth 인가 페이지로 이동할 URL을 생성합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getAuthorizeUrl(@RequestParam(required = false) String state) {
        return Response.ok(googleOAuthService.getAuthorizeUrl(state));
    }

    @PostMapping("/oauth/token")
    @Operation(summary = "Google OAuth code 교환", description = "Google authorization code를 access token으로 교환합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> exchangeToken(@CurrentUser CustomUserDetails user,
                                           @RequestBody @Valid GoogleTokenExchangeRequest request) {
        GoogleTokenExchangeResponse response = googleOAuthService.exchangeCode(user, request);
        return Response.ok(response);
    }

    @GetMapping("/calendars")
    @Operation(summary = "Google 캘린더 목록 조회", description = "Google 계정의 캘린더 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getCalendars(@CurrentUser CustomUserDetails user) {
        return Response.ok(googleOAuthService.getCalendars(user));
    }

    @PostMapping("/calendars/{calendarId}/select")
    @Operation(summary = "Google 캘린더 선택", description = "이벤트를 가져올 캘린더를 선택합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> selectCalendar(@CurrentUser CustomUserDetails user,
                                            @PathVariable String calendarId,
                                            @RequestBody @Valid GoogleCalendarSelectRequest request) {
        googleOAuthService.selectCalendar(user, calendarId, request);
        return Response.ok("캘린더가 선택되었습니다.");
    }

    @DeleteMapping("/connection")
    @Operation(summary = "Google Calendar 연결 해제", description = "Google Calendar 연결을 해제합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteConnection(@CurrentUser CustomUserDetails user) {
        googleOAuthService.deleteConnection(user);
        return Response.ok("Google Calendar 연결이 해제되었습니다.");
    }
}
