package moadong.fcm.adapter;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.SendResponse;
import moadong.fcm.model.MulticastPushPayload;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.model.PushPayload;
import moadong.fcm.model.TokenPushResult;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@UnitTest
class FirebasePushNotificationAdapterTest {

    @InjectMocks
    private FirebasePushNotificationAdapter adapter;

    @Mock
    private FirebaseMessaging firebaseMessaging;

    private ListAppender<ILoggingEvent> logAppender;

    @BeforeEach
    void attachLogAppender() {
        logAppender = new ListAppender<>();
        logAppender.start();
        adapterLogger().addAppender(logAppender);
    }

    @AfterEach
    void detachLogAppender() {
        adapterLogger().detachAppender(logAppender);
    }

    private Logger adapterLogger() {
        return (Logger) LoggerFactory.getLogger(FirebasePushNotificationAdapter.class);
    }

    @Test
    void send_성공시_true를_반환하고_메시지를_전송한다() throws Exception {
        PushPayload payload = new PushPayload(
                "테스트 제목",
                "테스트 본문",
                "club_topic",
                Map.of("path", "/webview/clubDetail/1", "clubId", "1")
        );

        when(firebaseMessaging.send(any(Message.class))).thenReturn("message-id");

        TokenPushResult result = adapter.send(payload);

        assertThat(result.success()).isTrue();
        verify(firebaseMessaging).send(any(Message.class));
    }

    @Test
    void send_예외발생시_false를_반환한다() throws Exception {
        PushPayload payload = new PushPayload(
                "테스트 제목",
                "테스트 본문",
                "club_topic",
                Map.of("clubId", "1")
        );

        when(firebaseMessaging.send(any(Message.class))).thenThrow(new RuntimeException("send failed"));

        TokenPushResult result = adapter.send(payload);

        assertThat(result.success()).isFalse();
    }

    @Test
    void sendToTokens_배치마다_실패_errorCode_집계를_로그로_남긴다() throws Exception {
        String tokenA = "token-aaaaaaaaaaaaaaaaaaaaaa";
        String tokenB = "token-bbbbbbbbbbbbbbbbbbbbbb";
        String tokenC = "token-cccccccccccccccccccccc";
        String tokenD = "token-dddddddddddddddddddddd";
        MulticastPushPayload payload = new MulticastPushPayload(
                List.of(tokenA, tokenB, tokenC, tokenD), "제목", "본문", Map.of()
        );

        List<SendResponse> responses = List.of(
                successResponse(),
                failedResponse(MessagingErrorCode.UNREGISTERED),
                failedResponse(MessagingErrorCode.UNREGISTERED),
                failedResponse(MessagingErrorCode.UNAVAILABLE)
        );
        BatchResponse response = mock(BatchResponse.class);
        when(response.getSuccessCount()).thenReturn(1);
        when(response.getFailureCount()).thenReturn(3);
        when(response.getResponses()).thenReturn(responses);
        when(firebaseMessaging.sendEachForMulticast(any(MulticastMessage.class))).thenReturn(response);

        MulticastPushResult result = adapter.sendToTokens(payload);

        assertThat(result.successCount()).isEqualTo(1);
        assertThat(result.failureCount()).isEqualTo(3);
        assertThat(result.failedTokens()).containsExactly(tokenB, tokenC, tokenD);

        List<String> messages = logAppender.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
        assertThat(messages).anySatisfy(message -> assertThat(message)
                .contains("FCM batch 1/1")
                .contains("success=1")
                .contains("failure=3")
                .contains("codes={UNREGISTERED=2, UNAVAILABLE=1}"));
        assertThat(messages).noneSatisfy(message -> assertThat(message)
                .containsAnyOf(tokenA, tokenB, tokenC, tokenD));
    }

    @Test
    void sendToTokens_errorCode가_없는_실패는_UNKNOWN으로_집계한다() throws Exception {
        MulticastPushPayload payload = new MulticastPushPayload(
                List.of("token-aaaaaaaaaaaaaaaaaaaaaa"), "제목", "본문", Map.of()
        );

        SendResponse noCode = mock(SendResponse.class);
        when(noCode.isSuccessful()).thenReturn(false);
        when(noCode.getException()).thenReturn(null);

        BatchResponse response = mock(BatchResponse.class);
        when(response.getSuccessCount()).thenReturn(0);
        when(response.getFailureCount()).thenReturn(1);
        when(response.getResponses()).thenReturn(List.of(noCode));
        when(firebaseMessaging.sendEachForMulticast(any(MulticastMessage.class))).thenReturn(response);

        adapter.sendToTokens(payload);

        assertThat(logAppender.list.stream().map(ILoggingEvent::getFormattedMessage))
                .anySatisfy(message -> assertThat(message).contains("codes={UNKNOWN=1}"));
    }

    private SendResponse successResponse() {
        SendResponse sendResponse = mock(SendResponse.class);
        when(sendResponse.isSuccessful()).thenReturn(true);
        return sendResponse;
    }

    private SendResponse failedResponse(MessagingErrorCode code) {
        FirebaseMessagingException exception = mock(FirebaseMessagingException.class);
        when(exception.getMessagingErrorCode()).thenReturn(code);
        SendResponse sendResponse = mock(SendResponse.class);
        when(sendResponse.isSuccessful()).thenReturn(false);
        when(sendResponse.getException()).thenReturn(exception);
        return sendResponse;
    }
}
