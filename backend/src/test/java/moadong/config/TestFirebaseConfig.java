package moadong.config;

import com.google.firebase.messaging.FirebaseMessaging;
import moadong.fcm.port.PushNotificationPort;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import static org.mockito.Mockito.mock;

@TestConfiguration
public class TestFirebaseConfig {

    @Bean
    @Primary
    public FirebaseMessaging firebaseMessaging() {
        return mock(FirebaseMessaging.class);
    }

    @Bean
    @Primary
    public PushNotificationPort pushNotificationPort() {
        return mock(PushNotificationPort.class);
    }
}
