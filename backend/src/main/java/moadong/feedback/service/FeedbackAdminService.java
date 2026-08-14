package moadong.feedback.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.model.TokenPushPayload;
import moadong.fcm.model.TokenPushResult;
import moadong.fcm.payload.request.FcmAdminBatchSendRequest;
import moadong.fcm.payload.response.FcmAdminBatchSendResponse;
import moadong.fcm.port.PushNotificationPort;
import moadong.fcm.service.FcmAdminService;
import moadong.feedback.entity.Feedback;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.FeedbackStatus;
import moadong.feedback.enums.LetterCategory;
import moadong.feedback.payload.request.FeedbackReplyRequest;
import moadong.feedback.payload.request.FeedbackStatusUpdateRequest;
import moadong.feedback.payload.request.LetterCreateRequest;
import moadong.feedback.payload.response.AdminFeedbackListResponse;
import moadong.feedback.payload.response.AdminFeedbackResponse;
import moadong.feedback.payload.response.FeedbackReplyResponse;
import moadong.feedback.payload.response.LetterCreateResponse;
import moadong.feedback.repository.FeedbackRepository;
import moadong.feedback.repository.LetterRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.repository.StudentUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackAdminService {

    private static final String REPLY_PUSH_TYPE = "FEEDBACK_REPLY";
    private static final String LETTER_PUSH_TYPE = "FEEDBACK_LETTER";
    private static final int SENDER_ID_LENGTH = 8;

    private final FeedbackRepository feedbackRepository;
    private final LetterRepository letterRepository;
    private final StudentUserRepository studentUserRepository;
    private final PushNotificationPort pushNotificationPort;
    private final FcmAdminService fcmAdminService;

    public AdminFeedbackListResponse getFeedbacks() {
        List<AdminFeedbackResponse> feedbacks = feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(feedback -> AdminFeedbackResponse.of(feedback, anonymousSender(feedback.getStudentId())))
                .toList();

        return new AdminFeedbackListResponse(
                feedbacks,
                feedbackRepository.countByStatusNot(FeedbackStatus.REPLIED));
    }

    @Transactional
    public FeedbackReplyResponse reply(String feedbackId, FeedbackReplyRequest request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_NOT_FOUND));

        if (feedback.getStatus() == FeedbackStatus.REPLIED) {
            throw new RestApiException(ErrorCode.FEEDBACK_ALREADY_REPLIED);
        }

        Letter letter = letterRepository.save(Letter.reply(
                feedback.getStudentId(), feedback.getId(), request.title(), request.body()));

        feedback.markReplied(letter.getId());
        feedbackRepository.save(feedback);

        boolean pushSent = request.sendPush()
                && sendReplyPush(feedback.getStudentId(), letter);

        return new FeedbackReplyResponse(letter.getId(), pushSent);
    }

    public LetterCreateResponse createBroadcastLetter(LetterCreateRequest request) {
        if (request.category() == LetterCategory.REPLY) {
            throw new RestApiException(ErrorCode.LETTER_CATEGORY_NOT_BROADCASTABLE);
        }

        Letter letter = letterRepository.save(
                Letter.broadcast(request.category(), request.title(), request.body()));

        if (!request.sendPush()) {
            return new LetterCreateResponse(letter.getId(), false, 0);
        }

        int successCount = sendBroadcastPush(letter);
        return new LetterCreateResponse(letter.getId(), successCount > 0, successCount);
    }

    /**
     * 답장 대기 · 확인 중 사이 전환만 허용한다. REPLIED는 답장 편지와 함께 설정돼야 하므로
     * 직접 지정할 수도, 이미 답장한 피드백을 되돌릴 수도 없다.
     */
    public void updateStatus(String feedbackId, FeedbackStatusUpdateRequest request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_NOT_FOUND));

        if (request.status() == FeedbackStatus.REPLIED || feedback.getStatus() == FeedbackStatus.REPLIED) {
            throw new RestApiException(ErrorCode.FEEDBACK_STATUS_NOT_CHANGEABLE);
        }

        feedback.changeStatus(request.status());
        feedbackRepository.save(feedback);
    }

    /**
     * 전체 발행 편지 푸시. 대상 토큰 수집과 배치 발송은 기존 FCM 관리자 경로를 그대로 쓴다.
     * 답장 푸시와 마찬가지로 실패가 편지 발행을 되돌리지는 않는다.
     */
    private int sendBroadcastPush(Letter letter) {
        try {
            FcmAdminBatchSendResponse result = fcmAdminService.sendToAll(new FcmAdminBatchSendRequest(
                    letter.getTitle(),
                    letter.preview(),
                    Map.of("type", LETTER_PUSH_TYPE, "letterId", letter.getId())));
            if (result.failureCount() > 0) {
                log.warn("Broadcast push partially failed. letter={}, success={}, failure={}",
                        letter.getId(), result.successCount(), result.failureCount());
            }
            return result.successCount();
        } catch (RuntimeException e) {
            log.error("Broadcast push failed. letter={}", letter.getId(), e);
            return 0;
        }
    }

    /**
     * 푸시 실패가 답장 발행을 되돌리면 안 되므로 실패는 로그만 남기고 false를 반환한다.
     */
    private boolean sendReplyPush(String studentId, Letter letter) {
        String fcmToken = studentUserRepository.findByStudentId(studentId)
                .map(student -> student.getCurrentFcmToken())
                .orElse(null);

        if (!StringUtils.hasText(fcmToken)) {
            log.info("Reply push skipped. no fcm token for feedback letter={}", letter.getId());
            return false;
        }

        try {
            TokenPushResult result = pushNotificationPort.sendToToken(new TokenPushPayload(
                    fcmToken,
                    letter.getTitle(),
                    letter.preview(),
                    Map.of("type", REPLY_PUSH_TYPE, "letterId", letter.getId())));
            return result.success();
        } catch (RuntimeException e) {
            log.error("Reply push failed. letter={}", letter.getId(), e);
            return false;
        }
    }

    /**
     * 학생 UUID 전체를 노출하지 않기 위한 표시용 식별자. 같은 학생은 항상 같은 값이 된다.
     * <p>
     * UUIDv4의 앞 8자리(32비트 난수)를 쓴다. 짧은 해시로 줄이면 서로 다른 학생이 같은 값으로 보여
     * 운영자가 동일인의 반복 제보로 오해할 수 있다.
     */
    private String anonymousSender(String studentId) {
        if (studentId == null || studentId.length() < SENDER_ID_LENGTH) {
            return "user_unknown";
        }
        return "user_" + studentId.substring(0, SENDER_ID_LENGTH);
    }
}
