package moadong.calendar.custom.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import moadong.calendar.custom.payload.request.CustomCalendarEventRequest;
import moadong.calendar.custom.repository.CustomCalendarEventRepository;
import moadong.club.entity.Club;
import moadong.club.payload.dto.ClubCalendarEventResult;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class CustomCalendarEventService {

    private final CustomCalendarEventRepository customCalendarEventRepository;
    private final ClubRepository clubRepository;

    public ClubCalendarEventResult create(CustomUserDetails user, CustomCalendarEventRequest request) {
        String clubId = requireAuthenticatedClubId(user);
        validateDates(request.start(), request.end());

        CustomCalendarEvent event = CustomCalendarEvent.builder()
                .clubId(clubId)
                .title(request.title())
                .start(request.start())
                .end(request.end())
                .url(request.url())
                .description(request.description())
                .updatedAt(LocalDateTime.now())
                .build();

        return toResult(customCalendarEventRepository.save(event));
    }

    public List<ClubCalendarEventResult> list(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);
        return getClubCalendarEvents(clubId);
    }

    public ClubCalendarEventResult update(CustomUserDetails user, String eventId, CustomCalendarEventRequest request) {
        String clubId = requireAuthenticatedClubId(user);
        validateDates(request.start(), request.end());

        CustomCalendarEvent event = customCalendarEventRepository.findByIdAndClubId(eventId, clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CUSTOM_EVENT_NOT_FOUND));

        event.update(request.title(), request.start(), request.end(), request.url(), request.description());

        return toResult(customCalendarEventRepository.save(event));
    }

    public void delete(CustomUserDetails user, String eventId) {
        String clubId = requireAuthenticatedClubId(user);

        long deletedCount = customCalendarEventRepository.deleteByIdAndClubId(eventId, clubId);
        if (deletedCount == 0) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_NOT_FOUND);
        }
    }

    public List<ClubCalendarEventResult> getClubCalendarEvents(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return List.of();
        }

        return customCalendarEventRepository.findByClubId(clubId).stream()
                .map(this::toResult)
                .toList();
    }

    public boolean hasCalendarConnection(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return false;
        }
        return customCalendarEventRepository.existsByClubId(clubId);
    }

    private void validateDates(String start, String end) {
        LocalDate parsedStart;
        try {
            parsedStart = LocalDate.parse(start);
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
        }

        if (!StringUtils.hasText(end)) {
            return;
        }

        LocalDate parsedEnd;
        try {
            parsedEnd = LocalDate.parse(end);
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
        }

        if (parsedStart.isAfter(parsedEnd)) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DATE_RANGE);
        }
    }

    private ClubCalendarEventResult toResult(CustomCalendarEvent event) {
        return ClubCalendarEventResult.ofCustom(
                event.getId(),
                event.getTitle(),
                event.getStart(),
                event.getEnd(),
                event.getUrl(),
                event.getDescription()
        );
    }

    private String requireAuthenticatedClubId(CustomUserDetails user) {
        if (user == null || !StringUtils.hasText(user.getId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CUSTOM_EVENT_CLUB_NOT_FOUND));

        if (!StringUtils.hasText(club.getId())) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_CLUB_NOT_FOUND);
        }
        return club.getId();
    }
}
