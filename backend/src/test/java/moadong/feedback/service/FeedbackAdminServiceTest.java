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
import moadong.feedback.payload.request.LetterUpdateRequest;
import moadong.feedback.payload.response.AdminFeedbackListResponse;
import moadong.feedback.payload.response.AdminSentLetterListResponse;
import moadong.feedback.payload.response.AdminSentLetterResponse;
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
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", false, "req-1", null));

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
                Letter.reply(STUDENT_ID, "feedback-1", "답장 제목", "답장 본문", null),
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "request-1")));

        AdminSentLetterListResponse response = feedbackAdminService.getSentLetters();

        assertEquals(2, response.letters().size());
        assertEquals("user_11111111", response.letters().get(0).recipient());
        assertEquals("feedback-1", response.letters().get(0).feedbackId());
        assertEquals("답장 본문", response.letters().get(0).body());
        assertNull(response.letters().get(1).recipient());
    }

    @Test
    void 이미_답장한_피드백에도_답장을_더_보낼_수_있다() {
        Feedback replied = Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.BUG)
                .content("버그가 있어요")
                .status(FeedbackStatus.REPLIED)
                .replyLetterId("letter-1")
                .build();
        givenTransactionRunsInline();
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(replied));
        givenSavedLetterId("letter-2");

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("추가 답장", "추가 본문", false, "req-1", "letter-1"));

        ArgumentCaptor<Letter> letterCaptor = ArgumentCaptor.forClass(Letter.class);
        verify(letterRepository).save(letterCaptor.capture());
        assertEquals(STUDENT_ID, letterCaptor.getValue().getRecipientStudentId());
        assertEquals("feedback-1", letterCaptor.getValue().getFeedbackId());

        ArgumentCaptor<Feedback> feedbackCaptor = ArgumentCaptor.forClass(Feedback.class);
        verify(feedbackRepository).save(feedbackCaptor.capture());
        assertEquals(FeedbackStatus.REPLIED, feedbackCaptor.getValue().getStatus());
        assertEquals("letter-2", feedbackCaptor.getValue().getReplyLetterId());
        assertEquals("letter-2", response.letterId());
    }

    @Test
    void 대기_중으로_보고_답장했는데_그_사이_답장이_나갔으면_409로_거절한다() {
        givenTransactionRunsInline();
        givenRepliedFeedback("letter-1");

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-2", null)));

        assertEquals(ErrorCode.FEEDBACK_REPLY_OUTDATED, exception.getErrorCode());
        verify(letterRepository, never()).save(any());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 조회_뒤에_같은_키의_첫_요청이_커밋되면_OUTDATED_대신_처음_결과를_돌려준다() {
        Letter committed = Letter.reply(STUDENT_ID, "feedback-1", "답장 제목", "답장 본문", "req-1");
        givenTransactionRunsInline();
        givenRepliedFeedback("letter-1");
        when(letterRepository.findByIdempotencyKey("req-1"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(Letter.builder()
                        .id("letter-1")
                        .category(committed.getCategory())
                        .recipientStudentId(committed.getRecipientStudentId())
                        .feedbackId(committed.getFeedbackId())
                        .idempotencyKey("req-1")
                        .pushSuccessCount(1)
                        .build()));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        assertEquals("letter-1", response.letterId());
        assertTrue(response.pushSent());
        verify(letterRepository, never()).save(any());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 화면에서_본_마지막_답장보다_새_답장이_있으면_409로_거절한다() {
        givenTransactionRunsInline();
        givenRepliedFeedback("letter-2");

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", false, "req-3", "letter-1")));

        assertEquals(ErrorCode.FEEDBACK_REPLY_OUTDATED, exception.getErrorCode());
        verify(letterRepository, never()).save(any());
    }

    @Test
    void 같은_requestId로_다시_답장하면_편지도_푸시도_반복되지_않는다() {
        Letter published = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .recipientStudentId(STUDENT_ID)
                .feedbackId("feedback-1")
                .title("답장 제목")
                .body("답장 본문")
                .idempotencyKey("req-1")
                .pushSuccessCount(1)
                .build();
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.of(published));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        assertEquals("letter-1", response.letterId());
        assertTrue(response.pushSent());
        verify(letterRepository, never()).save(any());
        verify(feedbackRepository, never()).save(any());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 처음_답장할_때는_requestId를_편지에_남긴다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.empty());

        feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", false, " req-1 ", null));

        ArgumentCaptor<Letter> captor = ArgumentCaptor.forClass(Letter.class);
        verify(letterRepository).save(captor.capture());
        assertEquals("req-1", captor.getValue().getIdempotencyKey());
    }

    @Test
    void 동시_답장이_충돌하면_먼저_저장된_답장을_돌려주고_푸시는_보내지_않는다() {
        Letter winner = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .recipientStudentId(STUDENT_ID)
                .feedbackId("feedback-1")
                .title("답장 제목")
                .body("답장 본문")
                .idempotencyKey("req-1")
                .pushSuccessCount(1)
                .build();
        givenTransactionRunsInline();
        givenWaitingFeedback();
        when(letterRepository.findByIdempotencyKey("req-1"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(winner));
        when(letterRepository.save(any())).thenThrow(new DuplicateKeyException("duplicate idempotencyKey"));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        assertEquals("letter-1", response.letterId());
        assertTrue(response.pushSent());
        verify(feedbackRepository, never()).save(any());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 같은_키_동시_요청이_트랜잭션_쓰기_충돌로_실패해도_먼저_저장된_답장을_돌려준다() {
        // 첫 요청이 커밋하기 전이면 중복 키(11000)가 아니라 쓰기 충돌(112)로 온다.
        givenTransactionRunsInline();
        givenWaitingFeedback();
        when(letterRepository.findByIdempotencyKey("req-1"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(Letter.builder()
                        .id("letter-1")
                        .category(LetterCategory.REPLY)
                        .recipientStudentId(STUDENT_ID)
                        .feedbackId("feedback-1")
                        .idempotencyKey("req-1")
                        .pushSuccessCount(1)
                        .build()));
        when(letterRepository.save(any())).thenThrow(new UncategorizedMongoDbException("WriteConflict", null));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        assertEquals("letter-1", response.letterId());
        assertTrue(response.pushSent());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 커밋_응답을_잃어_TransactionSystemException이_나도_저장된_답장이_있으면_돌려준다() {
        when(transactionTemplate.execute(any()))
                .thenThrow(new TransactionSystemException("Could not commit Mongo transaction"));
        when(letterRepository.findByIdempotencyKey("req-1"))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(Letter.builder()
                        .id("letter-1")
                        .category(LetterCategory.REPLY)
                        .recipientStudentId(STUDENT_ID)
                        .feedbackId("feedback-1")
                        .idempotencyKey("req-1")
                        .build()));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        assertEquals("letter-1", response.letterId());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 커밋이_실패하고_저장된_답장도_없으면_원래_예외를_던진다() {
        when(transactionTemplate.execute(any()))
                .thenThrow(new TransactionSystemException("Could not commit Mongo transaction"));
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.empty());

        assertThrows(TransactionSystemException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null)));
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void 쓰기_충돌인데_같은_키의_답장이_아직_없으면_원래_예외를_던진다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.empty());
        when(letterRepository.save(any())).thenThrow(new UncategorizedMongoDbException("WriteConflict", null));

        assertThrows(UncategorizedMongoDbException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null)));
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void requestId가_다른_피드백의_답장이면_409로_거절하고_아무것도_보내지_않는다() {
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.of(
                Letter.reply(STUDENT_ID, "feedback-other", "답장 제목", "답장 본문", "req-1")));

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null)));

        assertEquals(ErrorCode.LETTER_REQUEST_ID_MISMATCH, exception.getErrorCode());
        verify(letterRepository, never()).save(any());
        verify(pushNotificationPort, never()).sendToToken(any());
    }

    @Test
    void requestId가_전체_발행_편지의_것이면_409로_거절한다() {
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.of(
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "req-1")));

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null)));

        assertEquals(ErrorCode.LETTER_REQUEST_ID_MISMATCH, exception.getErrorCode());
        verify(letterRepository, never()).save(any());
    }

    @Test
    void 푸시_결과_저장이_실패해도_푸시를_보냈다고_응답한다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");
        when(studentUserRepository.findByStudentId(STUDENT_ID)).thenReturn(Optional.of(StudentUser.builder()
                .studentId(STUDENT_ID)
                .currentFcmToken("fcm-token")
                .build()));
        when(pushNotificationPort.sendToToken(any())).thenReturn(new TokenPushResult(true, "message-1"));
        when(letterRepository.updatePushSuccessCount("letter-1", 1)).thenThrow(new IllegalStateException("mongo down"));

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        assertEquals("letter-1", response.letterId());
        assertTrue(response.pushSent());
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
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        ArgumentCaptor<TokenPushPayload> payloadCaptor = ArgumentCaptor.forClass(TokenPushPayload.class);
        verify(pushNotificationPort).sendToToken(payloadCaptor.capture());
        assertEquals("fcm-token", payloadCaptor.getValue().token());
        assertEquals("답장 제목", payloadCaptor.getValue().title());
        assertEquals("letter-1", payloadCaptor.getValue().data().get("letterId"));
        assertEquals("NAVIGATE_WEBVIEW", payloadCaptor.getValue().data().get("action"));
        assertEquals("/feedback/letters/letter-1", payloadCaptor.getValue().data().get("path"));
        assertTrue(response.pushSent());
        // 재시도에 같은 결과를 돌려주려면 푸시 성공을 편지에 남겨야 한다.
        verify(letterRepository).updatePushSuccessCount("letter-1", 1);
    }

    @Test
    void FCM_토큰이_없으면_푸시를_건너뛰고_답장은_발행된다() {
        givenTransactionRunsInline();
        givenWaitingFeedback();
        givenSavedLetterId("letter-1");
        when(studentUserRepository.findByStudentId(STUDENT_ID)).thenReturn(Optional.empty());

        FeedbackReplyResponse response = feedbackAdminService.reply(
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

        verify(pushNotificationPort, never()).sendToToken(any());
        verify(letterRepository, never()).updatePushSuccessCount(any(), org.mockito.ArgumentMatchers.anyInt());
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
                "feedback-1", new FeedbackReplyRequest("답장 제목", "답장 본문", true, "req-1", null));

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
    void 전체_발행에_답장의_requestId가_오면_409로_거절한다() {
        when(letterRepository.findByIdempotencyKey("req-1")).thenReturn(Optional.of(
                Letter.reply(STUDENT_ID, "feedback-1", "답장 제목", "답장 본문", "req-1")));

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackAdminService.createBroadcastLetter(
                        new LetterCreateRequest(LetterCategory.UPDATE, "제목", "본문", true, "req-1")));

        assertEquals(ErrorCode.LETTER_REQUEST_ID_MISMATCH, exception.getErrorCode());
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

    @Test
    void 보낸_편지를_수정하면_제목과_본문만_바뀌고_나머지는_그대로다() {
        Letter letter = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .recipientStudentId(STUDENT_ID)
                .feedbackId("feedback-1")
                .title("오타 있는 제목")
                .body("오타 있는 본문")
                .pushSuccessCount(1)
                .readStudentIds(Set.of(STUDENT_ID))
                .build();
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(letter));
        when(letterRepository.updateContent("letter-1", "고친 제목", "고친 본문")).thenReturn(1L);

        AdminSentLetterResponse response = feedbackAdminService.updateLetter(
                "letter-1", new LetterUpdateRequest("고친 제목", "고친 본문"));

        verify(letterRepository).updateContent("letter-1", "고친 제목", "고친 본문");
        assertEquals("고친 제목", response.title());
        assertEquals("고친 본문", response.body());
        assertEquals(LetterCategory.REPLY, response.category());
        assertEquals("feedback-1", response.feedbackId());
        assertEquals(1, response.pushSuccessCount());
        assertEquals("user_11111111", response.recipient());
    }

    @Test
    void 편지를_수정해도_문서_전체를_다시_저장하지_않는다() {
        // 전체 save는 조회 이후 markRead($addToSet)로 추가된 읽음 기록을 옛 값으로 덮어쓴다.
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "request-1")));
        when(letterRepository.updateContent(any(), any(), any())).thenReturn(1L);

        feedbackAdminService.updateLetter("letter-1", new LetterUpdateRequest("고친 공지", "고친 본문"));

        verify(letterRepository, never()).save(any());
    }

    @Test
    void 편지를_수정해도_푸시는_다시_보내지_않는다() {
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "request-1")));
        when(letterRepository.updateContent(any(), any(), any())).thenReturn(1L);

        AdminSentLetterResponse response = feedbackAdminService.updateLetter(
                "letter-1", new LetterUpdateRequest("고친 공지", "고친 본문"));

        verify(fcmAdminService, never()).sendToAll(any());
        verify(pushNotificationPort, never()).sendToToken(any());
        assertNull(response.recipient());
    }

    @Test
    void 없는_편지를_수정하면_LETTER_NOT_FOUND() {
        when(letterRepository.findById("missing")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.updateLetter(
                "missing", new LetterUpdateRequest("제목", "본문")));

        assertEquals(ErrorCode.LETTER_NOT_FOUND, exception.getErrorCode());
        verify(letterRepository, never()).updateContent(any(), any(), any());
    }

    @Test
    void 조회_뒤_수정_전에_편지가_지워지면_LETTER_NOT_FOUND() {
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "request-1")));
        when(letterRepository.updateContent(any(), any(), any())).thenReturn(0L);
        when(letterRepository.existsById("letter-1")).thenReturn(false);

        RestApiException exception = assertThrows(RestApiException.class, () -> feedbackAdminService.updateLetter(
                "letter-1", new LetterUpdateRequest("고친 공지", "고친 본문")));

        assertEquals(ErrorCode.LETTER_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 같은_내용으로_다시_저장해도_성공한다() {
        // 바뀐 문서가 없어 updateContent가 0을 돌려줘도 편지가 남아 있으면 실패가 아니다.
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(
                Letter.broadcast(LetterCategory.UPDATE, "공지 제목", "공지 본문", "request-1")));
        when(letterRepository.updateContent(any(), any(), any())).thenReturn(0L);
        when(letterRepository.existsById("letter-1")).thenReturn(true);

        AdminSentLetterResponse response = feedbackAdminService.updateLetter(
                "letter-1", new LetterUpdateRequest("공지 제목", "공지 본문"));

        assertEquals("공지 제목", response.title());
        assertEquals("공지 본문", response.body());
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

    private void givenRepliedFeedback(String replyLetterId) {
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.BUG)
                .content("버그가 있어요")
                .status(FeedbackStatus.REPLIED)
                .replyLetterId(replyLetterId)
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
