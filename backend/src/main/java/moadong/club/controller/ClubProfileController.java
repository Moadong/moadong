package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.payload.response.ClubDetailedResponse;
import moadong.club.service.ClubProfileService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/club")
@AllArgsConstructor
@Tag(name = "Club", description = "클럽 API")
public class ClubProfileController {

    private final ClubProfileService clubProfileService;

    @GetMapping("/{clubId}")
    @Operation(summary = "클럽 상세 정보 조회", description = "클럽 상세 정보를 조회합니다.")
    public ResponseEntity<?> getClubDetail(@PathVariable String clubId) {
        ClubDetailedResponse clubDetailedPageResponse = clubProfileService.getClubDetail(clubId);
        return Response.ok(clubDetailedPageResponse);
    }

    @PutMapping("/info")
    @Operation(summary = "클럽 약력 수정", description = "클럽 약력을 수정합니다.<br>"
        + "tags는 최대 2개, 5글자 이내로 입력해야 합니다.<br>"
        + "introduction은 24글자 이내로 입력해야 합니다.")
    @PreAuthorize("isAuthenticated()")  // 인증 필요
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateClubInfo(
        @CurrentUser CustomUserDetails user,
        @RequestBody @Validated ClubInfoRequest request) {
        clubProfileService.updateClubInfo(request, user);
        return Response.ok("success update club");
    }

    @PutMapping("/description")
    @Operation(summary = "클럽 모집정보 수정", description = "클럽의 모집정보 내용을 수정합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateClubRecruitmentInfo(
        @CurrentUser CustomUserDetails user,
        @RequestBody ClubRecruitmentInfoUpdateRequest request) {
        clubProfileService.updateClubRecruitmentInfo(request, user);
        return Response.ok("success update club");
    }
}
