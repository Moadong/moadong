package moadong.feedback.service;

import moadong.fcm.model.TokenPushPayload;
import moadong.fcm.model.TokenPushResult;
import moadong.fcm.payload.request.FcmAdminBatchSendRequest;
import moadong.fcm.payload.response.FcmAdminBatchSendResponse;
import moadong.fcm.port.PushNotificationPort;
import moadong.fcm.service.FcmAdminService;
import moadong.feedback.entity.Feedback;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.FeedbackStatus;
import moadong.feedback.enums.FeedbackType;
import moadong.feedback.enums.LetterCategory;
import moadong.feedback.payload.request.FeedbackReplyRequest;
import moadong.feedback.payload.request.FeedbackStatusUpdateRequest;
import moadong.feedback.payload.request.LetterCreateRequest;
import moadong.feedback.payload.response.AdminFeedbackListResponse;
import moadong.feedback.payload.response.AdminSentLetterListResponse;
import moadong.feedback.payload.response.FeedbackReplyResponse;
import moadong.feedback.payload.response.LetterCreateResponse;
import moadong.feedback.repository.FeedbackRepository;
import moadong.feedback.repository.LetterRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.StudentUser;
import moadong.user.repository.StudentUserRepository;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FeedbackAdminServiceTest {

    private static final String STUDENT_ID = "11111111-1111-1111-1111-111111111111";
    private static final String OTHER_STUDENT_ID = "22222222-2222-2222-2222-222222222222";

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private LetterRepository letterRepository;

    @Mock
    private StudentUserRepository studentUserRepository;

    @Mock
    private PushNotificationPort pushNotificationPort;

    @Mock
    private FcmAdminService fcmAdminService;

    @Mock
    private TransactionTemplate transactionTemplate;

    @InjectMocks
    private FeedbackAdminService feedbackAdminService;

    /** 답장 저장 구간을 트랜잭션 없이 그대로 실행시킨다. */
    private void givenTransactionRunsInline() {
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
    }

    @Test
    void 답장을_발행하면_REPLY_편지가_생기고_상태가_답장완료가_된다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", false));

        ArgumentCaptor<Letter> letterCaptor = ArgumentCaptor.forClass(Letter.class);
        verify(letterRepository).save(letterCaptor.capture());
        assertEquals(LetterCategory.REPLY, letterCaptor.getValue().getCategory());
        assertEquals(STUDENT_ID, letterCaptor.getValue().getRecipientStudentId());
        assertEquals("feedback-1", letterCaptor.getValue().getFeedbackId());

        ArgumentCaptor<Feedback> feedbackCaptor = ArgumentCaptor.forClass(Feedback.class);
        verify(feedbackRepository).save(feedbackCaptor.capture());
        assertEquals(FeedbackStatus.REPLIED, feedbackCaptor.getValue().getStatus());
        assertEquals("letter-1", feedbackCaptor.getValue().getReplyLetterId());

        assertEquals("letter-1", response.letterId());
        assertFalse(response.pushSent());
    }

    @Test
    void 서로_다른_학생은_서로_다른_보낸사람으로_표시된다() {
        when(feedbackRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(
                feedbackOf("feedback-1", STUDENT_ID),
                feedbackOf("feedback-2", OTHER_STUDENT_ID)));
        when(feedbackRepository.countByStatusNot(FeedbackStatus.REPLIED)).thenReturn(2L);

        AdminFeedbackListResponse response = feedbackAdminService.getFeedbacks();

        assertEquals("user_11111111", response.feedbacks().get(0).sender());
        assertNotEquals(response.feedbacks().get(0).sender(), response.feedbacks().get(1).sender());
        assertEquals(2L, response.unansweredCount());
    }

    @Test
    void 보낸_편지_목록은_답장의_받는_사람만_익명_식별자로_표시한다() {
        when(letterRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(
                Letter.reply(STUDENT_ID, "feedback-1", "답장 제목", "답장 본문"),
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "request-1")));

        AdminSentLetterListResponse response = feedbackAdminService.getSentLetters();

        assertEquals(2, response.letters().size());
        assertEquals("user_11111111", response.letters().get(0).recipient());
        assertEquals("feedback-1", response.letters().get(0).feedbackId());
        assertEquals("답장 본문", response.letters().get(0).body());
        assertNull(response.letters().get(1).recipient());
    }

    @Test
    void 이미_답장한_피드백에는_다시_답장할_수_없다() {
        Feedback replied = Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.BUG)
                .content("버그가 있어요")
                .status(FeedbackStatus.REPLIED)
                .build();
        givenTransactionRunsInline();
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(replied));

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", false)));

        assertEquals(ErrorCode.FEEDBACK_ALREADY_REPLIED, exception.getErrorCode());
        verify(letterRepository, never()).save(any());
    }

    @Test
    void FCM_토큰이_있으면_답장_푸시를_보낸다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");
        when(studentUserRepository.findByStudentId(STUDENT_ID)).thenReturn(Optional.of(StudentUser.builder()
                .studentId(STUDENT_ID)
                .currentFcmToken("fcm-token")
                .build()));
        when(pushNotificationPort.sendToToken(any())).thenReturn(new TokenPushResult(true, "message-1"));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true));

        ArgumentCaptor<TokenPushPayload> payloadCaptor = ArgumentCaptor.forClass(TokenPushPayload.class);
        verify(pushNotificationPort).sendToToken(payloadCaptor.capture());
        assertEquals("fcm-token", payloadCaptor.getValue().token());
        assertEquals("답장 제목", payloadCaptor.getValue().title());
        assertEquals("letter-1", payloadCaptor.getValue().data().get("letterId"));
        assertEquals("NAVIGATE_WEBVIEW", payloadCaptor.getValue().data().get("action"));
        assertEquals("/feedback/letters/letter-1", payloadCaptor.getValue().data().get("path"));
        assertTrue(response.pushSent());
    }

    @Test
    void FCM_토큰이_없으면_푸시를_건너뛰고_답장은_발행된다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");
        when(studentUserRepository.findByStudentId(STUDENT_ID)).thenReturn(Optional.empty());

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true));

        verify(pushNotificationPort, never()).sendToToken(any());
        assertEquals("letter-1", response.letterId());
        assertFalse(response.pushSent());
    }

    @Test
    void 푸시_발송이_실패해도_답장_발행은_유지된다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");
        when(studentUserRepository.findByStudentId(STUDENT_ID)).thenReturn(Optional.of(StudentUser.builder()
                .studentId(STUDENT_ID)
                .currentFcmToken("fcm-token")
                .build()));
        when(pushNotificationPort.sendToToken(any())).thenThrow(new IllegalStateException("firebase down"));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true));

        verify(feedbackRepository).save(any());
        assertEquals("letter-1", response.letterId());
        assertFalse(response.pushSent());
    }

    @Test
    void REPLY는_전체_발행할_수_없다() {
        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackAdminService.createBroadcastLetter(
                        new LetterCreateRequest(LetterCategory.REPLY, "제목", "본문", false, null)));

        assertEquals(ErrorCode.LETTER_CATEGORY_NOT_BROADCASTABLE, exception.getErrorCode());
        verify(letterRepository, never()).save(any());
    }

    @Test
    void 전체_발행_편지는_수신자가_비어있다() {
        givenSavedLetterId("letter-1");

        feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", false, null));

        ArgumentCaptor<Letter> letterCaptor = ArgumentCaptor.forClass(Letter.class);
        verify(letterRepository).save(letterCaptor.capture());
        assertTrue(letterCaptor.getValue().isBroadcast());
        verify(fcmAdminService, never()).sendToAll(any());
    }

    @Test
    void 전체_발행_시_푸시를_켜면_전체_토큰으로_발송한다() {
        givenSavedLetterId("letter-1");
        when(fcmAdminService.sendToAll(any()))
                .thenReturn(new FcmAdminBatchSendResponse(120, 1, 118, 2, List.of("bad-token")));

        LetterCreateResponse response = feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", true, null));

        ArgumentCaptor<FcmAdminBatchSendRequest> pushCaptor =
                ArgumentCaptor.forClass(FcmAdminBatchSendRequest.class);
        verify(fcmAdminService).sendToAll(pushCaptor.capture());
        assertEquals("제목", pushCaptor.getValue().title());
        assertEquals("letter-1", pushCaptor.getValue().data().get("letterId"));
        assertEquals("NAVIGATE_WEBVIEW", pushCaptor.getValue().data().get("action"));
        assertEquals("/feedback/letters/letter-1", pushCaptor.getValue().data().get("path"));
        assertTrue(response.pushSent());
        assertEquals(118, response.pushSuccessCount());
    }

    @Test
    void 전체_발행_푸시가_실패해도_편지는_남는다() {
        givenSavedLetterId("letter-1");
        when(fcmAdminService.sendToAll(any())).thenThrow(new IllegalStateException("firebase down"));

        LetterCreateResponse response = feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", true, null));

        verify(letterRepository, org.mockito.Mockito.atLeastOnce()).save(any());
        assertEquals("letter-1", response.letterId());
        assertFalse(response.pushSent());
        assertEquals(0, response.pushSuccessCount());
    }

    @Test
    void 같은_requestId로_다시_발행하면_편지도_푸시도_반복되지_않는다() {
        Letter published = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.UPDATE)
                .title("제목")
                .body("본문")
                .idempotencyKey("req-1")
                .pushSuccessCount(118)
                .build();
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.of(published));

        LetterCreateResponse response = feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", true, "req-1"));

        assertEquals("letter-1", response.letterId());
        assertEquals(118, response.pushSuccessCount());
        verify(letterRepository, never()).save(any());
        verify(fcmAdminService, never()).sendToAll(any());
    }

    @Test
    void 처음_발행할_때는_requestId를_편지에_남긴다() {
        givenSavedLetterId("letter-1");
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.empty());

        feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", false, "req-1"));

        ArgumentCaptor<Letter> captor = ArgumentCaptor.forClass(Letter.class);
        verify(letterRepository).save(captor.capture());
        assertEquals("req-1", captor.getValue().getIdempotencyKey());
    }

    @Test
    void 빈_requestId는_저장하지_않는다() {
        // 빈 문자열을 저장하면 sparse 유니크 인덱스가 걸러주지 못해 다음 발행이 중복 키로 실패한다.
        givenSavedLetterId("letter-1");

        feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", false, ""));
        feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", false, "   "));

        ArgumentCaptor<Letter> captor = ArgumentCaptor.forClass(Letter.class);
        verify(letterRepository, org.mockito.Mockito.times(2)).save(captor.capture());
        captor.getAllValues().forEach(letter -> assertNull(letter.getIdempotencyKey()));
        verify(letterRepository, never()).findByIdempotencyKey(any());
    }

    @Test
    void 동시_발행이_충돌하면_먼저_저장된_편지를_돌려준다() {
        Letter winner = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.UPDATE)
                .title("제목")
                .body("본문")
                .idempotencyKey("req-1")
                .pushSuccessCount(118)
                .build();
        when(letterRepository.findByIdempotencyKey("req-1"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(winner));
        when(letterRepository.save(any())).thenThrow(new DuplicateKeyException("duplicate idempotencyKey"));

        LetterCreateResponse response = feedbackAdminService.createBroadcastLetter(
                new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", true, "req-1"));

        assertEquals("letter-1", response.letterId());
        assertEquals(118, response.pushSuccessCount());
        verify(fcmAdminService, never()).sendToAll(any());
    }

    @Test
    void 상태를_확인_중으로_바꿀_수_있다() {
        givenWaitingFeedback();
        when(feedbackRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        feedbackAdminService.updateStatus("feedback-1",
                new FeedbackStatusUpdateRequest(FeedbackStatus.IN_PROGRESS));

        ArgumentCaptor<Feedback> captor = ArgumentCaptor.forClass(Feedback.class);
        verify(feedbackRepository).save(captor.capture());
        assertEquals(FeedbackStatus.IN_PROGRESS, captor.getValue().getStatus());
    }

    @Test
    void 답장_완료_상태는_직접_지정할_수_없다() {
        givenWaitingFeedback();

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.updateStatus(
                "feedback-1", new FeedbackStatusUpdateRequest(FeedbackStatus.REPLIED)));

        assertEquals(ErrorCode.FEEDBACK_STATUS_NOT_CHANGEABLE, exception.getErrorCode());
        verify(feedbackRepository, never()).save(any());
    }

    @Test
    void 이미_답장한_피드백의_상태는_되돌릴_수_없다() {
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.BUG)
                .content("버그가 있어요")
                .status(FeedbackStatus.REPLIED)
                .replyLetterId("letter-1")
                .build()));

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.updateStatus(
                "feedback-1", new FeedbackStatusUpdateRequest(FeedbackStatus.WAITING)));

        assertEquals(ErrorCode.FEEDBACK_STATUS_NOT_CHANGEABLE, exception.getErrorCode());
        verify(feedbackRepository, never()).save(any());
    }

    @Test
    void 없는_피드백의_상태는_변경할_수_없다() {
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.updateStatus(
                "feedback-1", new FeedbackStatusUpdateRequest(FeedbackStatus.IN_PROGRESS)));

        assertEquals(ErrorCode.FEEDBACK_NOT_FOUND, exception.getErrorCode());
    }

    private Feedback feedbackOf(String feedbackId, String studentId) {
        return Feedback.builder()
                .id(feedbackId)
                .studentId(studentId)
                .type(FeedbackType.CHEER)
                .content("응원합니다 항상 잘 쓰고 있어요")
                .status(FeedbackStatus.WAITING)
                .build();
    }

    private void givenWaitingFeedback() {
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.FEATURE)
                .content("즐겨찾기 알림이 있으면 좋겠어요")
                .status(FeedbackStatus.WAITING)
                .build()));
    }

    private void givenSavedLetterId(String letterId) {
        when(letterRepository.save(any())).thenAnswer(invocation -> {
            Letter letter = invocation.getArgument(0);
            return Letter.builder()
                    .id(letterId)
                    .category(letter.getCategory())
                    .recipientStudentId(letter.getRecipientStudentId())
                    .feedbackId(letter.getFeedbackId())
                    .title(letter.getTitle())
                    .body(letter.getBody())
                    .build();
        });
    }
}
