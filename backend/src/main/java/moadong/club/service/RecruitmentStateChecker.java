package moadong.club.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecruitmentStateChecker {

    private final ClubRepository clubRepository;

    @Scheduled(fixedRate = 60 * 60 * 1000) // 5분마다 실행
    public void performTask() {
        List<Club> clubs = clubRepository.findAll();
        for (Club club : clubs) {
            ClubRecruitmentInformation recruitInfo = club.getClubRecruitmentInformation();
            ZonedDateTime recruitmentStartDate = recruitInfo.getRecruitmentStart();
            ZonedDateTime recruitmentEndDate = recruitInfo.getRecruitmentEnd();
            if (recruitInfo.getClubRecruitmentStatus() == ClubRecruitmentStatus.ALWAYS) {
                continue;
            }
            if (recruitmentStartDate != null && recruitmentEndDate != null) {
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
            } else {
                club.updateRecruitmentStatus(ClubRecruitmentStatus.CLOSED);
            }
            clubRepository.save(club);
        }
    }
}
