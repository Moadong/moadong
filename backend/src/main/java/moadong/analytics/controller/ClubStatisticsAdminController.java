package moadong.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.analytics.service.ClubStatisticsAdminService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/club/statistics")
@RequiredArgsConstructor
@Tag(name = "Club_Statistics_Admin", description = "동아리 관리자 통계 API")
public class ClubStatisticsAdminController {

    private final ClubStatisticsAdminService clubStatisticsAdminService;

    @GetMapping("/overview")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "내 동아리 통계 요약 조회")
    public ResponseEntity<?> getOverview(
            @CurrentUser CustomUserDetails user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return Response.ok(clubStatisticsAdminService.getOverview(user.getClubId(), from, to));
    }

    @GetMapping("/trend")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "내 동아리 일자별 통계 추이 조회")
    public ResponseEntity<?> getTrend(
            @CurrentUser CustomUserDetails user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return Response.ok(clubStatisticsAdminService.getTrend(user.getClubId(), from, to));
    }

    @GetMapping("/search-keywords")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "전체 주요 검색 키워드 조회", description = "내 동아리 유입 검색어가 아니라 전체 검색어 통계입니다.")
    public ResponseEntity<?> getSearchKeywords(
            @CurrentUser CustomUserDetails user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        clubStatisticsAdminService.validateClubManager(user.getClubId());
        return Response.ok(clubStatisticsAdminService.getSearchKeywords(from, to, limit));
    }
}
