package moadong.club.payload.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record ClubSearchResult(
        String id,
        String name,
        String logo,
        List<String> tags,
        String state,
        String category,
        String division,
        String introduction,
        String recruitmentStatus
) {

}
