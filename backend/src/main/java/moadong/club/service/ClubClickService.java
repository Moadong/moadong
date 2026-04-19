package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubClickCount;
import moadong.club.payload.response.ClubClickRankingResponse;
import moadong.club.payload.response.ClubClickRankingResponse.ClubRankItem;
import moadong.club.payload.response.ClubClickResponse;
import moadong.club.repository.ClubClickCountRepository;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClubClickService {

    static final String WHITELIST_KEY = "club:whitelist";
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final String COOLDOWN_KEY_PREFIX = "game:cooldown:";
    private static final String RATE_LIMIT_KEY_PREFIX = "game:ratelimit:";
    private static final String BAN_KEY_PREFIX = "game:banned:";
    private static final long COOLDOWN_MILLIS = 50L;
    private static final long RATE_LIMIT_WINDOW_SECONDS = 10L;
    private static final long RATE_LIMIT_MAX_REQUESTS = 20L;
    private static final long BAN_DURATION_SECONDS = 30L;
    static final long MAX_CLICK_COUNT = 9_999_999_999L;

    private final StringRedisTemplate stringRedisTemplate;
    private final ClubRepository clubRepository;
    private final ClubClickCountRepository clickCountRepository;
    private final MongoTemplate mongoTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void initWhitelist() {
        refreshWhitelist();
    }

    public void refreshWhitelist() {
        List<String> names = clubRepository.findAll().stream()
                .map(Club::getName)
                .toList();
        stringRedisTemplate.delete(WHITELIST_KEY);
        if (!names.isEmpty()) {
            stringRedisTemplate.opsForSet().add(WHITELIST_KEY, names.toArray(String[]::new));
        }
        log.info("동아리 화이트리스트 갱신 완료 ({}개)", names.size());
    }

    public ClubClickResponse recordClick(String clubName, int count, String clientIp) {
        if (count < 1 || count > 5) {
            throw new RestApiException(ErrorCode.CLICK_COUNT_INVALID);
        }

        String banKey = BAN_KEY_PREFIX + clientIp;
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(banKey))) {
            throw new RestApiException(ErrorCode.CLICK_RATE_LIMITED);
        }

        String rateLimitKey = RATE_LIMIT_KEY_PREFIX + clientIp;
        Long requestCount = stringRedisTemplate.opsForValue().increment(rateLimitKey);
        if (requestCount != null && requestCount == 1) {
            stringRedisTemplate.expire(rateLimitKey, Duration.ofSeconds(RATE_LIMIT_WINDOW_SECONDS));
        }
        if (requestCount != null && requestCount > RATE_LIMIT_MAX_REQUESTS) {
            stringRedisTemplate.opsForValue().set(banKey, "1", Duration.ofSeconds(BAN_DURATION_SECONDS));
            throw new RestApiException(ErrorCode.CLICK_RATE_LIMITED);
        }

        String cooldownKey = COOLDOWN_KEY_PREFIX + clientIp;
        Boolean isNew = stringRedisTemplate.opsForValue()
                .setIfAbsent(cooldownKey, "1", Duration.ofMillis(COOLDOWN_MILLIS));
        if (Boolean.FALSE.equals(isNew)) {
            throw new RestApiException(ErrorCode.CLICK_COOLDOWN);
        }

        Boolean isMember = stringRedisTemplate.opsForSet().isMember(WHITELIST_KEY, clubName);
        if (!Boolean.TRUE.equals(isMember)) {
            throw new RestApiException(ErrorCode.CLUB_NOT_FOUND);
        }

        Query query = new Query(Criteria.where("clubName").is(clubName));
        Update update = new Update()
                .inc("clickCount", count)
                .setOnInsert("clubName", clubName);
        FindAndModifyOptions options = FindAndModifyOptions.options().upsert(true).returnNew(true);
        ClubClickCount result = mongoTemplate.findAndModify(query, update, options, ClubClickCount.class);

        long clickCount = result != null ? Math.min(result.getClickCount(), MAX_CLICK_COUNT) : (long) count;
        return new ClubClickResponse(clubName, clickCount);
    }

    public ClubClickRankingResponse getRanking() {
        List<ClubClickCount> all = clickCountRepository.findAllByOrderByClickCountDesc();
        AtomicInteger rank = new AtomicInteger(1);
        List<ClubRankItem> ranked = all.stream()
                .map(c -> new ClubRankItem(rank.getAndIncrement(), c.getClubName(), c.getClickCount()))
                .toList();
        return new ClubClickRankingResponse(ranked, nextMondayMidnightKst());
    }

    public void resetWeeklyClicks() {
        clickCountRepository.deleteAll();
        log.info("동아리 클릭 수 주간 초기화 완료");
    }

    public String nextMondayMidnightKst() {
        ZonedDateTime now = ZonedDateTime.now(KST);
        int daysUntilMonday = (DayOfWeek.MONDAY.getValue() - now.getDayOfWeek().getValue() + 7) % 7;
        if (daysUntilMonday == 0) daysUntilMonday = 7;
        ZonedDateTime nextMonday = now.toLocalDate().plusDays(daysUntilMonday).atStartOfDay(KST);
        return nextMonday.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
