package moadong.analytics.service;

import lombok.RequiredArgsConstructor;
import moadong.analytics.support.AnalyticsTime;
import moadong.club.entity.ClubApplicant;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.repository.ClubApplicantsRepository;
import moadong.club.repository.ClubApplicationFormsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClubApplicantStatisticsService {

    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final ClubApplicantsRepository clubApplicantsRepository;

    public Map<LocalDate, Long> countApplicantsByDate(String clubId, LocalDate from, LocalDate to) {
        List<String> formIds = clubApplicationFormsRepository.findByClubId(clubId).stream()
                .map(ClubApplicationForm::getId)
                .toList();
        if (formIds.isEmpty()) {
            return Map.of();
        }

        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay().minusNanos(1);
        List<ClubApplicant> applicants = clubApplicantsRepository.findByFormIdInAndCreatedAtBetween(
                formIds,
                fromDateTime,
                toDateTime
        );

        Map<LocalDate, Long> counts = new HashMap<>();
        for (ClubApplicant applicant : applicants) {
            if (applicant.getCreatedAt() == null) {
                continue;
            }
            LocalDate date = applicant.getCreatedAt().atZone(AnalyticsTime.KST).toLocalDate();
            counts.merge(date, 1L, Long::sum);
        }
        return counts;
    }
}
