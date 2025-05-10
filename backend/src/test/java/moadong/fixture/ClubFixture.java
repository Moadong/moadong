package moadong.fixture;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ClubFixture {
    public static Club createClub(String clubId, String name) {
        Club club = mock(Club.class);
        when(club.getId()).thenReturn(clubId);
        when(club.getName()).thenReturn(name);
        return club;
    }

    public static ClubRecruitmentInformation createRecruitmentInfo(
            String id,
            String logo,
            String introduction,
            String description,
            String presidentName,
            String presidentTelephoneNumber,
            LocalDateTime recruitmentStart,
            LocalDateTime recruitmentEnd,
            List<String> feedImages,
            ClubRecruitmentStatus clubRecruitmentStatus) {
        ClubRecruitmentInformation clubRecruitmentInfo = mock(ClubRecruitmentInformation.class);
        when(clubRecruitmentInfo.getId()).thenReturn(id);
        when(clubRecruitmentInfo.getLogo()).thenReturn(logo);
        when(clubRecruitmentInfo.getIntroduction()).thenReturn(introduction);
        when(clubRecruitmentInfo.getDescription()).thenReturn(description);
        when(clubRecruitmentInfo.getPresidentName()).thenReturn(presidentName);
        when(clubRecruitmentInfo.getPresidentTelephoneNumber()).thenReturn(presidentTelephoneNumber);
        when(clubRecruitmentInfo.getRecruitmentStart()).thenReturn(ZonedDateTime.from(recruitmentStart));
        when(clubRecruitmentInfo.getRecruitmentEnd()).thenReturn(ZonedDateTime.from(recruitmentEnd));
        when(clubRecruitmentInfo.getFeedImages()).thenReturn(feedImages);
        when(clubRecruitmentInfo.getClubRecruitmentStatus()).thenReturn(clubRecruitmentStatus);
        return clubRecruitmentInfo;
    }


}