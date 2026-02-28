package moadong.media.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("banner_images")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BannerImages {

    @Id
    private String id;

    private List<BannerItem> images;

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
