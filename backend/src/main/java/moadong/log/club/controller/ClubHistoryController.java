package moadong.log.club.controller;

import lombok.RequiredArgsConstructor;
import moadong.log.club.payload.response.ClubHistoryResponse;
import moadong.log.club.service.ClubHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubHistoryController {
    private final ClubHistoryService clubHistoryService;

    @GetMapping("/{clubId}/histories")
    public ResponseEntity<List<ClubHistoryResponse>> getClubHistories(@PathVariable String clubId) {
        List<ClubHistoryResponse> histories = clubHistoryService.getClubHistories(clubId);
        return ResponseEntity.ok(histories);
    }
}
