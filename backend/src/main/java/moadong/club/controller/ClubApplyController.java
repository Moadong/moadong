package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.ClubApplicantDeleteRequest;
import moadong.club.payload.request.ClubApplicantEditRequest;
import moadong.club.payload.request.ClubApplicationFormCreateRequest;
import moadong.club.payload.request.ClubApplicationFormEditRequest;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.service.ClubApplyService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/club/{clubId}")
@AllArgsConstructor
@Tag(name = "Club_Apply", description = "클럽 지원서 API")
public class ClubApplyController {

    private final ClubApplyService clubApplyService;

    @PostMapping("/application")
    @Operation(summary = "클럽 지원서 양식 생성", description = "클럽 지원서 양식을 생성합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createClubApplicationForm(@PathVariable String clubId,
                                               @CurrentUser CustomUserDetails user,
                                               @RequestBody @Validated ClubApplicationFormCreateRequest request) {
        clubApplyService.createClubApplicationForm(clubId, user, request);
        return Response.ok("success create application");
    }

    @GetMapping("/apply")
    @Operation(summary = "클럽 지원서 양식들 불러오기", description = "클럽 지원서 양식들을 학기별로 분류하여 불러옵니다")
    public ResponseEntity<?> getClubApplications(@PathVariable String clubId,
                                                 @RequestParam(defaultValue = "agg") String mode) {  //agg면 aggregation사용, server면, 서비스에서 그룹 및 정렬
        if("server".equalsIgnoreCase(mode)) {
            return Response.ok(clubApplyService.getGroupedClubApplicationForms(clubId));
        }
        return Response.ok(clubApplyService.getClubApplicationForms(clubId));
    }

    @PutMapping("/application/{applicationFormId}")
    @Operation(summary = "클럽 지원서 양식 수정", description = "클럽 지원서 양식을 수정합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editClubApplicationForm(@PathVariable String clubId,
                                                     @PathVariable String applicationFormId,
                                                     @CurrentUser CustomUserDetails user,
                                                     @RequestBody @Validated ClubApplicationFormEditRequest request) {
        clubApplyService.editClubApplication(clubId, applicationFormId, user, request);
        return Response.ok("success edit application");
    }

    @GetMapping("/apply/{applicationFormId}")
    @Operation(summary = "클럽 지원서 양식 불러오기", description = "클럽 지원서 양식을 불러옵니다")
    public ResponseEntity<?> getClubApplication(@PathVariable String clubId,
                                                @PathVariable String applicationFormId) {
        return clubApplyService.getClubApplicationForm(clubId, applicationFormId);
    }

    @PostMapping("/apply/{applicationFormId}")
    @Operation(summary = "클럽 지원", description = "클럽에 지원합니다")
    public ResponseEntity<?>  applyToClub(@PathVariable String clubId,
                                          @PathVariable String applicationFormId,
                                          @RequestBody @Validated ClubApplyRequest request) {
        clubApplyService.applyToClub(clubId, applicationFormId, request);
        return Response.ok("success apply");
    }

    @GetMapping("/apply/info/{applicationFormId}")
    @Operation(summary = "클럽 지원자 현황", description = "클럽 지원자 현황을 불러옵니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getApplyInfo(@PathVariable String clubId,
                                          @PathVariable String applicationFormId,
                                          @CurrentUser CustomUserDetails user) {
        return Response.ok(clubApplyService.getClubApplyInfo(clubId, applicationFormId, user));
    }

    @PutMapping("/applicant/{applicationFormId}")
    @Operation(summary = "지원자의 지원서 정보 변경",
            description = "여러 지원자의 지원서 정보를 일괄 수정합니다.<br>"
                    + "요청 본문은 ClubApplicantEditRequest 객체의 배열이며, 각 원소는 applicantId, memo, status를 포함합니다."
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editApplicantDetail(@PathVariable String clubId,
                                                 @PathVariable String applicationFormId,
                                                 @RequestBody @Valid @NotEmpty List<ClubApplicantEditRequest> request,
                                                 @CurrentUser CustomUserDetails user) {
        clubApplyService.editApplicantDetail(clubId, applicationFormId, request, user);
        return Response.ok("success edit applicant");
    }

    @DeleteMapping("/applicant/{applicationFormId}")
    @Operation(summary = "지원자 삭제",
            description = "클럽 지원자의 지원서를 삭제합니다"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> removeApplicant(@PathVariable String clubId,
                                             @PathVariable String applicationFormId,
                                             @RequestBody @Validated ClubApplicantDeleteRequest request,
                                             @CurrentUser CustomUserDetails user) {
        clubApplyService.deleteApplicant(clubId,applicationFormId, request, user);
        return Response.ok("success delete applicant");
    }

}
