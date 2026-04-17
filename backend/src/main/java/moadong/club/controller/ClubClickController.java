package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.club.payload.request.ClubClickRequest;
import moadong.club.payload.response.ClubClickRankingResponse;
import moadong.club.payload.response.ClubClickResponse;
import moadong.club.service.ClubClickService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "동아리 클릭 게임 통계")
public class ClubClickController {

    private final ClubClickService clubClickService;

    @PostMapping("/click")
    @Operation(summary = "동아리 클릭 기록", description = "실제 동아리 이름으로만 클릭 수를 누적합니다. IP당 1초 쿨다운이 적용됩니다.")
    public ResponseEntity<?> recordClick(@RequestBody ClubClickRequest request, HttpServletRequest httpRequest) {
        String clientIp = resolveClientIp(httpRequest);
        ClubClickResponse result = clubClickService.recordClick(request.clubName(), request.count(), clientIp);
        return Response.ok(result);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @GetMapping("/ranking")
    @Operation(summary = "동아리 클릭 랭킹 조회",
            description = "클릭 수 기준 내림차순 랭킹을 반환합니다. resetAt은 다음 자정(KST) 시간입니다.")
    public ResponseEntity<?> getRanking() {
        ClubClickRankingResponse result = clubClickService.getRanking();
        return Response.ok(result);
    }
}
