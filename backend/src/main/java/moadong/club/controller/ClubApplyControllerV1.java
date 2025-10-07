package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.payload.request.ClubApplicantDeleteRequest;
import moadong.club.payload.request.ClubApplicantEditRequest;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.service.ClubApplyService;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
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
@Tag(name = "Club_Apply_V1",
        description = "클럽 지원서 수정 전 API <br>"
                + "구버전 호환을 위한 임시 API입니다. <br>"
                + "프론트에서 formId 기반 신규 규격으로 전환하기 전까지 clubId 기반 요청을 한시적으로 지원합니다. <br>"
                + "(clubId로 활성화된 최신 지원서 양식의 formId를 가져옴)")
public class ClubApplyControllerV1 {

    private final ClubApplyService clubApplyService;
    private final ClubApplicationFormsRepository clubApplicationFormsRepository;

    @GetMapping("/apply") //
    @Operation(summary = "클럽 지원서 양식 불러오기",
            description = "clubId를 기반으로 활성화된 최신 지원서를 반환합니다. <br>"
                    + "<br>v2 api : /api/club/{clubId}/apply/{applicationFormId}")
    public ResponseEntity<?> getClubApplication(@PathVariable String clubId) {

        return clubApplyService.getClubApplicationForm(clubId, convertClubIdToFormId(clubId));
    }

    @PostMapping("/apply")
    @Operation(summary = "클럽 지원", description = "clubId를 기반으로 활성화된 최신 지원서에 지원합니다. <br>"
                    + "<br>v2 api : /api/club/{clubId}/apply/{applicationFormId}")
    public ResponseEntity<?> applyToClub(@PathVariable String clubId,
                                         @RequestBody @Validated ClubApplyRequest request) {
        clubApplyService.applyToClub(clubId, convertClubIdToFormId(clubId), request);
        return Response.ok("success apply");
    }

    @GetMapping("/apply/info")
    @Operation(summary = "클럽 지원자 현황", description = "clubId를 기반으로 활성화된 최신 지원서의 지원자 현황을 불러옵니다 <br>"
                    + "<br>v2 api : /api/club/{clubId}/apply/info/{applicationFormId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getApplyInfo(@PathVariable String clubId,
                                          @CurrentUser CustomUserDetails user) {
        return Response.ok(clubApplyService.getClubApplyInfo(clubId, convertClubIdToFormId(clubId), user));
    }

    @PutMapping("/applicant")
    @Operation(summary = "지원자의 지원서 정보 변경",
            description = "여러 지원자의 지원서 정보를 일괄 수정합니다.<br>"
                    + "요청 본문은 ClubApplicantEditRequest 객체의 배열이며, 각 원소는 applicantId, memo, status를 포함합니다."
                    + "<br><br>v2 api : /api/club/{clubId}/applicant/{applicationFormId}"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> editApplicantDetail(@PathVariable String clubId,
                                                 @RequestBody @Valid @NotEmpty List<ClubApplicantEditRequest> request,
                                                 @CurrentUser CustomUserDetails user) {
        clubApplyService.editApplicantDetail(clubId, convertClubIdToFormId(clubId), request, user);
        return Response.ok("success edit applicant");
    }

    @DeleteMapping("/applicant")
    @Operation(summary = "지원자 삭제",
            description = "clubId를 기반으로 활성화된 최신 지원서의 지원자의 지원서를 삭제합니다. <br>"
                    + "<br>v2 api : /api/club/{clubId}/applicant/{applicationFormId}"
    )
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> removeApplicant(@PathVariable String clubId,
                                             @RequestBody @Validated ClubApplicantDeleteRequest request,
                                             @CurrentUser CustomUserDetails user) {
        clubApplyService.deleteApplicant(clubId,convertClubIdToFormId(clubId), request, user);
        return Response.ok("success delete applicant");
    }


    private String convertClubIdToFormId(String clubId) {
        return clubApplicationFormsRepository.findTopByClubIdAndStatusOrderByEditedAtDesc(clubId, ApplicationFormStatus.ACTIVE)
                .map(ClubApplicationForm::getId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));
    }
}
