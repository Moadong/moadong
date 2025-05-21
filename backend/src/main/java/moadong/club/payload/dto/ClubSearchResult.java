package moadong.club.payload.dto;

import lombok.Builder;

import java.util.List;

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
