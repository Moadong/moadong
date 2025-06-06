package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.service.ClubSearchService;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/club")
@AllArgsConstructor
@Tag(name = "Club", description = "클럽 검색")
public class ClubSearchController {

    private final ClubSearchService clubSearchService;

    @GetMapping("/search/")
    @Operation(summary = "키워드에 맞는 클럽을 검색합니다.(모집,분과,종류에 따른 구분)",
        description = "모집,분과,종류에 필터링 이후 이름,태그,소개에 따라 검색합니다.<br>"
            + "<br>"
            + "keyword에 빈칸 입력 시 전체 검색<br>"
            + "recruitmentStatus, category, division에 all 입력 시 전체 검색<br>"
            + "<br>"
            + "keyword는 대소문자 구분 없이 자유롭게 검색"
            + "recruitmentStatus은 모집상태로 ALWAYS(상시모집), OPEN(모집중), CLOSED(모집마감), UPCOMING(모집예정)<br>"
            + "division은 분과로 중동<br>"
            + "category는 종류로 봉사, 종교, 취미교양, 학술, 운동, 공연, 기타<br>")
    public ResponseEntity<?> searchClubsByKeyword(
        @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
        @RequestParam(value = "recruitmentStatus", required = false, defaultValue = "all") String recruitmentStatus,
        @RequestParam(value = "division", required = false, defaultValue = "all") String division,
        @RequestParam(value = "category", required = false, defaultValue = "all") String category
    ) {
        try {
            ClubSearchResponse clubSearchResponse = clubSearchService.searchClubsByKeyword(
                keyword,
                recruitmentStatus,
                division,
                category
            );
            return Response.ok(clubSearchResponse);
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.CLUB_SEARCH_FAILED);
        }
    }
}
