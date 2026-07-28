package moadong.calendar.custom.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import moadong.calendar.custom.entity.CustomEventRecurrence;
import moadong.calendar.custom.payload.request.CustomCalendarEventRequest;
import moadong.calendar.custom.payload.response.CustomCalendarEventResponse;
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

    private static final Set<String> EVENT_TYPES = Set.of("SINGLE", "PERIOD", "RECURRING", "MULTI");
    private static final Set<String> COLORS = Set.of("PINK", "YELLOW", "MINT", "BLUE", "PURPLE", "ORANGE");
    private static final Set<String> FREQUENCIES = Set.of("WEEKLY", "MONTHLY", "YEARLY");
    private static final Set<String> DELETE_SCOPES = Set.of("ALL", "THIS", "THIS_AND_FOLLOWING");
    private static final int MAX_EVENT_DATES = 365;

    private final CustomCalendarEventRepository customCalendarEventRepository;
    private final ClubRepository clubRepository;
    private final CustomEventOccurrenceExpander occurrenceExpander;

    public CustomCalendarEventResponse create(CustomUserDetails user, CustomCalendarEventRequest request) {
        String clubId = requireAuthenticatedClubId(user);
        String eventType = validateRequest(request);

        CustomCalendarEvent event = CustomCalendarEvent.builder()
                .clubId(clubId)
                .title(request.title())
                .start(request.start())
                .end(request.end())
                .url(request.url())
                .description(request.description())
                .eventType(eventType)
                .color(request.color())
                .dates(request.dates())
                .recurrence(request.recurrence())
                .updatedAt(LocalDateTime.now())
                .build();

        return CustomCalendarEventResponse.from(customCalendarEventRepository.save(event));
    }

    public List<CustomCalendarEventResponse> list(CustomUserDetails user) {
        String clubId = requireAuthenticatedClubId(user);

        return customCalendarEventRepository.findByClubId(clubId).stream()
                .map(CustomCalendarEventResponse::from)
                .toList();
    }

    public CustomCalendarEventResponse update(CustomUserDetails user, String eventId,
                                              CustomCalendarEventRequest request) {
        String clubId = requireAuthenticatedClubId(user);
        String eventType = validateRequest(request);

        CustomCalendarEvent event = customCalendarEventRepository.findByIdAndClubId(eventId, clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CUSTOM_EVENT_NOT_FOUND));

        event.update(request, eventType);

        return CustomCalendarEventResponse.from(customCalendarEventRepository.save(event));
    }

    public void delete(CustomUserDetails user, String eventId, String scope, String date) {
        String clubId = requireAuthenticatedClubId(user);
        String resolvedScope = resolveDeleteScope(scope);

        CustomCalendarEvent event = customCalendarEventRepository.findByIdAndClubId(eventId, clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CUSTOM_EVENT_NOT_FOUND));

        if ("ALL".equals(resolvedScope) || !isRecurring(event)) {
            customCalendarEventRepository.delete(event);
            return;
        }

        LocalDate targetDate = parseRequiredDate(date);

        if ("THIS".equals(resolvedScope)) {
            event.excludeDate(targetDate.toString());
            customCalendarEventRepository.save(event);
            return;
        }

        LocalDate newRecurrenceEnd = targetDate.minusDays(1);
        if (newRecurrenceEnd.isBefore(parseRequiredDate(event.getStart()))) {
            customCalendarEventRepository.delete(event);
            return;
        }

        event.updateRecurrenceEnd(newRecurrenceEnd.toString());
        customCalendarEventRepository.save(event);
    }

    public List<ClubCalendarEventResult> getClubCalendarEvents(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return List.of();
        }

        return customCalendarEventRepository.findByClubId(clubId).stream()
                .flatMap(event -> toPublicResults(event).stream())
                .toList();
    }

    public boolean hasCalendarConnection(String clubId) {
        if (!StringUtils.hasText(clubId)) {
            return false;
        }
        return customCalendarEventRepository.existsByClubId(clubId);
    }

    /**
     * 공개 캘린더는 발생일마다 하나씩 펼쳐 내려준다.
     * 단, PERIOD는 start/end를 가진 한 건으로 유지해 프론트가 연속 막대로 그릴 수 있게 한다.
     * 발생일이 여러 개면 프론트에서 구분할 수 있도록 id에 날짜를 덧붙인다.
     */
    private List<ClubCalendarEventResult> toPublicResults(CustomCalendarEvent event) {
        List<String> occurrences = occurrenceExpander.expand(event);

        if (occurrences.isEmpty()) {
            return List.of();
        }

        String eventType = StringUtils.hasText(event.getEventType()) ? event.getEventType() : "SINGLE";

        if (occurrences.size() == 1) {
            return List.of(ClubCalendarEventResult.ofCustom(
                    event.getId(),
                    event.getTitle(),
                    occurrences.get(0),
                    event.getEnd(),
                    event.getUrl(),
                    event.getDescription(),
                    eventType,
                    event.getColor()
            ));
        }

        return occurrences.stream()
                .map(date -> ClubCalendarEventResult.ofCustom(
                        event.getId() + ":" + date,
                        event.getTitle(),
                        date,
                        null,
                        event.getUrl(),
                        event.getDescription(),
                        eventType,
                        event.getColor()
                ))
                .toList();
    }

    private boolean isRecurring(CustomCalendarEvent event) {
        return "RECURRING".equals(event.getEventType()) && event.getRecurrence() != null;
    }

    private String resolveDeleteScope(String scope) {
        if (!StringUtils.hasText(scope)) {
            return "ALL";
        }
        if (!DELETE_SCOPES.contains(scope)) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DELETE_SCOPE);
        }
        return scope;
    }

    private String validateRequest(CustomCalendarEventRequest request) {
        LocalDate start = validateDates(request.start(), request.end());
        String eventType = resolveEventType(request.eventType());
        validateAllowedValue(request.color(), COLORS);
        validateUrl(request.url());

        validateCollectionSize(request.dates());
        if ("MULTI".equals(eventType) && (request.dates() == null || request.dates().isEmpty())) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }
        if (request.dates() != null) {
            request.dates().forEach(this::parseRequiredDate);
            if (!request.dates().isEmpty() && !request.start().equals(request.dates().get(0))) {
                throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
            }
        }

        CustomEventRecurrence recurrence = request.recurrence();
        if (recurrence == null) {
            if ("RECURRING".equals(eventType)) {
                throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
            }
            return eventType;
        }

        if (!"RECURRING".equals(eventType)) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }

        validateRequiredAllowedValue(recurrence.frequency(), FREQUENCIES);
        validateCollectionSize(recurrence.weekdays());
        validateWeekdays(recurrence.weekdays());

        if (StringUtils.hasText(recurrence.end())) {
            LocalDate recurrenceEnd = parseRequiredDate(recurrence.end());
            if (start.isAfter(recurrenceEnd)) {
                throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DATE_RANGE);
            }
        }
        if (recurrence.excludedDates() != null) {
            validateCollectionSize(recurrence.excludedDates());
            recurrence.excludedDates().forEach(this::parseRequiredDate);
        }
        return eventType;
    }

    private String resolveEventType(String eventType) {
        if (!StringUtils.hasText(eventType)) {
            return "SINGLE";
        }
        validateAllowedValue(eventType, EVENT_TYPES);
        return eventType;
    }

    private void validateAllowedValue(String value, Set<String> allowedValues) {
        if (StringUtils.hasText(value) && !allowedValues.contains(value)) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }
    }

    private void validateRequiredAllowedValue(String value, Set<String> allowedValues) {
        if (!StringUtils.hasText(value) || !allowedValues.contains(value)) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }
    }

    private void validateWeekdays(List<Integer> weekdays) {
        if (weekdays == null) {
            return;
        }
        boolean hasInvalidWeekday = weekdays.stream().anyMatch(weekday -> weekday == null || weekday < 0 || weekday > 6);
        if (hasInvalidWeekday) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }
    }

    private void validateCollectionSize(List<?> values) {
        if (values != null && values.size() > MAX_EVENT_DATES) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }
    }

    private void validateUrl(String url) {
        if (!StringUtils.hasText(url)) {
            return;
        }
        try {
            String scheme = new URI(url).getScheme();
            if (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme)) {
                throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
            }
        } catch (URISyntaxException e) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
        }
    }

    private LocalDate validateDates(String start, String end) {
        LocalDate parsedStart = parseRequiredDate(start);

        if (!StringUtils.hasText(end)) {
            return parsedStart;
        }

        if (parsedStart.isAfter(parseRequiredDate(end))) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DATE_RANGE);
        }
        return parsedStart;
    }

    private LocalDate parseRequiredDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
        }
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
