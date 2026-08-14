package moadong.analytics.service;

import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import moadong.analytics.payload.request.ClubDetailDurationRecordRequest;
import moadong.analytics.support.AnalyticsTime;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubDetailDurationService {

    private static final long MIN_DURATION_SECONDS = 1L;
    private static final long MAX_DURATION_SECONDS = 3600L;
    /** clubId는 24자 Mongo id, sessionId/visitorId는 36자 UUID이므로 64자면 충분하다. */
    private static final int MAX_ID_LENGTH = 64;
    private static final String RATE_LIMIT_KEY_PREFIX = "analytics:club-detail-duration:ratelimit:";
    private static final long RATE_LIMIT_WINDOW_SECONDS = 60L;
    private static final long RATE_LIMIT_MAX_REQUESTS = 120L;
    private static final RedisScript<Long> RATE_LIMIT_SCRIPT = RedisScript.of(
            "local c = redis.call('INCR', KEYS[1])\n" +
                    "if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end\n" +
                    "return c",
            Long.class
    );

    private final ClubAnalyticsRecordService clubAnalyticsRecordService;
    private final ClubRepository clubRepository;
    private final MongoTemplate mongoTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    @Transactional
    public void record(ClubDetailDurationRecordRequest request, String clientIp) {
        validate(request);
        validateRateLimit(request.clubId(), clientIp);
        Club club = clubRepository.findById(request.clubId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        LocalDate eventDate = eventDate(request.leftAt());
        LocalDateTime now = LocalDateTime.now(AnalyticsTime.KST);

        if (!insertSession(request, club, eventDate, now)) {
            return;
        }

        clubAnalyticsRecordService.recordDetailDuration(club.getId(), club.getName(), eventDate, request.durationSeconds());
        incrementVisitorDaily(club.getId(), request.visitorId(), eventDate, request.durationSeconds(), now);
    }

    private void validate(ClubDetailDurationRecordRequest request) {
        if (request == null
                || isInvalidId(request.clubId())
                || isInvalidId(request.sessionId())
                || isInvalidId(request.visitorId())
                || request.durationSeconds() == null
                || request.durationSeconds() < MIN_DURATION_SECONDS
                || request.durationSeconds() > MAX_DURATION_SECONDS) {
            throw new RestApiException(ErrorCode.STATISTICS_EVENT_INVALID);
        }
        if (request.enteredAt() != null
                && request.leftAt() != null
                && request.leftAt().isBefore(request.enteredAt())) {
            throw new RestApiException(ErrorCode.STATISTICS_EVENT_INVALID);
        }
    }

    private void validateRateLimit(String clubId, String clientIp) {
        Long requestCount = stringRedisTemplate.execute(
                RATE_LIMIT_SCRIPT,
                List.of(rateLimitKey(clubId, clientIp)),
                String.valueOf(RATE_LIMIT_WINDOW_SECONDS)
        );
        if (requestCount != null && requestCount > RATE_LIMIT_MAX_REQUESTS) {
            throw new RestApiException(ErrorCode.STATISTICS_EVENT_RATE_LIMITED);
        }
    }

    private String rateLimitKey(String clubId, String clientIp) {
        return RATE_LIMIT_KEY_PREFIX + clubId + ":" + (clientIp == null || clientIp.isBlank() ? "unknown" : clientIp);
    }

    private boolean insertSession(
            ClubDetailDurationRecordRequest request,
            Club club,
            LocalDate eventDate,
            LocalDateTime now
    ) {
        Query query = Query.query(
                Criteria.where("sessionId").is(request.sessionId())
                        .and("clubId").is(club.getId())
        );
        Update update = new Update()
                .setOnInsert("sessionId", request.sessionId())
                .setOnInsert("visitorId", request.visitorId())
                .setOnInsert("clubId", club.getId())
                .setOnInsert("clubName", club.getName())
                .setOnInsert("date", eventDate)
                .setOnInsert("enteredAt", request.enteredAt())
                .setOnInsert("leftAt", request.leftAt())
                .setOnInsert("durationSeconds", request.durationSeconds())
                .setOnInsert("createdAt", now);
        UpdateResult result = mongoTemplate.upsert(query, update, "club_detail_duration_sessions");
        return result.getUpsertedId() != null;
    }

    private void incrementVisitorDaily(
            String clubId,
            String visitorId,
            LocalDate date,
            long durationSeconds,
            LocalDateTime now
    ) {
        Query query = Query.query(
                Criteria.where("clubId").is(clubId)
                        .and("date").is(date)
                        .and("visitorId").is(visitorId)
        );
        Update update = new Update()
                .inc("durationSumSeconds", durationSeconds)
                .inc("sessionCount", 1)
                .set("updatedAt", now)
                .setOnInsert("clubId", clubId)
                .setOnInsert("date", date)
                .setOnInsert("visitorId", visitorId)
                .setOnInsert("createdAt", now);
        mongoTemplate.upsert(query, update, "club_detail_visitor_daily");
    }

    private LocalDate eventDate(Instant leftAt) {
        if (leftAt == null) {
            return AnalyticsTime.todayKst();
        }
        return leftAt.atZone(AnalyticsTime.KST).toLocalDate();
    }

    /**
     * 인증 없는 공개 API이므로 식별자 길이를 제한해 Redis 키와 Mongo 질의에 임의 길이 값이 들어가지 않게 한다.
     */
    private boolean isInvalidId(String value) {
        return value == null || value.isBlank() || value.length() > MAX_ID_LENGTH;
    }
}
