package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.fcm.model.PushPayload;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class RecruitmentStateNotificationBuilder {

    private static final DateTimeFormatter KOREAN_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("M월 d일 a h시 m분", Locale.KOREAN);

    private final ClubNotificationPayloadFactory payloadFactory;

    public RecruitmentStateNotificationBuilder(ClubNotificationPayloadFactory payloadFactory) {
        this.payloadFactory = payloadFactory;
    }

    public PushPayload build(Club club, ClubRecruitmentStatus status) {
        ClubRecruitmentInformation info = club.getClubRecruitmentInformation();
        String body = switch (status) {
            case ALWAYS -> "상시 모집 중입니다. 언제든지 지원해주세요!";
            case OPEN -> info.getRecruitmentEnd().format(KOREAN_TIME_FORMATTER) + "까지 모집 중이니 서둘러 지원하세요!";
            case UPCOMING -> info.getRecruitmentStart().format(KOREAN_TIME_FORMATTER) + "부터 모집이 시작될 예정이에요. 조금만 기다려주세요!";
            case CLOSED -> "모집이 마감되었습니다. 다음 모집을 기대해주세요.";
        };
        return payloadFactory.create(club, body);
    }
}
