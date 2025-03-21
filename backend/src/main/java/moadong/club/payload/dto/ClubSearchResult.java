package moadong.club.payload.dto;

import java.util.List;
import lombok.Builder;
import moadong.club.entity.ClubRecruitmentInformation;

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

    public static ClubSearchResult of(ClubSearchResult search, ClubRecruitmentInformation information,
        List<String> tags) {
        return ClubSearchResult.builder()
            .id(search.id())
            .name(search.name())
            .logo(search.logo())
            .tags(tags)
            .state(search.state())
            .category(search.category())
            .division(search.division())
            .introduction(information.getIntroduction())
            .recruitmentStatus(information.getRecruitmentStatus().toString())
            .build();
    }
}
