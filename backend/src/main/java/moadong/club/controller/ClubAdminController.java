package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.payload.response.ClubListResponse;
import moadong.club.service.ClubProfileService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Tag(name = "Club Admin", description = "동아리 관리자 API (개발자 전용)")
public class ClubAdminController {

    private final ClubProfileService clubProfileService;

    @GetMapping("/clubs")
    @Operation(summary = "동아리 목록 조회", description = "전체 동아리 목록을 조회합니다. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getAllClubs() {
        ClubListResponse response = clubProfileService.getAllClubsForAdmin();
        return Response.ok(response);
    }

    @PutMapping("/club/{clubId}/info")
    @Operation(summary = "동아리 약력 수정 (관리자)", description = "지정한 clubId 동아리의 약력을 수정합니다. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateClubInfo(
            @CurrentUser CustomUserDetails user,
            @PathVariable String clubId,
            @RequestBody @Valid ClubInfoRequest request) {
        clubProfileService.updateClubInfoByClubId(clubId, request, user);
        return Response.ok("success update club info");
    }

    @PutMapping("/club/{clubId}/description")
    @Operation(summary = "동아리 모집정보 수정 (관리자)", description = "지정한 clubId 동아리의 모집정보를 수정합니다. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateClubDescription(
            @CurrentUser CustomUserDetails user,
            @PathVariable String clubId,
            @RequestBody ClubRecruitmentInfoUpdateRequest request) {
        clubProfileService.updateClubRecruitmentInfoByClubId(clubId, request, user);
        return Response.ok("success update club description");
    }
}
