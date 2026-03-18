package moadong.global.util;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Component
public class FcmInitializer {

    @Value("${firebase.config.path:classpath:firebase.json}")
    private Resource firebaseConfigResource;

    @PostConstruct
    public void init() throws IOException {
        try {
            if (!firebaseConfigResource.exists()) {
                log.error("Firebase config file not found at: {}", firebaseConfigResource.getDescription());
                throw new IOException("Firebase service account file not found");
            }

            try (InputStream in = firebaseConfigResource.getInputStream()) {
                FirebaseOptions.Builder options = FirebaseOptions.builder();
                options.setCredentials(GoogleCredentials.fromStream(in));

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options.build());
                    log.info("Firebase app has been initialized using: {}", firebaseConfigResource.getDescription());
                }
            }
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
