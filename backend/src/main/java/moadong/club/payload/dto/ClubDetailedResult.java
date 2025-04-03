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
                .id(club.getId() == null ? "" : club.getId())
                .name(club.getName() == null ? "" : club.getName())
                .logo(clubRecruitmentInformation.getLogo() == null ? "" : clubRecruitmentInformation.getLogo())
                .tags(clubRecruitmentInformation.getTags() == null ? List.of() : clubRecruitmentInformation.getTags())
                .state(club.getState() == null ? "" : club.getState().getDesc())
                .feeds(clubRecruitmentInformation.getFeedImages() == null ? List.of() : clubRecruitmentInformation.getFeedImages())
                .category(club.getCategory() == null ? "" : club.getCategory())
                .division(club.getDivision() == null ? "" : club.getDivision())
                .introduction(clubRecruitmentInformation.getIntroduction() == null ? "" : clubRecruitmentInformation.getIntroduction())
                .description(clubRecruitmentInformation.getDescription() == null ? "" : clubRecruitmentInformation.getDescription())
                .presidentName(clubRecruitmentInformation.getPresidentName() == null ? "" : clubRecruitmentInformation.getPresidentName())
                .presidentPhoneNumber(clubRecruitmentInformation.getPresidentTelephoneNumber() == null ? "" : clubRecruitmentInformation.getPresidentTelephoneNumber())
                .recruitmentPeriod(period)
                .recruitmentTarget(clubRecruitmentInformation.getRecruitmentTarget() == null ? "" : clubRecruitmentInformation.getRecruitmentTarget())
                .recruitmentStatus(clubRecruitmentInformation.getRecruitmentStatus() == null
                        ? "" : clubRecruitmentInformation.getRecruitmentStatus().getDescription())
                .recruitmentForm(clubRecruitmentInformation.getRecruitmentForm() == null ? "" : clubRecruitmentInformation.getRecruitmentForm())
                .build();
    }

}
