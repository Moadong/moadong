package moadong.fcm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("fcm_tokens")
@AllArgsConstructor
@Getter
@Builder
public class FcmToken {

    @Id
    String id;

    String fcmToken;

    LocalDateTime timestamp;
}
