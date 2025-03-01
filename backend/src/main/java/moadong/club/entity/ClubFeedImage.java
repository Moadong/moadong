package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.checkerframework.common.aliasing.qual.Unique;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("club_feed_images")
@AllArgsConstructor
@Getter
@Builder
public class ClubFeedImage {

    @Id
    private String id;

    @NotNull
    private String clubId;

    @Column(length = 1024)
    @Unique
    private String image;
}
