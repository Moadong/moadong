package moadong.club.payload.dto;

import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.Builder;
import moadong.club.entity.Club;
import moadong.club.entity.ClubInformation;

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
    String classification,
    String division
) {

    public static ClubDetailedResult of(
        Club club,
        ClubInformation clubInformation,
        List<String> clubFeedImages,
        List<String> clubTags) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
        return ClubDetailedResult.builder()
            .id(club.getId())
            .name(club.getName())
            .classification(club.getClassification())
            .division(club.getDivision())
            .state(club.getState().getDesc())
            .description(clubInformation.getDescription())
            .presidentName(clubInformation.getPresidentName())
            .presidentPhoneNumber(clubInformation.getPresidentTelephoneNumber())
            .feeds(clubFeedImages)
            .tags(clubTags)
            .recruitmentPeriod(clubInformation.getRecruitmentStart().format(formatter) + " ~ "
                + clubInformation.getRecruitmentEnd().format(formatter))
            .recruitmentTarget(clubInformation.getRecruitmentTarget())
            .build();
    }

}
