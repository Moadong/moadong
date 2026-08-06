package moadong.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import moadong.analytics.payload.request.ClubDetailDurationRecordRequest;
import moadong.analytics.service.ClubDetailDurationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics/club-detail")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "사용자 행동 통계 수집 API")
public class ClubDetailDurationController {

    private final ClubDetailDurationService clubDetailDurationService;

    @PostMapping("/duration")
    @Operation(summary = "동아리 상세 페이지 체류 시간 기록")
    public ResponseEntity<Void> recordDuration(
            @RequestBody ClubDetailDurationRecordRequest request,
            HttpServletRequest httpServletRequest
    ) {
        clubDetailDurationService.record(request, clientIp(httpServletRequest));
        return ResponseEntity.noContent().build();
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
