package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.payload.response.ClubClickRankingResponse;
import moadong.club.payload.response.ClubClickRankingResponse.ClubRankItem;
import moadong.club.payload.response.ClubClickResponse;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClubClickService {

    static final String CLICK_KEY_PREFIX = "club:click:";
    static final String CLICK_KEY_PATTERN = CLICK_KEY_PREFIX + "*";
    static final String WHITELIST_KEY = "club:whitelist";
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private static final String COOLDOWN_KEY_PREFIX = "game:cooldown:";
    private static final long COOLDOWN_MILLIS = 200L;

    private final StringRedisTemplate stringRedisTemplate;
    private final ClubRepository clubRepository;

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

    public ClubClickResponse recordClick(String clubName, String clientIp) {
        Boolean isMember = stringRedisTemplate.opsForSet().isMember(WHITELIST_KEY, clubName);
        if (!Boolean.TRUE.equals(isMember)) {
            throw new RestApiException(ErrorCode.CLUB_NOT_FOUND);
        }

        String cooldownKey = COOLDOWN_KEY_PREFIX + clientIp;
        Boolean isNew = stringRedisTemplate.opsForValue()
                .setIfAbsent(cooldownKey, "1", Duration.ofMillis(COOLDOWN_MILLIS));
        if (Boolean.FALSE.equals(isNew)) {
            throw new RestApiException(ErrorCode.CLICK_COOLDOWN);
        }

        String key = CLICK_KEY_PREFIX + clubName;
        Long clickCount = stringRedisTemplate.opsForValue().increment(key);
        return new ClubClickResponse(clubName, clickCount != null ? clickCount : 0L);
    }

    public ClubClickRankingResponse getRanking() {
        Set<String> keys = stringRedisTemplate.keys(CLICK_KEY_PATTERN);
        List<ClubRankItem> ranked = new ArrayList<>();

        if (keys != null && !keys.isEmpty()) {
            List<ClubRankItem> unsorted = new ArrayList<>();
            for (String key : keys) {
                String clubName = key.substring(CLICK_KEY_PREFIX.length());
                String raw = stringRedisTemplate.opsForValue().get(key);
                long count = raw != null ? Long.parseLong(raw) : 0L;
                unsorted.add(new ClubRankItem(0, clubName, count));
            }

            unsorted.sort(Comparator.comparingLong(ClubRankItem::clickCount).reversed());

            AtomicInteger rank = new AtomicInteger(1);
            for (ClubRankItem item : unsorted) {
                ranked.add(new ClubRankItem(rank.getAndIncrement(), item.clubName(), item.clickCount()));
            }
        }

        return new ClubClickRankingResponse(ranked, nextMidnightKst());
    }

    public String nextMidnightKst() {
        ZonedDateTime nextMidnight = ZonedDateTime.now(KST)
                .toLocalDate()
                .plusDays(1)
                .atStartOfDay(KST);
        return nextMidnight.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
