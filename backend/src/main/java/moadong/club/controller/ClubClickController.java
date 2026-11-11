package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.club.payload.response.ClubClickRankingResponse;
import moadong.club.service.ClubClickService;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Tag(name = "Game", description = "동아리 클릭 게임 통계")
public class ClubClickController {

    private final ClubClickService clubClickService;

    @PostMapping("/click")
    @Operation(summary = "동아리 클릭 기록 (종료됨)", description = "클릭 이벤트가 종료되어 더 이상 클릭 수를 기록하지 않습니다.")
    public ResponseEntity<?> recordClick() {
        throw new RestApiException(ErrorCode.CLICK_GAME_ENDED);
    }

    @GetMapping("/ranking")
    @Operation(summary = "동아리 클릭 랭킹 조회",
            description = "클릭 수 기준 내림차순 랭킹을 반환합니다. resetAt은 다음 자정(KST) 시간입니다.")
    public ResponseEntity<?> getRanking() {
        ClubClickRankingResponse result = clubClickService.getRanking();
        return Response.ok(result);
    }
}
