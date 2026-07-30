package moadong.calendar.hidden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.calendar.hidden.payload.request.HiddenCalendarEventRequest;
import moadong.calendar.hidden.service.HiddenCalendarEventService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integration/calendar-events/hidden")
@RequiredArgsConstructor
@Tag(name = "Hidden Calendar Events", description = "OAuth 캘린더 이벤트 숨김 관리 API")
public class HiddenCalendarEventController {

    private final HiddenCalendarEventService hiddenCalendarEventService;

    @PostMapping
    @Operation(summary = "캘린더 이벤트 숨김", description = "Google/Notion 캘린더 이벤트를 공개 캘린더에서 숨깁니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> hideEvent(@CurrentUser CustomUserDetails user,
                                       @RequestBody @Valid HiddenCalendarEventRequest request) {
        hiddenCalendarEventService.hide(user, request.source(), request.eventId());
        return Response.ok("이벤트가 숨김 처리되었습니다.");
    }

    @DeleteMapping
    @Operation(summary = "캘린더 이벤트 숨김 해제", description = "숨김 처리된 Google/Notion 캘린더 이벤트를 다시 표시합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> unhideEvent(@CurrentUser CustomUserDetails user,
                                         @RequestBody @Valid HiddenCalendarEventRequest request) {
        hiddenCalendarEventService.unhide(user, request.source(), request.eventId());
        return Response.ok("이벤트 숨김이 해제되었습니다.");
    }

    @GetMapping
    @Operation(summary = "숨김 이벤트 목록 조회", description = "숨김 처리된 캘린더 이벤트 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getHiddenEvents(@CurrentUser CustomUserDetails user) {
        return Response.ok(hiddenCalendarEventService.list(user));
    }
}
