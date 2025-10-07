package moadong.fcm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Document("fcm_tokens")
@AllArgsConstructor
@Getter
@Builder
public class FcmToken {

    @Id
    String id;

    String token;

    @Builder.Default
    ArrayList<String> clubIds = new ArrayList<>();

    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();

    public void updateTimestamp() {
        this.timestamp = LocalDateTime.now();
    }

    public void updateClubIds(ArrayList<String> clubIds) {
        this.clubIds = clubIds;
    }
}
