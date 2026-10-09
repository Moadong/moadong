package moadong.feedback.prompt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.payload.request.FeedbackPromptDismissRequest;
import moadong.feedback.prompt.payload.request.FeedbackPromptResponseCreateRequest;
import moadong.feedback.prompt.payload.response.FeedbackPromptEligibilityResponse;
import moadong.feedback.prompt.payload.response.FeedbackPromptResponseCreateResponse;
import moadong.feedback.prompt.service.FeedbackPromptEligibilityService;
import moadong.feedback.prompt.service.FeedbackPromptResponseService;
import moadong.global.payload.Response;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feedback-prompts")
@RequiredArgsConstructor
@Tag(name = "Feedback_Prompt", description = "행동 직후 피드백 API")
public class FeedbackPromptController {

    private final FeedbackPromptEligibilityService eligibilityService;
    private final FeedbackPromptResponseService responseService;

    @GetMapping("/eligibility")
    @Operation(summary = "피드백 노출 가능 여부", description = "특정 행동 직후 피드백창을 노출할 수 있는지 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getEligibility(
            @RequestParam FeedbackPromptTriggerType triggerType,
            @RequestParam(required = false) String clubId,
            @RequestParam(required = false) String anonymousClientId,
            @CurrentUser CustomUserDetails user
    ) {
        FeedbackPromptEligibilityResponse response =
                eligibilityService.getEligibility(triggerType, clubId, anonymousClientId, user);
        return Response.ok(response);
    }

    @PostMapping("/{promptId}/responses")
    @Operation(summary = "피드백 응답 제출", description = "행동 직후 피드백 응답을 저장합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createResponse(
            @PathVariable String promptId,
            @RequestBody @Valid FeedbackPromptResponseCreateRequest request,
            @CurrentUser CustomUserDetails user
    ) {
        FeedbackPromptResponseCreateResponse response = responseService.createResponse(promptId, request, user);
        return Response.ok("피드백이 저장되었습니다.", response);
    }

    @PostMapping("/{promptId}/dismiss")
    @Operation(summary = "피드백 닫기 저장", description = "피드백창을 닫은 이력을 저장해 재노출 정책에 반영합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> dismiss(
            @PathVariable String promptId,
            @RequestBody @Valid FeedbackPromptDismissRequest request,
            @CurrentUser CustomUserDetails user
    ) {
        responseService.dismiss(promptId, request, user);
        return Response.ok("ok");
    }
}
