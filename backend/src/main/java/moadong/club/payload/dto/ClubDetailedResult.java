package moadong.club.payload.dto;

import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.Builder;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;

@Builder
public record ClubDetailedResult(
    String id,
    String name,
    String logo,
    List<String> tags,
    String state,
    List<String> feeds,
    String description,
    String presidentName,
    String presidentPhoneNumber,
    String recruitmentPeriod,
    String recruitmentTarget,
    String category,
    String division
) {

    public static ClubDetailedResult of(Club club) {
        String period = "미정";
        ClubRecruitmentInformation clubRecruitmentInformation = club.getClubRecruitmentInformation();
        if (clubRecruitmentInformation.hasRecruitmentPeriod()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
            period = clubRecruitmentInformation.getRecruitmentStart().format(formatter) + " ~ "
                + clubRecruitmentInformation.getRecruitmentEnd().format(formatter);
        }
        return ClubDetailedResult.builder()
            .id(club.getId())
            .name(club.getName())
            .category(club.getCategory())
            .division(club.getDivision())
            .state(club.getState().getDesc())
            .description(clubRecruitmentInformation.getDescription())
            .presidentName(clubRecruitmentInformation.getPresidentName())
            .presidentPhoneNumber(clubRecruitmentInformation.getPresidentTelephoneNumber())
            .feeds(clubRecruitmentInformation.getFeedImages())
            .tags(clubRecruitmentInformation.getTags())
            .recruitmentPeriod(period)
            .recruitmentTarget(clubRecruitmentInformation.getRecruitmentTarget())
            .build();
    }

}
