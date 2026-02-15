package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    private Instant eventStartDate;

    private Instant eventEndDate;

    private String description;

    private List<String> images;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
