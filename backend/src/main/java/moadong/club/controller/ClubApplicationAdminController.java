package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.AdminExternalFormConnectRequest;
import moadong.club.payload.request.AiDraftQuotaGrantRequest;
import moadong.club.payload.request.ApplicationFormStatusUpdateRequest;
import moadong.club.service.AiApplicationDraftService;
import moadong.club.service.ClubApplyAdminService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Tag(name = "Club Application Admin", description = "동아리 지원폼 관리자 API (개발자 전용)")
public class ClubApplicationAdminController {

    private final ClubApplyAdminService clubApplyAdminService;
    private final AiApplicationDraftService aiApplicationDraftService;

    @GetMapping("/club/{clubId}/application")
    @Operation(summary = "동아리 지원폼 목록 조회 (관리자)", description = "DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getApplications(@PathVariable String clubId) {
        return Response.ok(clubApplyAdminService.getApplicationFormsForClub(clubId));
    }

    @PostMapping("/club/{clubId}/application")
    @Operation(summary = "동아리 외부 지원폼 연결 (관리자)",
            description = "구글폼/네이버폼 등 외부 URL을 지정 동아리에 연결하고 게시(ACTIVE)합니다. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> connectExternal(@PathVariable String clubId,
                                             @RequestBody @Valid AdminExternalFormConnectRequest request) {
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);
        return Response.ok("success connect external application form");
    }

    @PatchMapping("/club/{clubId}/application/{formId}/status")
    @Operation(summary = "동아리 지원폼 활성화/미게시 토글 (관리자)",
            description = "active=true면 게시(ACTIVE), false면 미게시. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateStatus(@PathVariable String clubId,
                                          @PathVariable String formId,
                                          @RequestBody @Valid ApplicationFormStatusUpdateRequest request) {
        clubApplyAdminService.setApplicationFormStatusForClub(clubId, formId, request.active());
        return Response.ok("success update application status");
    }

    @DeleteMapping("/club/{clubId}/application/{formId}")
    @Operation(summary = "동아리 지원폼 삭제 (관리자)", description = "DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteApplication(@PathVariable String clubId,
                                               @PathVariable String formId) {
        clubApplyAdminService.deleteApplicationFormForClub(clubId, formId);
        return Response.ok("success delete application");
    }

    @PostMapping("/club/{clubId}/ai-draft/quota/grant")
    @Operation(summary = "동아리 AI 초안 생성 횟수 추가 부여 (관리자)",
            description = "지정 동아리의 이번 달 AI 초안 생성 사용 횟수를 amount만큼 차감하여 그만큼 더 생성할 수 있게 합니다.<br>"
                    + "월 한도(3회) 자체는 변경하지 않으며 갱신된 quota를 반환합니다. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> grantAiDraftQuota(@PathVariable String clubId,
                                               @RequestBody @Valid AiDraftQuotaGrantRequest request) {
        return Response.ok(aiApplicationDraftService.grantQuota(clubId, request.amount()));
    }
}
