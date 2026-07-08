package moadong.analytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.analytics.support.AnalyticsTime;
import moadong.club.repository.ClubRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClubAnalyticsRecordService {

    private final MongoTemplate mongoTemplate;
    private final ClubRepository clubRepository;

    public void recordDetailView(String clubId, String clubName) {
        try {
            if (clubId == null || clubId.isBlank()) {
                return;
            }
            incrementClubDaily(clubId, clubName, AnalyticsTime.todayKst(), 1, 0, 0);
        } catch (Exception e) {
            log.warn("동아리 상세 조회 통계 기록 실패. clubId={}", clubId, e);
        }
    }

    public void recordSearchKeyword(String keyword) {
        try {
            String normalizedKeyword = normalizeKeyword(keyword);
            if (normalizedKeyword == null) {
                return;
            }
            incrementKeywordDaily(keyword.trim(), normalizedKeyword, AnalyticsTime.todayKst(), 1);
        } catch (Exception e) {
            log.warn("검색어 통계 기록 실패", e);
        }
    }

    public void incrementClubDaily(
            String clubId,
            String clubName,
            LocalDate date,
            long detailViewDelta,
            long durationSecondsDelta,
            long durationCountDelta
    ) {
        if (clubId == null || clubId.isBlank() || date == null) {
            return;
        }
        if (!clubRepository.existsById(clubId)) {
            log.warn("존재하지 않는 동아리 통계 기록 skip. clubId={}", clubId);
            return;
        }
        incrementClubDailyWithoutExistenceCheck(
                clubId,
                clubName,
                date,
                detailViewDelta,
                durationSecondsDelta,
                durationCountDelta
        );
    }

    public void incrementClubDailyWithoutExistenceCheck(
            String clubId,
            String clubName,
            LocalDate date,
            long detailViewDelta,
            long durationSecondsDelta,
            long durationCountDelta
    ) {
        LocalDateTime now = LocalDateTime.now(AnalyticsTime.KST);
        Query query = Query.query(Criteria.where("date").is(date).and("clubId").is(clubId));
        Update update = new Update()
                .set("clubName", clubName == null ? "" : clubName)
                .inc("detailViewCount", detailViewDelta)
                .inc("detailDurationSumSeconds", durationSecondsDelta)
                .inc("detailDurationCount", durationCountDelta)
                .set("updatedAt", now)
                .setOnInsert("date", date)
                .setOnInsert("clubId", clubId)
                .setOnInsert("createdAt", now);
        mongoTemplate.upsert(query, update, "club_analytics_daily");
    }

    public void incrementKeywordDaily(String keyword, String normalizedKeyword, LocalDate date, long delta) {
        if (normalizedKeyword == null || normalizedKeyword.isBlank() || date == null) {
            return;
        }
        LocalDateTime now = LocalDateTime.now(AnalyticsTime.KST);
        Query query = Query.query(Criteria.where("date").is(date).and("normalizedKeyword").is(normalizedKeyword));
        Update update = new Update()
                .set("keyword", keyword == null ? normalizedKeyword : keyword)
                .inc("count", delta)
                .set("updatedAt", now)
                .setOnInsert("date", date)
                .setOnInsert("normalizedKeyword", normalizedKeyword)
                .setOnInsert("createdAt", now);
        mongoTemplate.upsert(query, update, "club_search_keyword_daily");
    }

    public String normalizeKeyword(String keyword) {
        if (keyword == null) {
            return null;
        }
        String normalized = keyword.trim().toLowerCase();
        return normalized.isBlank() ? null : normalized;
    }
}
