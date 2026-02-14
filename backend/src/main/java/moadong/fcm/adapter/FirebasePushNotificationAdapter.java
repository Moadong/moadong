package moadong.fcm.adapter;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.model.PushPayload;
import moadong.fcm.port.PushNotificationPort;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FirebasePushNotificationAdapter implements PushNotificationPort {

    private final FirebaseMessaging firebaseMessaging;

    @Override
    public boolean send(PushPayload payload) {
        log.info("PushPayload: {}", payload);
        Message message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(payload.title())
                        .setBody(payload.body())
                        .build())
                .putAllData(payload.data())
                .setTopic(payload.topic())
                .build();

        try {
            String messageId = firebaseMessaging.send(message);
            log.info("FCM send success - topic: {}, messageId: {}", payload.topic(), messageId);
            return true;
        } catch (Exception e) {
            log.error("FCM send failed - topic: {}, error: {}", payload.topic(), e.getMessage());
            return false;
        }
    }
}
