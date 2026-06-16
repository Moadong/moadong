package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.club.service.ClubClickService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/game")
@RequiredArgsConstructor
@Tag(name = "Game_Admin", description = "동아리 클릭 게임 관리자 API")
public class ClubClickAdminController {

    private final ClubClickService clubClickService;

    @PostMapping("/ranking/reset")
    @Operation(summary = "동아리 클릭 랭킹 초기화", description = "동아리 클릭 수를 전체 삭제하여 랭킹을 초기화합니다.")
    public ResponseEntity<?> resetRanking() {
        clubClickService.resetRanking();
        return Response.ok("동아리 클릭 랭킹이 초기화되었습니다");
    }
}
