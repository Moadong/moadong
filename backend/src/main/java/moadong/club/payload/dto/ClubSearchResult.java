package moadong.club.payload.dto;

import java.util.List;
import lombok.Builder;
import moadong.club.entity.Club;
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
    public static ClubSearchResult of(Club club) {
        ClubRecruitmentInformation info = club.getClubRecruitmentInformation();

        // 정보가 없을 경우를 대비한 방어적 코딩
        String logoUrl = (info != null) ? info.getLogo() : null;
        List<String> tagsList = (info != null) ? info.getTags() : null;
        String intro = (info != null) ? info.getIntroduction() : null;
        String status = (info != null && info.getClubRecruitmentStatus() != null)
                ? info.getClubRecruitmentStatus().name()
                : null;

        return ClubSearchResult.builder()
                .id(club.getId())
                .name(club.getName())
                .logo(logoUrl)
                .tags(tagsList)
                .state(club.getState() != null ? club.getState().name() : null)
                .category(club.getCategory())
                .division(club.getDivision())
                .introduction(intro)
                .recruitmentStatus(status)
                .build();
    }
}
