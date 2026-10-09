package moadong.feedback.prompt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.payload.request.FeedbackPromptDefinitionRequest;
import moadong.feedback.prompt.payload.response.FeedbackPromptAdminDefinitionResponse;
import moadong.feedback.prompt.payload.response.FeedbackPromptDefinitionResponse;
import moadong.feedback.prompt.payload.response.FeedbackPromptListResponse;
import moadong.feedback.prompt.service.FeedbackPromptDefinitionAdminService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/feedback-prompts")
@RequiredArgsConstructor
@Tag(name = "Feedback_Prompt_Admin", description = "행동 직후 피드백 프롬프트 개발자 API")
@SecurityRequirement(name = "BearerAuth")
public class FeedbackPromptAdminController {

    private final FeedbackPromptDefinitionAdminService definitionAdminService;

    @GetMapping
    @Operation(summary = "피드백 프롬프트 목록", description = "개발자 포털에서 문항 설정 목록을 조회합니다.")
    public ResponseEntity<?> getPrompts() {
        FeedbackPromptListResponse response = definitionAdminService.getPrompts();
        return Response.ok(response);
    }

    @GetMapping("/{promptId}")
    @Operation(summary = "피드백 프롬프트 상세", description = "비활성 선택지를 포함한 문항 설정 상세를 조회합니다.")
    public ResponseEntity<?> getPrompt(@PathVariable String promptId) {
        FeedbackPromptAdminDefinitionResponse response = definitionAdminService.getPrompt(promptId);
        return Response.ok(response);
    }

    @PostMapping
    @Operation(summary = "피드백 프롬프트 생성", description = "새 행동 직후 피드백 프롬프트를 생성합니다.")
    public ResponseEntity<?> createPrompt(@RequestBody @Valid FeedbackPromptDefinitionRequest request) {
        FeedbackPromptDefinitionResponse response = definitionAdminService.createPrompt(request);
        return Response.ok("피드백 프롬프트가 생성되었습니다.", response);
    }

    @PutMapping("/{promptId}")
    @Operation(summary = "피드백 프롬프트 수정", description = "문항, 선택지, 배치 순서, 재노출 정책을 수정합니다.")
    public ResponseEntity<?> updatePrompt(
            @PathVariable String promptId,
            @RequestBody @Valid FeedbackPromptDefinitionRequest request
    ) {
        FeedbackPromptDefinitionResponse response = definitionAdminService.updatePrompt(promptId, request);
        return Response.ok("피드백 프롬프트가 수정되었습니다.", response);
    }
}
