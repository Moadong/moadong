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
    String introduction,
    String description,
    String presidentName,
    String presidentPhoneNumber,
    String recruitmentPeriod,
    String recruitmentTarget,
    String recruitmentStatus,
    String recruitmentForm,
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
            .logo(club.getClubRecruitmentInformation().getLogo())
            .tags(clubRecruitmentInformation.getTags())
            .state(club.getState().getDesc())
            .feeds(clubRecruitmentInformation.getFeedImages())
            .category(club.getCategory())
            .division(club.getDivision())
            .introduction(clubRecruitmentInformation.getIntroduction())
            .description(clubRecruitmentInformation.getDescription())
            .presidentName(clubRecruitmentInformation.getPresidentName())
            .presidentPhoneNumber(clubRecruitmentInformation.getPresidentTelephoneNumber())
            .recruitmentPeriod(period)
            .recruitmentTarget(clubRecruitmentInformation.getRecruitmentTarget())
            .recruitmentStatus(clubRecruitmentInformation.getRecruitmentStatus().toString())
            .recruitmentForm(clubRecruitmentInformation.getRecruitmentForm())
            .build();
    }

}
