package moadong.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document("club_search_keyword_daily")
@CompoundIndex(name = "date_keyword_unique", def = "{'date': 1, 'normalizedKeyword': 1}", unique = true)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubSearchKeywordDaily {

    @Id
    private String id;

    @Indexed
    private LocalDate date;

    private String keyword;
    private String normalizedKeyword;
    private long count;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
