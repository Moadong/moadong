package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("club_tags")
@AllArgsConstructor
@Getter
@Builder
public class ClubTag {

    @Id
    private String id;

    @NotNull
    private String clubId;

    @Column(length = 8)
    private String tag;
}
