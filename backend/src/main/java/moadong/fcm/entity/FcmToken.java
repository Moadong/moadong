package moadong.fcm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("fcm_tokens")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class FcmToken {

    @Id
    private String id;

    private String token;

    @Builder.Default
    private List<String> clubIds = new ArrayList<>();

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public void updateTimestamp() {
        this.timestamp = LocalDateTime.now();
    }

    public void updateClubIds(List<String> clubIds) {
        this.clubIds.clear();
        this.clubIds.addAll(clubIds);
    }
}
