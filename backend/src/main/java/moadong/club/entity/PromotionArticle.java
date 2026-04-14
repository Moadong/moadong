package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.club.payload.request.PromotionArticleUpdateRequest;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("promotion_articles")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PromotionArticle {

    @Id
    private String id;

    private String clubId;

    private String clubName;

    private String title;

    private String location;

    private Double latitude;

    private Double longitude;

    private Instant eventStartDate;

    private Instant eventEndDate;

    private String description;

    private List<String> images;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private boolean deleted = false;

    private Instant deletedAt;

    public void update(PromotionArticleUpdateRequest request, String clubName) {
        this.clubId = request.clubId();
        this.clubName = clubName;
        this.title = request.title();
        this.location = request.location();
        this.latitude = request.latitude();
        this.longitude = request.longitude();
        this.eventStartDate = request.eventStartDate();
        this.eventEndDate = request.eventEndDate();
        this.description = request.description();
        this.images = request.images();
    }

    public void softDelete() {
        this.deleted = true;
        this.deletedAt = Instant.now();
    }
}
