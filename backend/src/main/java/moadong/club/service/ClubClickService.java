package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.payload.response.ClubClickRankingResponse;
import moadong.club.payload.response.ClubClickRankingResponse.ClubRankItem;
import moadong.club.payload.response.ClubClickResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

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
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final StringRedisTemplate stringRedisTemplate;

    public ClubClickResponse recordClick(String clubName) {
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
