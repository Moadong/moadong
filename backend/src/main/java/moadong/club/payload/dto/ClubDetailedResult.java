package moadong.club.payload.dto;

import lombok.Builder;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.media.resolver.ImageDisplayUrlResolver;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        ClubDescriptionDto description,
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
        String lastModifiedDate
) {

    public static ClubDetailedResult of(Club club) {
        return of(club, null);
    }

    public static ClubDetailedResult of(Club club, ImageDisplayUrlResolver resolver) {
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

        String logo = clubRecruitmentInformation.getLogo() == null ? ""
                : clubRecruitmentInformation.getLogo();
        String cover = clubRecruitmentInformation.getCover() == null ? ""
                : clubRecruitmentInformation.getCover();
        List<String> feeds = clubRecruitmentInformation.getFeedImages() == null ? List.of()
                : clubRecruitmentInformation.getFeedImages();
        if (resolver != null) {
            logo = resolver.resolveDisplayUrl(logo);
            cover = resolver.resolveDisplayUrl(cover);
            feeds = feeds.stream()
                    .map(resolver::resolveDisplayUrl)
                    .collect(Collectors.toList());
        }

        return ClubDetailedResult.builder()
                .id(club.getId() == null ? "" : club.getId())
                .name(club.getName() == null ? "" : club.getName())
                .logo(logo)
                .cover(cover)
                .tags(clubRecruitmentInformation.getTags() == null ? List.of()
                        : clubRecruitmentInformation.getTags())
                .state(club.getState() == null ? "" : club.getState().getDesc())
                .feeds(feeds)
                .category(club.getCategory() == null ? "" : club.getCategory())
                .division(club.getDivision() == null ? "" : club.getDivision())
                .introduction(clubRecruitmentInformation.getIntroduction() == null ? ""
                        : clubRecruitmentInformation.getIntroduction())
                .description(ClubDescriptionDto.from(club.getClubDescription()))
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
                        ? "" : clubRecruitmentInformation.getClubRecruitmentStatus().toString())
                .externalApplicationUrl(club.getClubRecruitmentInformation().getExternalApplicationUrl() == null ? "" :
                        club.getClubRecruitmentInformation().getExternalApplicationUrl())
                .socialLinks(club.getSocialLinks() == null ? Map.of()
                        : club.getSocialLinks())
                .lastModifiedDate(lastModifiedDate)
                .build();
    }

}
