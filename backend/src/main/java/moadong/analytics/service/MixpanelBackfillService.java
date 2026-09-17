package moadong.analytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.analytics.config.MixpanelProperties;
import moadong.analytics.entity.MixpanelBackfilledEvent;
import moadong.analytics.entity.MixpanelFunnelEvent;
import moadong.analytics.payload.dto.MixpanelRawEvent;
import moadong.analytics.payload.response.MixpanelBackfillResponse;
import moadong.analytics.repository.MixpanelBackfilledEventRepository;
import moadong.analytics.repository.MixpanelFunnelEventRepository;
import moadong.analytics.support.AnalyticsDateRangeValidator;
import moadong.analytics.support.AnalyticsTime;
import moadong.analytics.support.FunnelDefinitions;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MixpanelBackfillService {

    private static final long MAX_DURATION_SECONDS = 3600L;

    private final MixpanelExportClient mixpanelExportClient;
    private final MixpanelBackfilledEventRepository mixpanelBackfilledEventRepository;
    private final MixpanelFunnelEventRepository mixpanelFunnelEventRepository;
    private final ClubAnalyticsRecordService clubAnalyticsRecordService;
    private final ClubRepository clubRepository;
    private final MixpanelProperties mixpanelProperties;

    public MixpanelBackfillResponse backfill(LocalDate from, LocalDate to) {
        if (!mixpanelProperties.enabled()) {
            throw new RestApiException(ErrorCode.MIXPANEL_EXPORT_FAILED);
        }
        int maxRangeDays = mixpanelProperties.backfill() == null
                ? 31
                : mixpanelProperties.backfill().effectiveMaxRangeDays();
        AnalyticsDateRangeValidator.validateBackfillRange(from, to, maxRangeDays);

        ClubNameIndex clubNameIndex = buildClubNameIndex();
        int fetched = 0;
        int processed = 0;
        int duplicated = 0;
        int skipped = 0;

        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {
            List<MixpanelRawEvent> events = mixpanelExportClient.fetchEvents(date);
            fetched += events.size();

            for (MixpanelRawEvent event : events) {
                if (event == null || event.event() == null) {
                    skipped++;
                    continue;
                }
                LocalDate eventDate = eventDate(event);
                if (eventDate == null || !eventDate.equals(date)) {
                    skipped++;
                    continue;
                }
                String backfillKey = backfillKey(event);
                if (!markBackfilled(backfillKey, event, eventDate)) {
                    duplicated++;
                    continue;
                }
                try {
                    if (processEvent(event, backfillKey, eventDate, clubNameIndex)) {
                        processed++;
                    } else {
                        mixpanelBackfilledEventRepository.deleteById(backfillKey);
                        skipped++;
                    }
                } catch (Exception e) {
                    mixpanelBackfilledEventRepository.deleteById(backfillKey);
                    log.error("Mixpanel backfill 이벤트 처리 실패. eventName={}, eventDate={}",
                            event.event(), eventDate, e);
                    throw e;
                }
            }
        }

        return new MixpanelBackfillResponse(from, to, fetched, processed, duplicated, skipped);
    }

    private boolean processEvent(MixpanelRawEvent event, String backfillKey, LocalDate eventDate,
                                 ClubNameIndex clubNameIndex) {
        // 퍼널 저장과 동아리 통계는 독립이다. ClubDetailPage Visited처럼 둘 다 해당하는 이벤트는 둘 다 수행한다.
        boolean storedFunnel = FunnelDefinitions.isFunnelEvent(event.event())
                && storeFunnelEvent(event, backfillKey, eventDate);
        boolean processedClubStatistics = switch (event.event()) {
            case "ClubDetailPage Visited" -> processDetailView(event, eventDate, clubNameIndex);
            case "ClubDetailPage Duration" -> processDetailDuration(event, eventDate, clubNameIndex);
            case "Search Executed" -> processSearch(event, eventDate);
            default -> false;
        };
        return storedFunnel || processedClubStatistics;
    }

    private boolean storeFunnelEvent(MixpanelRawEvent event, String backfillKey, LocalDate eventDate) {
        String distinctId = stringProperty(event, "distinct_id");
        Long time = longProperty(event, "time");
        if (distinctId == null || distinctId.isBlank() || time == null) {
            return false;
        }
        Long depthPercent = longProperty(event, "depth_percent");
        // save(upsert): 이전 실행이 dedup 키 롤백 전에 죽어 문서만 남았어도 같은 @Id로 덮어써 중복이 생기지 않는다.
        mixpanelFunnelEventRepository.save(MixpanelFunnelEvent.builder()
                .insertId(backfillKey)
                .distinctId(distinctId)
                .eventName(event.event())
                .eventTime(AnalyticsTime.toKstDateTimeFromEpochSeconds(time))
                .eventDate(eventDate)
                .page(stringProperty(event, "page"))
                .depthPercent(depthPercent == null ? null : depthPercent.intValue())
                .build());
        return true;
    }

    private boolean processDetailView(MixpanelRawEvent event, LocalDate eventDate, ClubNameIndex clubNameIndex) {
        Club club = findClubByEventClubName(event, clubNameIndex);
        if (club == null) {
            return false;
        }
        clubAnalyticsRecordService.incrementClubDailyWithoutExistenceCheck(
                club.getId(),
                club.getName(),
                eventDate,
                1,
                0,
                0
        );
        return true;
    }

    private boolean processDetailDuration(MixpanelRawEvent event, LocalDate eventDate, ClubNameIndex clubNameIndex) {
        Club club = findClubByEventClubName(event, clubNameIndex);
        Long durationSeconds = longProperty(event, "duration_seconds");
        if (club == null || durationSeconds == null || durationSeconds < 0 || durationSeconds > MAX_DURATION_SECONDS) {
            return false;
        }
        clubAnalyticsRecordService.incrementClubDailyWithoutExistenceCheck(
                club.getId(),
                club.getName(),
                eventDate,
                0,
                durationSeconds,
                1
        );
        return true;
    }

    private boolean processSearch(MixpanelRawEvent event, LocalDate eventDate) {
        String keyword = stringProperty(event, "inputValue");
        String normalizedKeyword = clubAnalyticsRecordService.normalizeKeyword(keyword);
        if (normalizedKeyword == null) {
            return false;
        }
        clubAnalyticsRecordService.incrementKeywordDaily(keyword.trim(), normalizedKeyword, eventDate, 1);
        return true;
    }

    private Club findClubByEventClubName(MixpanelRawEvent event, ClubNameIndex clubNameIndex) {
        String clubName = stringProperty(event, "clubName");
        if (clubName == null || clubName.isBlank()) {
            return null;
        }
        if (clubNameIndex.ambiguousNames().contains(clubName)) {
            log.warn("Mixpanel backfill clubName 중복으로 skip. clubName={}", clubName);
            return null;
        }
        Club club = clubNameIndex.clubByName().get(clubName);
        if (club == null) {
            log.warn("Mixpanel backfill clubName 매핑 실패. clubName={}", clubName);
        }
        return club;
    }

    private boolean markBackfilled(String backfillKey, MixpanelRawEvent event, LocalDate eventDate) {
        try {
            mixpanelBackfilledEventRepository.insert(MixpanelBackfilledEvent.builder()
                    .insertId(backfillKey)
                    .eventName(event.event())
                    .eventDate(eventDate)
                    .backfilledAt(LocalDateTime.now(AnalyticsTime.KST))
                    .build());
            return true;
        } catch (DuplicateKeyException e) {
            return false;
        }
    }

    private String backfillKey(MixpanelRawEvent event) {
        String insertId = stringProperty(event, "$insert_id");
        if (insertId != null && !insertId.isBlank()) {
            return insertId;
        }
        return String.join(":",
                Optional.ofNullable(event.event()).orElse(""),
                Optional.ofNullable(stringProperty(event, "distinct_id")).orElse(""),
                Optional.ofNullable(longProperty(event, "time")).map(String::valueOf).orElse(""),
                Optional.ofNullable(stringProperty(event, "url")).orElse("")
        );
    }

    private LocalDate eventDate(MixpanelRawEvent event) {
        Long time = longProperty(event, "time");
        if (time == null) {
            return null;
        }
        return AnalyticsTime.toKstDateFromEpochSeconds(time);
    }

    private String stringProperty(MixpanelRawEvent event, String key) {
        Object value = event.properties() == null ? null : event.properties().get(key);
        return value == null ? null : String.valueOf(value);
    }

    private Long longProperty(MixpanelRawEvent event, String key) {
        Object value = event.properties() == null ? null : event.properties().get(key);
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String string && !string.isBlank()) {
            try {
                return Long.parseLong(string);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private ClubNameIndex buildClubNameIndex() {
        List<Club> clubs = clubRepository.findAll();
        Map<String, List<Club>> grouped = clubs.stream()
                .filter(club -> club.getName() != null && !club.getName().isBlank())
                .collect(Collectors.groupingBy(Club::getName));
        Set<String> ambiguousNames = grouped.entrySet().stream()
                .filter(entry -> entry.getValue().size() > 1)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
        Map<String, Club> clubByName = grouped.entrySet().stream()
                .filter(entry -> entry.getValue().size() == 1)
                .map(entry -> entry.getValue().get(0))
                .collect(Collectors.toMap(Club::getName, Function.identity()));
        return new ClubNameIndex(clubByName, ambiguousNames);
    }

    private record ClubNameIndex(Map<String, Club> clubByName, Set<String> ambiguousNames) {
    }
}
