package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.ClubApplicantEditRequest;
import moadong.club.payload.request.ClubApplicationCreateRequest;
import moadong.club.payload.request.ClubApplicationEditRequest;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.service.ClubApplyService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/club/{clubId}")
@AllArgsConstructor
@Tag(name = "Club_Apply", description = "클럽 지원서 API")
public class ClubApplyController {

    private final ClubApplyService clubApplyService;

    @PostMapping("/application")
    @Operation(summary = "클럽 지원서 생성", description = "클럽 지원서를 생성합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createClubApplication(@PathVariable String clubId,
                                               @CurrentUser CustomUserDetails user,
                                               @RequestBody @Validated ClubApplicationCreateRequest request) {
        clubApplyService.createClubApplication(clubId, user, request);
        return Response.ok("success create application");
    }

    @PutMapping("/application")
    @Operation(summary = "클럽 지원서 수정", description = "클럽 지원서를 수정합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editClubApplication(@PathVariable String clubId,
                                             @CurrentUser CustomUserDetails user,
                                             @RequestBody @Validated ClubApplicationEditRequest request) {
        clubApplyService.editClubApplication(clubId, user, request);
        return Response.ok("success edit application");
    }

    @GetMapping("/apply")
    @Operation(summary = "클럽 지원서 불러오기", description = "클럽 지원서를 불러옵니다")
    public ResponseEntity<?> getClubApplication(@PathVariable String clubId) {
        return clubApplyService.getClubApplication(clubId);
    }

    @PostMapping("/apply")
    @Operation(summary = "클럽 지원", description = "클럽에 지원합니다")
    public ResponseEntity<?>  applyToClub(@PathVariable String clubId,
                                          @RequestBody @Validated ClubApplyRequest request) {
        clubApplyService.applyToClub(clubId, request);
        return Response.ok("success apply");
    }

    @GetMapping("/apply/info")
    @Operation(summary = "클럽 지원자 현황", description = "클럽 지원자 현황을 불러옵니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getApplyInfo(@PathVariable String clubId,
                                          @CurrentUser CustomUserDetails user) {
        return Response.ok(clubApplyService.getClubApplyInfo(clubId, user));
    }

    @PutMapping("/apply/{appId}")
    @Operation(summary = "지원서 변경",
            description = "클럽 지원자의 지원서 정보를 수정합니다.<br>"
                    + "appId - 지원서 아이디"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editApplicantDetail(@PathVariable String clubId,
                                                 @PathVariable String appId,
                                                 @RequestBody @Validated ClubApplicantEditRequest request,
                                                 @CurrentUser CustomUserDetails user) {
        clubApplyService.editApplicantDetail(clubId, appId, request, user);
        return Response.ok("success edit applicant");
    }

    @DeleteMapping("/apply/{appId}")
    @Operation(summary = "지원서 삭제",
            description = "클럽 지원자의 지원서를 삭제합니다.<br>"
                    + "appId - 지원서 아이디"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> removeApplicant(@PathVariable String clubId,
                                             @PathVariable String appId,
                                             @CurrentUser CustomUserDetails user) {
        clubApplyService.deleteApplicant(clubId, appId, user);
        return Response.ok("success delete applicant");
    }

}
