package moadong.global.util;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Component
public class FcmInitializer {

    @PostConstruct
    public void init() throws IOException {
        try {
            ClassPathResource serviceAccount =
                    new ClassPathResource("firebase2.json");

            if (!serviceAccount.exists()) {
                throw new IOException("Firebase service account file not found");
            }

            InputStream in = serviceAccount.getInputStream();

            FirebaseOptions.Builder options = FirebaseOptions.builder();
            options.setCredentials(GoogleCredentials.fromStream(in));

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options.build());
                log.info("Firebase app has been initialized");
            }

            in.close();
        } catch (Exception e) {
            log.error("Firebase app initialization failed", e);
            throw e;
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        return FirebaseMessaging.getInstance();
    }
}
