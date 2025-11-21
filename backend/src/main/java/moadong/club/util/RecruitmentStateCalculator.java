package moadong.club.util;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;

public class RecruitmentStateCalculator {
    public static final int ALWAYS_RECRUIT_YEAR = 2999;

    public static void calculate(Club club, ZonedDateTime recruitmentStartDate, ZonedDateTime recruitmentEndDate) {
        ClubRecruitmentStatus oldStatus = club.getClubRecruitmentInformation().getClubRecruitmentStatus();
        ClubRecruitmentStatus newStatus = calculateRecruitmentStatus(recruitmentStartDate, recruitmentEndDate);
        club.updateRecruitmentStatus(newStatus);

        if (oldStatus == newStatus)
            return;

        Message message = buildRecruitmentMessage(club, newStatus);
        club.sendPushNotification(message);
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

    public static Message buildRecruitmentMessage(Club club, ClubRecruitmentStatus status) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M월 d일 a h시 m분", Locale.KOREAN);
        ClubRecruitmentInformation info = club.getClubRecruitmentInformation();

        String bodyMessage = switch (status) {
            case ALWAYS -> "상시 모집 중입니다. 언제든지 지원해주세요!";
            case OPEN -> {
                String formattedEndTime = info.getRecruitmentEnd().format(formatter);
                yield formattedEndTime + "까지 모집 중이니 서둘러 지원하세요!";
            }
            case UPCOMING -> {
                String formattedStartTime = info.getRecruitmentStart().format(formatter);
                yield formattedStartTime + "부터 모집이 시작될 예정이에요. 조금만 기다려주세요!";
            }
            case CLOSED -> "모집이 마감되었습니다. 다음 모집을 기대해주세요.";
        };

        return Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(club.getName())
                        .setBody(bodyMessage)
                        .build())
                .setTopic(club.getId())
                .build();
    }
}
