package moadong.feedback.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.feedback.enums.LetterCategory;
import moadong.feedback.payload.request.FeedbackCreateRequest;
import moadong.feedback.payload.response.FeedbackCreateResponse;
import moadong.feedback.payload.response.ReceivedLetterDetailResponse;
import moadong.feedback.payload.response.ReceivedLetterListResponse;
import moadong.feedback.payload.response.SentFeedbackListResponse;
import moadong.feedback.payload.response.SentFeedbackResponse;
import moadong.feedback.service.FeedbackImageService;
import moadong.feedback.service.FeedbackService;
import moadong.global.payload.Response;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import moadong.user.service.StudentJwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 모아동 우체통 사용자 API.
 * <p>
 * {@code /api/student} 는 {@code JwtAuthenticationFilter} 가 건너뛰는 경로라서,
 * 학생 토큰을 컨트롤러에서 직접 파싱한다. ({@code StudentFcmController} 와 같은 방식)
 */
@RestController
@RequestMapping("/api/student/feedback")
@RequiredArgsConstructor
@Tag(name = "Student Feedback", description = "모아동 우체통 사용자 API")
public class StudentFeedbackController {

    private final StudentJwtService studentJwtService;
    private final FeedbackService feedbackService;
    private final FeedbackImageService feedbackImageService;

    @PostMapping
    @Operation(summary = "피드백 보내기", description = "학생 토큰 sub(UUID) 기준으로 피드백을 저장합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createFeedback(
            @RequestHeader("Authorization") String authorization,
            @RequestBody @Valid FeedbackCreateRequest request
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        FeedbackCreateResponse response = feedbackService.createFeedback(studentId, request);
        return Response.ok("피드백이 전송되었습니다.", response);
    }

    @PostMapping("/images/upload-url")
    @Operation(summary = "첨부 사진 업로드 URL 발급",
            description = "R2에 직접 업로드할 presigned URL을 요청한 개수만큼 발급합니다. "
                    + "업로드 후 받은 finalUrl을 피드백 전송 시 images에 담아 보냅니다. "
                    + "4장을 넘게 요청하면 앞의 4건만 발급하고 마지막에 실패 항목이 붙습니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createImageUploadUrls(
            @RequestHeader("Authorization") String authorization,
            @RequestBody @Valid List<UploadUrlRequest> requests,
            HttpServletRequest httpServletRequest
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        List<PresignedUploadResponse> responses =
                feedbackImageService.createUploadUrls(studentId, requests, clientIp(httpServletRequest));
        return Response.ok(responses);
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @GetMapping("/received")
    @Operation(summary = "받은 편지 목록", description = "나에게 온 답장과 전체 발행 편지를 최신순으로 조회합니다. category는 선택입니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getReceivedLetters(
            @RequestHeader("Authorization") String authorization,
            @RequestParam(required = false) LetterCategory category
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        ReceivedLetterListResponse response = feedbackService.getReceivedLetters(studentId, category);
        return Response.ok(response);
    }

    @GetMapping("/received/{letterId}")
    @Operation(summary = "받은 편지 상세", description = "REPLY 편지면 원본 피드백(myFeedback)을 함께 내려줍니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getReceivedLetter(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String letterId
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        ReceivedLetterDetailResponse response = feedbackService.getReceivedLetter(studentId, letterId);
        return Response.ok(response);
    }

    @PatchMapping("/received/{letterId}/read")
    @Operation(summary = "받은 편지 읽음 처리", description = "해당 편지를 읽은 것으로 표시합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> markLetterRead(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String letterId
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        feedbackService.markLetterRead(studentId, letterId);
        return Response.ok("편지를 읽음 처리했습니다.", null);
    }

    @GetMapping("/sent")
    @Operation(summary = "보낸 편지 목록", description = "내가 보낸 피드백을 최신순으로 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getSentFeedbacks(
            @RequestHeader("Authorization") String authorization
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        SentFeedbackListResponse response = feedbackService.getSentFeedbacks(studentId);
        return Response.ok(response);
    }

    @GetMapping("/sent/{feedbackId}")
    @Operation(summary = "보낸 편지 상세", description = "내가 보낸 피드백 하나를 조회합니다.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getSentFeedback(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String feedbackId
    ) {
        String studentId = studentJwtService.extractStudentId(authorization);
        SentFeedbackResponse response = feedbackService.getSentFeedback(studentId, feedbackId);
        return Response.ok(response);
    }
}
