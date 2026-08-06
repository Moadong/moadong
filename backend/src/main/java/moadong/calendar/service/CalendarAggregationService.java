package moadong.calendar.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.calendar.custom.service.CustomCalendarEventService;
import moadong.calendar.hidden.service.HiddenCalendarEventService;
import moadong.calendar.google.service.GoogleOAuthService;
import moadong.calendar.notion.service.NotionOAuthService;
import moadong.club.payload.dto.ClubCalendarEventResult;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Slf4j
@RequiredArgsConstructor
public class CalendarAggregationService {

    private final NotionOAuthService notionOAuthService;
    private final GoogleOAuthService googleOAuthService;
    private final CustomCalendarEventService customCalendarEventService;
    private final HiddenCalendarEventService hiddenCalendarEventService;

    public List<ClubCalendarEventResult> getAggregatedEvents(String clubId) {
        List<ClubCalendarEventResult> allEvents = new ArrayList<>();

        try {
            List<ClubCalendarEventResult> notionEvents = notionOAuthService.getClubCalendarEvents(clubId);
            allEvents.addAll(notionEvents);
            log.debug("Notion 이벤트 조회 성공. clubId={}, count={}", clubId, notionEvents.size());
        } catch (Exception e) {
            log.warn("Notion 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
        }

        try {
            List<ClubCalendarEventResult> googleEvents = googleOAuthService.getClubCalendarEvents(clubId);
            allEvents.addAll(googleEvents);
            log.debug("Google 이벤트 조회 성공. clubId={}, count={}", clubId, googleEvents.size());
        } catch (Exception e) {
            log.warn("Google 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
        }

        try {
            List<ClubCalendarEventResult> customEvents = customCalendarEventService.getClubCalendarEvents(clubId);
            allEvents.addAll(customEvents);
            log.debug("커스텀 이벤트 조회 성공. clubId={}, count={}", clubId, customEvents.size());
        } catch (Exception e) {
            log.warn("커스텀 이벤트 조회 실패. clubId={}, message={}", clubId, e.getMessage());
        }

        Set<String> hiddenKeys = Set.of();
        try {
            hiddenKeys = hiddenCalendarEventService.getHiddenKeys(clubId);
        } catch (Exception e) {
            log.warn("숨김 이벤트 목록 조회 실패. clubId={}, message={}", clubId, e.getMessage());
        }
        final Set<String> resolvedHiddenKeys = hiddenKeys;

        return allEvents.stream()
                .filter(event -> !resolvedHiddenKeys.contains(event.source() + ":" + event.id()))
                .sorted(Comparator.comparing(
                        ClubCalendarEventResult::start,
                        Comparator.nullsLast(String::compareTo)
                ))
                .toList();
    }

    public boolean hasAnyCalendarConnection(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return false;
        }

        boolean hasNotion = false;
        boolean hasGoogle = false;
        boolean hasCustom = false;

        try {
            hasNotion = notionOAuthService.hasCalendarConnection(clubId);
        } catch (Exception e) {
            log.debug("Notion 연결 상태 확인 실패. clubId={}", clubId);
        }

        try {
            hasGoogle = googleOAuthService.hasCalendarConnection(clubId);
        } catch (Exception e) {
            log.debug("Google 연결 상태 확인 실패. clubId={}", clubId);
        }

        try {
            hasCustom = customCalendarEventService.hasCalendarConnection(clubId);
        } catch (Exception e) {
            log.debug("커스텀 이벤트 상태 확인 실패. clubId={}", clubId);
        }

        return hasNotion || hasGoogle || hasCustom;
    }
}
