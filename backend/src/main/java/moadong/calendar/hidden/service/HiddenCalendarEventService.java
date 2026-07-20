package moadong.calendar.hidden.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import moadong.calendar.hidden.entity.HiddenCalendarEvent;
import moadong.calendar.hidden.payload.dto.HiddenCalendarEventResult;
import moadong.calendar.hidden.repository.HiddenCalendarEventRepository;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class HiddenCalendarEventService {

    private static final Set<String> HIDEABLE_SOURCES = Set.of("GOOGLE", "NOTION");

    private final HiddenCalendarEventRepository hiddenCalendarEventRepository;
    private final ClubRepository clubRepository;

    public void hide(CustomUserDetails user, String source, String eventId) {
        String clubId = requireAuthenticatedClubId(user);
        validateSource(source);

        if (hiddenCalendarEventRepository.existsByClubIdAndSourceAndEventId(clubId, source, eventId)) {
            return;
        }

        hiddenCalendarEventRepository.save(HiddenCalendarEvent.builder()
                .clubId(clubId)
                .source(source)
                .eventId(eventId)
                .build());
    }

    public void unhide(CustomUserDetails user, String source, String eventId) {
        String clubId = requireAuthenticatedClubId(user);
        validateSource(source);

        hiddenCalendarEventRepository.deleteByClubIdAndSourceAndEventId(clubId, source, eventId);
    }

    public List<HiddenCalendarEventResult> list(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);

        return hiddenCalendarEventRepository.findByClubId(clubId).stream()
                .map(hidden -> new HiddenCalendarEventResult(hidden.getSource(), hidden.getEventId()))
                .toList();
    }

    public Set<String> getHiddenKeys(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return Set.of();
        }

        return hiddenCalendarEventRepository.findByClubId(clubId).stream()
                .map(hidden -> hidden.getSource() + ":" + hidden.getEventId())
                .collect(Collectors.toUnmodifiableSet());
    }

    private void validateSource(String source) {
        if (!HIDEABLE_SOURCES.contains(source)) {
            throw new RestApiException(ErrorCode.HIDDEN_EVENT_INVALID_SOURCE);
        }
    }

    private String requireAuthenticatedClubId(CustomUserDetails user) {
        if (user == null || !StringUtils.hasText(user.getId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.HIDDEN_EVENT_CLUB_NOT_FOUND));

        if (!StringUtils.hasText(club.getId())) {
            throw new RestApiException(ErrorCode.HIDDEN_EVENT_CLUB_NOT_FOUND);
        }
        return club.getId();
    }
}
