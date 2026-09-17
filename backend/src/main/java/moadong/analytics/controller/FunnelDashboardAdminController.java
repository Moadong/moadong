package moadong.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.analytics.service.FunnelDashboardService;
import moadong.global.payload.Response;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/statistics/funnels")
@RequiredArgsConstructor
@Tag(name = "Statistics_Admin", description = "통계 개발자 API")
public class FunnelDashboardAdminController {

    private final FunnelDashboardService funnelDashboardService;

    @GetMapping
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "운영진 퍼널 이탈율 조회", description = "개발자 포털 퍼널 대시보드용. 기간 내 퍼널별 단계 고유 사용자 수와 전환율을 반환합니다.")
    public ResponseEntity<?> getFunnels(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return Response.ok(funnelDashboardService.getDashboard(from, to));
    }
}
