package moadong.club.service;

import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.repository.ClubRepository;
import moadong.club.util.RecruitmentStateCalculator;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;

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
            RecruitmentStateCalculator.calculate(club, recruitmentStartDate, recruitmentEndDate);
            clubRepository.save(club);
        }
    }
}
