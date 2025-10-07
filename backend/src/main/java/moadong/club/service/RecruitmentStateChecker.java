package moadong.club.service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.club.util.RecruitmentStateCalculator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class RecruitmentStateChecker {

    private final ClubRepository clubRepository;

    @Scheduled(fixedRate = 60 * 60 * 1000) // 1시간마다 실행
    public void performTask() {
        List<Club> clubs = clubRepository.findAll();
        for (Club club : clubs) {
            ClubRecruitmentInformation recruitInfo = club.getClubRecruitmentInformation();
            ZonedDateTime recruitmentStartDate = recruitInfo.getRecruitmentStart();
            ZonedDateTime recruitmentEndDate = recruitInfo.getRecruitmentEnd();
            if (recruitInfo.getClubRecruitmentStatus() == ClubRecruitmentStatus.ALWAYS) {
                continue;
            }
            ClubRecruitmentStatus oldStatus = club.getClubRecruitmentInformation().getClubRecruitmentStatus();
            RecruitmentStateCalculator.calculate(club, recruitmentStartDate, recruitmentEndDate);
            ClubRecruitmentStatus newStatus = club.getClubRecruitmentInformation().getClubRecruitmentStatus();

            if (oldStatus != newStatus) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M월 d일 a h시 m분", Locale.KOREAN);

                String bodyMessage = switch (newStatus) {
                    case ALWAYS -> "상시 모집 중입니다. 언제든지 지원해주세요!";
                    case OPEN -> {
                        String formattedEndTime = club.getClubRecruitmentInformation().getRecruitmentEnd().format(formatter);
                        yield formattedEndTime + "까지 모집 중이니 서둘러 지원하세요!";
                    }
                    case UPCOMING -> {
                        String formattedStartTime = club.getClubRecruitmentInformation().getRecruitmentStart().format(formatter);
                        yield formattedStartTime + "부터 모집이 시작될 예정이에요. 조금만 기다려주세요!";
                    }
                    case CLOSED -> "모집이 마감되었습니다. 다음 모집을 기대해주세요.";
                };

                Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setImage(club.getClubRecruitmentInformation().getLogo())
                            .setTitle(club.getName())
                            .setBody(bodyMessage)
                            .build())
                    .setTopic(club.getId())
                    .build();

                try {
                    FirebaseMessaging.getInstance().send(message);
                } catch (FirebaseMessagingException e) {
                    log.error("Failed to send Message {}:{}", club.getId(), e.getMessage());
                }
            }

            clubRepository.save(club);
        }
    }
}
