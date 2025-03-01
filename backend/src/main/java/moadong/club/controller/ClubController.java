package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.ClubCreateRequest;
import moadong.club.payload.request.ClubUpdateRequest;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.service.ClubCommandService;
import moadong.club.service.ClubDetailedPageService;
import moadong.club.service.ClubMetricService;
import moadong.club.service.ClubSearchService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/club")
@AllArgsConstructor
@Tag(name = "Club", description = "클럽 API")
public class ClubController {

    private final ClubCommandService clubCommandService;
    private final ClubDetailedPageService clubDetailedPageService;
    private final ClubSearchService clubSearchService;
    private final ClubMetricService clubMetricService;

    @PostMapping("")
    @Operation(summary = "클럽 생성", description = "클럽을 생성합니다.")
    public ResponseEntity<?> createClub(@RequestBody ClubCreateRequest request) {
        String clubId = clubCommandService.createClub(request);
        return Response.ok("success create club", "clubId : " + clubId);
    }

    @PutMapping("")
    @Operation(summary = "클럽 수정", description = "클럽을 수정합니다.")
    public ResponseEntity<?> updateClub(@RequestBody ClubUpdateRequest request) {
        clubCommandService.updateClub(request);
        return Response.ok("success update club");
    }

    @GetMapping("/{clubId}")
    @Operation(summary = "클럽 상세 정보 조회", description = "클럽 상세 정보를 조회합니다.")
    public ResponseEntity<?> getClubDetailedPage(
        HttpServletRequest request,
        @PathVariable String clubId) {
        clubMetricService.patch(clubId, request.getRemoteAddr());
        ClubDetailedResponse clubDetailedPageResponse = clubDetailedPageService.getClubDetailedPage(clubId);
        return Response.ok(clubDetailedPageResponse);
    }

    @GetMapping("/search/")
    @Operation(summary = "키워드에 맞는 클럽을 검색합니다.(모집,분과,종류에 따른 구분)",
            description = "모집,분과,종류에 필터링 이후 이름,태그,소개에 따라 검색합니다.<br>"
                    + "keyword에 빈칸 입력 시 전체 검색<br>"
                    + "recruitmentStatus, classification, division에 all 입력 시 전체 검색<br>"
                    + "keyword는 대소문자 구분 없고 일부분만 들어가도 검색이 가능하나, 나머지는 정확히 똑같아야 함<br>")
    public ResponseEntity<?> searchClubsByKeyword(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
            @RequestParam(value = "recruitmentStatus", required = false, defaultValue = "all") String recruitmentStatus,
            @RequestParam(value = "classification", required = false, defaultValue = "all") String classification,
            @RequestParam(value = "division", required = false, defaultValue = "all") String division
    ){
        ClubSearchResponse clubSearchResponse = clubSearchService.searchClubsByKeyword(
                keyword,
                recruitmentStatus,
                division,
                classification
                );
        return Response.ok(clubSearchResponse);
    }
}
