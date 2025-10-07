package moadong.global.util;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@Slf4j
@Component
public class FcmInitializer {

    @PostConstruct
    public void init() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("./src/main/resources/firebase.json");

        FirebaseOptions.Builder options = FirebaseOptions.builder();
        options.setCredentials(GoogleCredentials.fromStream(serviceAccount));

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options.build());
            log.info("Firebase app has been initialized");
        }
    }
}
