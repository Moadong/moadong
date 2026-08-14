package moadong.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import moadong.analytics.payload.request.ClubDetailDurationRecordRequest;
import moadong.analytics.service.ClubDetailDurationService;
import moadong.global.payload.Response;
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

    /** IPv6 최대 표기 길이. */
    private static final int MAX_IP_LENGTH = 45;

    private final ClubDetailDurationService clubDetailDurationService;

    @PostMapping("/duration")
    @Operation(summary = "동아리 상세 페이지 체류 시간 기록")
    public ResponseEntity<?> recordDuration(
            @RequestBody ClubDetailDurationRecordRequest request,
            HttpServletRequest httpServletRequest
    ) {
        clubDetailDurationService.record(request, clientIp(httpServletRequest));
        return Response.ok("체류 시간이 기록되었습니다.");
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            String candidate = forwardedFor.split(",")[0].trim();
            // 헤더는 호출자가 조작할 수 있으므로 IP 길이를 벗어난 값은 요청 제한 키로 쓰지 않는다.
            if (!candidate.isEmpty() && candidate.length() <= MAX_IP_LENGTH) {
                return candidate;
            }
        }
        return request.getRemoteAddr();
    }
}
