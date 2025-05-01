package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import moadong.club.service.ClubMetricService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/club/metric")
@AllArgsConstructor
@Tag(name = "Club_Metric", description = "클럽 통계 API")
public class ClubMetricController {

    private final ClubMetricService clubMetricService;

    @GetMapping("/{clubId}/daily")
    @Operation(summary = "클럽 일간 통계 조회", description = "클럽 일간 통계를 조회합니다.<br>"
        + "오늘부터 30일이내의 통계를 순서대로 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getDailyActiveUserWitClub(@PathVariable String clubId) {
        int[] metric = clubMetricService.getDailyActiveUserWitClub(clubId);
        return Response.ok(metric);
    }

    @GetMapping("/{clubId}/weekly")
    @Operation(summary = "클럽 주간 통계 조회", description = "클럽 주간 통계를 조회합니다.<br>"
        + "현재주부터 12주전까지의 통계를 순서대로 조회합니다.<br>")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getWeeklyActiveUserWitClub(@PathVariable String clubId) {
        int[] metric = clubMetricService.getWeeklyActiveUserWitClub(clubId);
        return Response.ok(metric);
    }

    @GetMapping("/{clubId}/monthly")
    @Operation(summary = "클럽 월간 통계 조회", description = "클럽 월간 통계를 조회합니다.<br>"
        + "현재월부터 12개월전까지의 통계를 순서대로 조회합니다.<br>")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getMonthlyActiveUserWitClub(@PathVariable String clubId) {
        int[] metric = clubMetricService.getMonthlyActiveUserWitClub(clubId);
        return Response.ok(metric);
    }

    @GetMapping("/ranking")
    @Operation(summary = "동아리 조회순 조회", description = "당일 기준으로 동아리 상세페이지가 많이 조회된 동아리들을 순서대로 n개 조회합니다.<br>")
    public ResponseEntity<?> getClubDailyRanking(@RequestParam int n) {
        List<String> clubs = clubMetricService.getDailyRanking(n);
        return Response.ok(clubs);
    }

    @GetMapping("/dau")
    @Operation(summary = "일일 활성 사용자수 조회", description = "당일부터 n일 이내의 일일 활성 사용자수를 순서대로 조회합니다.<br>"
        + "ip가 중복된 경우 1로 카운트합니다.<br>"
        + "동아리 상세페이지를 조회한 기록을 활용합니다.")
    public ResponseEntity<?> getDailyActiveUser(@RequestParam int n) {
        int[] daus = clubMetricService.getDailyActiveUser(n);
        return Response.ok(daus);
    }

}
