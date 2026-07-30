package moadong.calendar.custom.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.calendar.custom.payload.request.CustomCalendarEventRequest;
import moadong.calendar.custom.service.CustomCalendarEventService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integration/custom-events")
@RequiredArgsConstructor
@Tag(name = "Custom Calendar Events", description = "커스텀 캘린더 이벤트 관리 API")
public class CustomCalendarEventController {

    private final CustomCalendarEventService customCalendarEventService;

    @PostMapping
    @Operation(summary = "커스텀 캘린더 이벤트 생성", description = "관리자가 직접 입력한 캘린더 이벤트를 생성합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createEvent(@CurrentUser CustomUserDetails user,
                                         @RequestBody @Valid CustomCalendarEventRequest request) {
        return Response.ok(customCalendarEventService.create(user, request));
    }

    @GetMapping
    @Operation(summary = "커스텀 캘린더 이벤트 목록 조회", description = "동아리의 커스텀 캘린더 이벤트 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getEvents(@CurrentUser CustomUserDetails user) {
        return Response.ok(customCalendarEventService.list(user));
    }

    @PutMapping("/{eventId}")
    @Operation(summary = "커스텀 캘린더 이벤트 수정", description = "커스텀 캘린더 이벤트를 수정합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateEvent(@CurrentUser CustomUserDetails user,
                                         @PathVariable String eventId,
                                         @RequestBody @Valid CustomCalendarEventRequest request) {
        return Response.ok(customCalendarEventService.update(user, eventId, request));
    }

    @DeleteMapping("/{eventId}")
    @Operation(summary = "커스텀 캘린더 이벤트 삭제",
            description = "커스텀 캘린더 이벤트를 삭제합니다. 반복 일정은 scope(ALL/THIS/THIS_AND_FOLLOWING)와 기준 발생일 date로 삭제 범위를 지정합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteEvent(@CurrentUser CustomUserDetails user,
                                         @PathVariable String eventId,
                                         @RequestParam(required = false) String scope,
                                         @RequestParam(required = false) String date) {
        customCalendarEventService.delete(user, eventId, scope, date);
        return Response.ok("커스텀 캘린더 이벤트가 삭제되었습니다.");
    }
}
