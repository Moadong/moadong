package moadong.feedback.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.feedback.payload.request.FeedbackReplyRequest;
import moadong.feedback.payload.request.FeedbackStatusUpdateRequest;
import moadong.feedback.payload.request.LetterCreateRequest;
import moadong.feedback.payload.request.LetterDraftRequest;
import moadong.feedback.payload.response.AdminFeedbackListResponse;
import moadong.feedback.payload.response.FeedbackReplyResponse;
import moadong.feedback.payload.response.LetterCreateResponse;
import moadong.feedback.payload.response.LetterDraftListResponse;
import moadong.feedback.payload.response.LetterDraftResponse;
import moadong.feedback.payload.response.LetterImageUploadResponse;
import moadong.feedback.service.FeedbackAdminService;
import moadong.feedback.service.LetterDraftService;
import moadong.feedback.service.LetterImageUploadService;
import moadong.global.payload.Response;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 개발자 포털용 우체통 운영 API.
 * <p>
 * 피드백은 사용자가 쓴 개인적인 의견이므로 반드시 {@code /api/admin} 아래에 두어야 한다.
 * {@code SecurityConfig} 가 이 경로만 ROLE_DEVELOPER로 막고 나머지는 permitAll 이다.
 */
@RestController
@RequestMapping("/api/admin/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback_Admin", description = "모아동 우체통 운영 API")
public class FeedbackAdminController {

    private final FeedbackAdminService feedbackAdminService;
    private final LetterDraftService letterDraftService;
    private final LetterImageUploadService letterImageUploadService;

    @GetMapping
    @Operation(summary = "받은 피드백 목록", description = "전체 피드백을 최신순으로 조회하고 미답변 개수를 함께 내려줍니다.")
    public ResponseEntity<?> getFeedbacks() {
        AdminFeedbackListResponse response = feedbackAdminService.getFeedbacks();
        return Response.ok(response);
    }

    @PostMapping("/{feedbackId}/reply")
    @Operation(summary = "답장 발행", description = "해당 피드백을 보낸 사용자의 받은 편지함에 REPLY 편지를 생성하고 상태를 답장 완료로 바꿉니다.")
    public ResponseEntity<?> reply(
            @PathVariable String feedbackId,
            @RequestBody @Valid FeedbackReplyRequest request
    ) {
        FeedbackReplyResponse response = feedbackAdminService.reply(feedbackId, request);
        return Response.ok("답장이 발행되었습니다.", response);
    }

    @PostMapping("/letters")
    @Operation(summary = "새 편지 발행", description = "UPDATE / STORY 편지를 전체 사용자에게 발행합니다.")
    public ResponseEntity<?> createLetter(@RequestBody @Valid LetterCreateRequest request) {
        LetterCreateResponse response = feedbackAdminService.createBroadcastLetter(request);
        return Response.ok("편지가 발행되었습니다.", response);
    }

    @PostMapping(value = "/letters/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "편지 본문 이미지 업로드",
            description = "이미지를 R2에 업로드하고 URL을 반환합니다. 반환된 URL을 본문에 마크다운 이미지로 삽입해 사용합니다.")
    public ResponseEntity<?> uploadLetterImage(@RequestPart("file") MultipartFile file) {
        LetterImageUploadResponse response = letterImageUploadService.upload(file);
        return Response.ok("이미지가 업로드되었습니다.", response);
    }

    @PostMapping("/letters/drafts")
    @Operation(summary = "편지 초안 저장", description = "발행하지 않은 편지를 임시저장합니다. 제목·본문이 비어 있어도 저장됩니다.")
    public ResponseEntity<?> createDraft(@RequestBody LetterDraftRequest request) {
        LetterDraftResponse response = letterDraftService.createDraft(request);
        return Response.ok("임시저장되었습니다.", response);
    }

    @GetMapping("/letters/drafts")
    @Operation(summary = "편지 초안 목록", description = "임시저장한 편지를 최근 수정순으로 조회합니다.")
    public ResponseEntity<?> getDrafts() {
        LetterDraftListResponse response = letterDraftService.getDrafts();
        return Response.ok(response);
    }

    @PutMapping("/letters/drafts/{draftId}")
    @Operation(summary = "편지 초안 이어쓰기", description = "임시저장한 편지를 덮어씁니다.")
    public ResponseEntity<?> updateDraft(
            @PathVariable String draftId,
            @RequestBody LetterDraftRequest request
    ) {
        LetterDraftResponse response = letterDraftService.updateDraft(draftId, request);
        return Response.ok("임시저장되었습니다.", response);
    }

    @DeleteMapping("/letters/drafts/{draftId}")
    @Operation(summary = "편지 초안 삭제", description = "발행 완료 후 또는 작성을 취소할 때 초안을 지웁니다.")
    public ResponseEntity<?> deleteDraft(@PathVariable String draftId) {
        letterDraftService.deleteDraft(draftId);
        return Response.ok("초안이 삭제되었습니다.", null);
    }

    @PatchMapping("/{feedbackId}/status")
    @Operation(summary = "피드백 상태 변경", description = "답장 대기(WAITING) / 확인 중(IN_PROGRESS) / 답장 완료(REPLIED) 사이를 전환합니다.")
    public ResponseEntity<?> updateStatus(
            @PathVariable String feedbackId,
            @RequestBody @Valid FeedbackStatusUpdateRequest request
    ) {
        feedbackAdminService.updateStatus(feedbackId, request);
        return Response.ok("상태가 변경되었습니다.", null);
    }
}
