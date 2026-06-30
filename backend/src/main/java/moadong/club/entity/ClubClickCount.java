package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("club_click_counts")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubClickCount {

    @Id
    private String id;

    @Indexed(unique = true)
    private String clubName;

    private long clickCount;
}
