package moadong.fcm.adapter;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import moadong.fcm.model.PushPayload;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@UnitTest
class FirebasePushNotificationAdapterTest {

    @InjectMocks
    private FirebasePushNotificationAdapter adapter;

    @Mock
    private FirebaseMessaging firebaseMessaging;

    @Test
    void send_성공시_true를_반환하고_메시지를_전송한다() throws Exception {
        PushPayload payload = new PushPayload(
                "테스트 제목",
                "테스트 본문",
                "club_topic",
                Map.of("path", "/webview/clubDetail/1", "clubId", "1")
        );

        when(firebaseMessaging.send(any(Message.class))).thenReturn("message-id");

        boolean result = adapter.send(payload);

        assertThat(result).isTrue();
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

        boolean result = adapter.send(payload);

        assertThat(result).isFalse();
    }
}
