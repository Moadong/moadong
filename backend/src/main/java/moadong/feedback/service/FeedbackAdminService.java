package moadong.feedback.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.enums.FcmAction;
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
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackAdminService {

    private static final String REPLY_PUSH_TYPE = "FEEDBACK_REPLY";
    private static final String LETTER_PUSH_TYPE = "FEEDBACK_LETTER";
    /**
     * 웹뷰가 웹 주소 뒤에 그대로 이어붙이는 경로라 프론트 라우트({@code /feedback/letters/:letterId})와
     * 정확히 같아야 한다. 단수(letter)로 바꾸거나 {@code /webview} 접두사를 붙이면 매칭이 실패해 빈 화면이 뜬다.
     */
    private static final String LETTER_DETAIL_PATH_PREFIX = "/feedback/letters/";
    private static final int SENDER_ID_LENGTH = 8;

    private final FeedbackRepository feedbackRepository;
    private final LetterRepository letterRepository;
    private final StudentUserRepository studentUserRepository;
    private final PushNotificationPort pushNotificationPort;
    private final FcmAdminService fcmAdminService;
    private final TransactionTemplate transactionTemplate;

    public AdminFeedbackListResponse getFeedbacks() {
        List<AdminFeedbackResponse> feedbacks = feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(feedback -> AdminFeedbackResponse.of(feedback, anonymousSender(feedback.getStudentId())))
                .toList();

        return new AdminFeedbackListResponse(
                feedbacks,
                feedbackRepository.countByStatusNot(FeedbackStatus.REPLIED));
    }

    /**
     * 편지 저장과 상태 변경만 트랜잭션으로 묶고, 푸시는 커밋된 뒤에 보낸다.
     * 트랜잭션 안에서 보내면 커밋이 실패했을 때 존재하지 않는 답장의 알림이 나간다.
     */
    public FeedbackReplyResponse reply(String feedbackId, FeedbackReplyRequest request) {
        Letter letter = transactionTemplate.execute(status -> {
            Feedback feedback = feedbackRepository.findById(feedbackId)
                    .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_NOT_FOUND));

            if (feedback.getStatus() == FeedbackStatus.REPLIED) {
                throw new RestApiException(ErrorCode.FEEDBACK_ALREADY_REPLIED);
            }

            Letter saved = letterRepository.save(Letter.reply(
                    feedback.getStudentId(), feedback.getId(), request.title(), request.body()));

            feedback.markReplied(saved.getId());
            feedbackRepository.save(feedback);
            return saved;
        });

        boolean pushSent = request.sendPush()
                && sendReplyPush(letter.getRecipientStudentId(), letter);

        return new FeedbackReplyResponse(letter.getId(), pushSent);
    }

    /**
     * requestId가 같은 재시도는 편지를 다시 만들지 않고 처음 결과를 그대로 돌려준다.
     * 재시도로 전체 사용자에게 푸시가 두 번 나가는 것을 막는다.
     */
    public LetterCreateResponse createBroadcastLetter(LetterCreateRequest request) {
        if (request.category() == LetterCategory.REPLY) {
            throw new RestApiException(ErrorCode.LETTER_CATEGORY_NOT_BROADCASTABLE);
        }

        // 빈 문자열을 그대로 저장하면 sparse 인덱스가 걸러주지 못해, 다음 발행이 중복 키로 실패한다.
        String requestId = StringUtils.hasText(request.requestId()) ? request.requestId().trim() : null;

        if (requestId != null) {
            Optional<LetterCreateResponse> published = findPublished(requestId);
            if (published.isPresent()) {
                return published.get();
            }
        }

        Letter letter;
        try {
            letter = letterRepository.save(Letter.broadcast(
                    request.category(), request.title(), request.body(), requestId));
        } catch (DuplicateKeyException e) {
            if (requestId == null) {
                throw e;
            }
            // 동시 요청이 둘 다 조회를 통과한 경우. 유니크 인덱스가 중복 저장을 막았으니
            // 먼저 저장한 쪽 결과를 그대로 돌려준다. 이쪽은 푸시를 보내지 않는다.
            return findPublished(requestId).orElseThrow(() -> e);
        }

        if (!request.sendPush()) {
            return new LetterCreateResponse(letter.getId(), false, 0);
        }

        int successCount = sendBroadcastPush(letter);
        letter.recordPushResult(successCount);
        letterRepository.save(letter);

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
     * 이미 발행된 편지의 결과. 동시 요청에서 진 쪽은 이긴 쪽이 푸시를 마치기 전에 읽을 수 있어
     * pushSuccessCount가 0으로 보일 수 있다. 편지가 중복 발행되지 않는 것이 목적이라 그대로 둔다.
     */
    private Optional<LetterCreateResponse> findPublished(String requestId) {
        return letterRepository.findByIdempotencyKey(requestId)
                .map(letter -> {
                    log.info("Broadcast letter republish ignored. letter={}, requestId={}",
                            letter.getId(), requestId);
                    return new LetterCreateResponse(letter.getId(),
                            letter.getPushSuccessCount() > 0, letter.getPushSuccessCount());
                });
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
                    letterNavigationData(LETTER_PUSH_TYPE, letter)));
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
                    letterNavigationData(REPLY_PUSH_TYPE, letter)));
            return result.success();
        } catch (RuntimeException e) {
            log.error("Reply push failed. letter={}", letter.getId(), e);
            return false;
        }
    }

    /**
     * 푸시를 탭했을 때 편지 상세로 이동시키는 데이터. 앱은 action이 NAVIGATE_WEBVIEW인 경우에만
     * path를 웹뷰로 넘기므로, 둘 중 하나라도 빠지면 앱 홈만 열린다.
     */
    private Map<String, String> letterNavigationData(String pushType, Letter letter) {
        return Map.of(
                "type", pushType,
                "letterId", letter.getId(),
                "action", FcmAction.NAVIGATE_WEBVIEW.name(),
                "path", LETTER_DETAIL_PATH_PREFIX + letter.getId()
        );
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
