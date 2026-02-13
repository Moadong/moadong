package moadong.club.util;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import moadong.club.entity.Club;
import moadong.club.enums.ClubRecruitmentStatus;
import org.springframework.stereotype.Component;

@Component
public class RecruitmentStateCalculator {
    public static final int ALWAYS_RECRUIT_YEAR = 2999;

    public boolean calculate(Club club, ZonedDateTime recruitmentStartDate, ZonedDateTime recruitmentEndDate) {
        ClubRecruitmentStatus oldStatus = club.getClubRecruitmentInformation().getClubRecruitmentStatus();
        ClubRecruitmentStatus newStatus = calculateRecruitmentStatus(recruitmentStartDate, recruitmentEndDate);
        club.updateRecruitmentStatus(newStatus);

        return oldStatus != newStatus;
    }

    public static ClubRecruitmentStatus calculateRecruitmentStatus(ZonedDateTime recruitmentStartDate, ZonedDateTime recruitmentEndDate) {
        if (recruitmentStartDate == null || recruitmentEndDate == null) {
            return ClubRecruitmentStatus.CLOSED;
        }

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));

        if (now.isBefore(recruitmentStartDate)) {
            long daysUntilStart = ChronoUnit.DAYS.between(now, recruitmentStartDate);
            return (daysUntilStart <= 14)
                    ? ClubRecruitmentStatus.UPCOMING
                    : ClubRecruitmentStatus.CLOSED;
        }

        if (!now.isBefore(recruitmentStartDate) && now.isBefore(recruitmentEndDate)) {
            return (recruitmentEndDate.getYear() == ALWAYS_RECRUIT_YEAR)
                    ? ClubRecruitmentStatus.ALWAYS
                    : ClubRecruitmentStatus.OPEN;
        }

        return ClubRecruitmentStatus.CLOSED;
    }
}
