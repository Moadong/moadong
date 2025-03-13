package moadong.club.service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import lombok.RequiredArgsConstructor;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.RecruitmentStatus;
import moadong.club.repository.ClubInformationRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecruitmentScheduler {

    private final TaskScheduler taskScheduler;
    private final ClubInformationRepository clubInformationRepository;

    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public void scheduleRecruitment(String clubId, LocalDateTime startDate,
        LocalDateTime endDate) {
        cancelScheduledTask(clubId); // 기존 스케줄 제거 후 등록

        // 모집 시작 스케줄링
        ScheduledFuture<?> startFuture = taskScheduler.schedule(
            () -> updateRecruitmentStatus(clubId, RecruitmentStatus.OPEN),
            Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant()));

        // 모집 종료 스케줄링
        ScheduledFuture<?> endFuture = taskScheduler.schedule(
            () -> updateRecruitmentStatus(clubId, RecruitmentStatus.CLOSED),
            Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant()));

        scheduledTasks.put(clubId, startFuture);
        scheduledTasks.put(clubId, endFuture);
    }

    public void cancelScheduledTask(String clubId) {
        ScheduledFuture<?> future = scheduledTasks.remove(clubId);
        if (future != null) {
            future.cancel(false);
        }
    }

    @Transactional
    public void updateRecruitmentStatus(String clubId, RecruitmentStatus status) {
        ClubRecruitmentInformation clubRecruitmentInformation = clubInformationRepository.findByClubId(clubId)
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND));

        clubRecruitmentInformation.updateRecruitmentStatus(status);
        clubInformationRepository.save(clubRecruitmentInformation);
    }

}
