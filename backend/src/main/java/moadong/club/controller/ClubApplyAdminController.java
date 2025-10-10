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
import moadong.club.service.ClubApplyAdminService;
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
@RequestMapping("/api/club")
@AllArgsConstructor
@Tag(name = "Club_Apply_Admin", description = "클럽 지원서 관리자 API")
public class ClubApplyAdminController {

    private final ClubApplyAdminService clubApplyAdminService;

    @PostMapping("/application")
    @Operation(summary = "클럽 지원서 양식 생성", description = "클럽 지원서 양식을 생성합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createClubApplicationForm(@CurrentUser CustomUserDetails user,
                                               @RequestBody @Validated ClubApplicationFormCreateRequest request) {
        clubApplyAdminService.createClubApplicationForm(user, request);
        return Response.ok("success create application");
    }

    @PutMapping("/application/{applicationFormId}")
    @Operation(summary = "클럽 지원서 양식 수정", description = "클럽 지원서 양식을 수정합니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editClubApplicationForm(@PathVariable String applicationFormId,
                                                     @CurrentUser CustomUserDetails user,
                                                     @RequestBody @Validated ClubApplicationFormEditRequest request) {
        clubApplyAdminService.editClubApplication(applicationFormId, user, request);
        return Response.ok("success edit application");
    }

    @GetMapping("/application")
    @Operation(summary = "클럽의 모든 지원서 양식 목록 불러오기", description = "클럽의 모든 지원서 양식들을 학기별로 분류하여 불러옵니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getClubApplications(@CurrentUser CustomUserDetails user,
                                                 @RequestParam(defaultValue = "agg") String mode) {  //agg면 aggregation사용, server면, 서비스에서 그룹 및 정렬
        if("server".equalsIgnoreCase(mode)) {
            return Response.ok(clubApplyAdminService.getGroupedClubApplicationForms(user));
        }
        return Response.ok(clubApplyAdminService.getClubApplicationForms(user));
    }

    @GetMapping("/apply/info/{applicationFormId}")
    @Operation(summary = "클럽 지원자 현황", description = "클럽 지원자 현황을 불러옵니다")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getApplyInfo(@PathVariable String applicationFormId,
                                          @CurrentUser CustomUserDetails user) {
        return Response.ok(clubApplyAdminService.getClubApplyInfo(applicationFormId, user));
    }

    @PutMapping("/applicant/{applicationFormId}")
    @Operation(summary = "지원자의 지원서 정보 변경",
            description = "여러 지원자의 지원서 정보를 일괄 수정합니다.<br>"
                    + "요청 본문은 ClubApplicantEditRequest 객체의 배열이며, 각 원소는 applicantId, memo, status를 포함합니다."
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editApplicantDetail(@PathVariable String applicationFormId,
                                                 @RequestBody @Valid @NotEmpty List<ClubApplicantEditRequest> request,
                                                 @CurrentUser CustomUserDetails user) {
        clubApplyAdminService.editApplicantDetail(applicationFormId, request, user);
        return Response.ok("success edit applicant");
    }

    @DeleteMapping("/applicant/{applicationFormId}")
    @Operation(summary = "지원자 삭제",
            description = "클럽 지원자의 지원서를 삭제합니다"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> removeApplicant(@PathVariable String applicationFormId,
                                             @RequestBody @Validated ClubApplicantDeleteRequest request,
                                             @CurrentUser CustomUserDetails user) {
        clubApplyAdminService.deleteApplicant(applicationFormId, request, user);
        return Response.ok("success delete applicant");
    }

}
