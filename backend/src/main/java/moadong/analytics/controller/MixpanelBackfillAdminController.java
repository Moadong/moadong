package moadong.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.analytics.payload.response.MixpanelBackfillResponse;
import moadong.analytics.service.MixpanelBackfillService;
import moadong.global.payload.Response;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/statistics/mixpanel")
@RequiredArgsConstructor
@Tag(name = "Statistics_Admin", description = "통계 개발자 API")
public class MixpanelBackfillAdminController {

    private final MixpanelBackfillService mixpanelBackfillService;

    @PostMapping("/backfill")
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Mixpanel 과거 통계 백필", description = "개발자 페이지에서만 사용하는 과거 통계 보정 API입니다.")
    public ResponseEntity<?> backfill(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        MixpanelBackfillResponse response = mixpanelBackfillService.backfill(from, to);
        return Response.ok(response);
    }
}
