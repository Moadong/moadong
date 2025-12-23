package moadong.club.payload.dto;

import lombok.Builder;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.entity.Faq;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Builder
public record ClubDetailedResult(
        String id,
        String name,
        String logo,
        String cover,
        List<String> tags,
        String state,
        List<String> feeds,
        String introduction,
        String description,
        String presidentName,
        String presidentPhoneNumber,
        String recruitmentStart,
        String recruitmentEnd,
        String recruitmentTarget,
        String recruitmentStatus,
        String externalApplicationUrl,
        Map<String, String> socialLinks,
        String category,
        String division,
        List<Faq> faqs,
        String lastModifiedDate
) {

    public static ClubDetailedResult of(Club club) {
        ClubRecruitmentInformation clubRecruitmentInformation = club.getClubRecruitmentInformation();

        String start = "미정";
        String end = "미정";
        if (clubRecruitmentInformation.hasRecruitmentPeriod()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
            start = clubRecruitmentInformation.getRecruitmentStart().format(formatter);
            end = clubRecruitmentInformation.getRecruitmentEnd().format(formatter);
        }

        String lastModifiedDate = "";
        if (club.getClubRecruitmentInformation().getLastModifiedDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
            lastModifiedDate = club.getClubRecruitmentInformation().getLastModifiedDate().format(formatter);
        }
        return ClubDetailedResult.builder()
                .id(club.getId() == null ? "" : club.getId())
                .name(club.getName() == null ? "" : club.getName())
                .logo(clubRecruitmentInformation.getLogo() == null ? ""
                        : clubRecruitmentInformation.getLogo())
                .cover(clubRecruitmentInformation.getCover() == null ? ""
                        : clubRecruitmentInformation.getCover())
                .tags(clubRecruitmentInformation.getTags() == null ? List.of()
                        : clubRecruitmentInformation.getTags())
                .state(club.getState() == null ? "" : club.getState().getDesc())
                .feeds(clubRecruitmentInformation.getFeedImages() == null ? List.of()
                        : clubRecruitmentInformation.getFeedImages())
                .category(club.getCategory() == null ? "" : club.getCategory())
                .division(club.getDivision() == null ? "" : club.getDivision())
                .introduction(clubRecruitmentInformation.getIntroduction() == null ? ""
                        : clubRecruitmentInformation.getIntroduction())
                .description(club.getDescription() == null ? ""
                        : club.getDescription())
                .presidentName(clubRecruitmentInformation.getPresidentName() == null ? ""
                        : clubRecruitmentInformation.getPresidentName())
                .presidentPhoneNumber(
                        clubRecruitmentInformation.getPresidentTelephoneNumber() == null ? ""
                                : clubRecruitmentInformation.getPresidentTelephoneNumber())
                .recruitmentStart(start)
                .recruitmentEnd(end)
                .recruitmentTarget(clubRecruitmentInformation.getRecruitmentTarget() == null ? ""
                        : clubRecruitmentInformation.getRecruitmentTarget())
                .recruitmentStatus(clubRecruitmentInformation.getClubRecruitmentStatus() == null
                        ? "" : clubRecruitmentInformation.getClubRecruitmentStatus().getDescription())
                .externalApplicationUrl(club.getClubRecruitmentInformation().getExternalApplicationUrl() == null ? "" :
                        club.getClubRecruitmentInformation().getExternalApplicationUrl())
                .socialLinks(club.getSocialLinks() == null ? Map.of()
                        : club.getSocialLinks())
                .faqs(club.getFaqs() == null ? List.of()
                        : club.getFaqs())
                .lastModifiedDate(lastModifiedDate)
                .build();
    }

}
