package moadong.global.util;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;

@Slf4j
@Component
public class FcmInitializer {
    private String fcmConfigPath = "";

    @PostConstruct
    public void init() {
        try {
            FileInputStream serviceAccount =
                    new FileInputStream("resources/firebase.json");

            FirebaseOptions.Builder options = FirebaseOptions.builder();
            options.setCredentials(GoogleCredentials.fromStream(serviceAccount));

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options.build());
                log.info("Firebase app has been initialized");
            }
        } catch (IOException e) {
            log.error("Error initializing Firebase app", e);
        }
    }
}
