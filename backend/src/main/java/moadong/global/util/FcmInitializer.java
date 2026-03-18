package moadong.global.util;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.config.properties.FirebaseProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Slf4j
@Component
@RequiredArgsConstructor
public class FcmInitializer {

    private final FirebaseProperties firebaseProperties;

    @PostConstruct
    public void init() {
        try {
            Resource firebaseConfigResource = firebaseProperties.path();
            if (firebaseConfigResource == null || !firebaseConfigResource.exists()) {
                log.warn("Firebase config file not found at: {}. FCM features will be disabled.",
                         firebaseConfigResource != null ? firebaseConfigResource.getDescription() : "null");
                return;
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
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        if (FirebaseApp.getApps().isEmpty()) {
            log.warn("FirebaseApp is not initialized. FirebaseMessaging bean might not work properly.");
        }
        return FirebaseApp.getApps().isEmpty() ? null : FirebaseMessaging.getInstance();
    }
}
