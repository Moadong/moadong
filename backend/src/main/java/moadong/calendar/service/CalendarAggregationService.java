package moadong.calendar.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

        return allEvents.stream()
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

        return hasNotion || hasGoogle;
    }
}
