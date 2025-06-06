package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.enums.ClubRecruitmentStatus;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public class RecruitmentStateCalculator {
    public static final int ALWAYS_RECRUIT_YEAR = 2999;

    public static void calculate(Club club, ZonedDateTime recruitmentStartDate, ZonedDateTime recruitmentEndDate) {
        if (recruitmentStartDate == null || recruitmentEndDate == null) {
            club.updateRecruitmentStatus(ClubRecruitmentStatus.CLOSED);
            return;
        }
        if (recruitmentEndDate.getYear() == ALWAYS_RECRUIT_YEAR) {
            club.updateRecruitmentStatus(ClubRecruitmentStatus.ALWAYS);
            return;
        }
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));


        if (now.isBefore(recruitmentStartDate)) {
            long between = ChronoUnit.DAYS.between(recruitmentStartDate, now);
            if (between <= 14) {
                club.updateRecruitmentStatus(ClubRecruitmentStatus.UPCOMING);
            } else {
                club.updateRecruitmentStatus(ClubRecruitmentStatus.CLOSED);
            }
        } else if (now.isAfter(recruitmentStartDate) && now.isBefore(recruitmentEndDate)) {
            club.updateRecruitmentStatus(ClubRecruitmentStatus.OPEN);
        } else if (now.isAfter(recruitmentEndDate)) {
            club.updateRecruitmentStatus(ClubRecruitmentStatus.CLOSED);
        }
    }
}
