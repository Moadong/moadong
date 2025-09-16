package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.*;
import moadong.club.service.ClubApplyService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/club/{clubId}")
@AllArgsConstructor
@Tag(name = "Club_Apply", description = "클럽 지원서 API")
public class ClubApplyController {

    private final ClubApplyService clubApplyService;

    @GetMapping("/semesters")
    @Operation(summary = "클럽 지원서 생성 가능 학기 불러오기", description = "생성 가능한 학기를 불러옵니다<br>"
    + "<br>"
    + "기준일로부터 이번 학기, 다음 학기, 다다음 학기를 불러옴<br>"
    + "ex) 2025/09/01 -> 2025-2학기, 2025-겨울학기, 2026-1학기")
    public ResponseEntity<?> getSemesterOption(@PathVariable String clubId,
                                                @RequestParam(value = "option", required = false, defaultValue = "3") int count) {
        return Response.ok(clubApplyService.getSemesterOption(clubId, count));
    }

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

    @GetMapping("/apply")
    @Operation(summary = "클럽 지원서들 불러오기", description = "클럽 지원서들을 학기 별로 분류하여 불러옵니다")
    public ResponseEntity<?> getClubApplications(@PathVariable String clubId,
                                                 @RequestParam(defaultValue = "agg") String mode) {
        if("server".equalsIgnoreCase(mode)) {
            return Response.ok(clubApplyService.getGroupedClubApplications(clubId));
        }
        return Response.ok(clubApplyService.getClubApplications(clubId));
    }

    @PutMapping("/application/{clubQuestionId}")
    @Operation(summary = "클럽 지원서 수정", description = "클럽 지원서를 수정합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editClubApplication(@PathVariable String clubId,
                                                 @PathVariable String clubQuestionId,
                                             @CurrentUser CustomUserDetails user,
                                             @RequestBody @Validated ClubApplicationEditRequest request) {
        clubApplyService.editClubApplication(clubId, clubQuestionId, user, request);
        return Response.ok("success edit application");
    }

    @GetMapping("/apply/{clubQuestionId}")
    @Operation(summary = "클럽 지원서 불러오기", description = "클럽 지원서를 불러옵니다")
    public ResponseEntity<?> getClubApplication(@PathVariable String clubId,
                                                @PathVariable String clubQuestionId) {
        return clubApplyService.getClubApplication(clubId, clubQuestionId);
    }

    @PostMapping("/apply/{clubQuestionId}")
    @Operation(summary = "클럽 지원", description = "클럽에 지원합니다")
    public ResponseEntity<?>  applyToClub(@PathVariable String clubId,
                                          @PathVariable String clubQuestionId,
                                          @RequestBody @Validated ClubApplyRequest request) {
        clubApplyService.applyToClub(clubId, clubQuestionId, request);
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

    @PutMapping("/applicant")
    @Operation(summary = "지원자의 지원서 정보 변경",
            description = "여러 지원자의 지원서 정보를 일괄 수정합니다.<br>"
                    + "요청 본문은 ClubApplicantEditRequest 객체의 배열이며, 각 원소는 applicantId, memo, status를 포함합니다."
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editApplicantDetail(@PathVariable String clubId,
                                                 @RequestBody @Valid @NotEmpty List<ClubApplicantEditRequest> request,
                                                 @CurrentUser CustomUserDetails user) {
        clubApplyService.editApplicantDetail(clubId, request, user);
        return Response.ok("success edit applicant");
    }

    @DeleteMapping("/applicant")
    @Operation(summary = "지원자 삭제",
            description = "클럽 지원자의 지원서를 삭제합니다"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> removeApplicant(@PathVariable String clubId,
                                             @RequestBody @Validated ClubApplicantDeleteRequest request,
                                             @CurrentUser CustomUserDetails user) {
        clubApplyService.deleteApplicant(clubId, request, user);
        return Response.ok("success delete applicant");
    }

}
