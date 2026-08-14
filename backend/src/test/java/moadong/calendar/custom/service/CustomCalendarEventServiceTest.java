package moadong.calendar.custom.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Collections;
import java.util.Optional;
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
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;

@UnitTest
class CustomCalendarEventServiceTest {

    @Mock
    private CustomCalendarEventRepository customCalendarEventRepository;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private CustomUserDetails user;

    @Mock
    private Club club;

    private CustomCalendarEventService customCalendarEventService;

    private static final String USER_ID = "test-user-id";
    private static final String CLUB_ID = "test-club-id";
    private static final String EVENT_ID = "test-event-id";

    @BeforeEach
    void setUp() {
        customCalendarEventService = new CustomCalendarEventService(
                customCalendarEventRepository, clubRepository, new CustomEventOccurrenceExpander());
    }

    private void givenAuthenticatedClub() {
        when(user.getId()).thenReturn(USER_ID);
        when(club.getId()).thenReturn(CLUB_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.of(club));
    }

    private void givenSaveReturnsArgument() {
        when(customCalendarEventRepository.save(any(CustomCalendarEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    private CustomCalendarEventRequest request(String start, String end, String eventType, String color,
                                               List<String> dates, CustomEventRecurrence recurrence) {
        return new CustomCalendarEventRequest("정기 모임", start, end, null, null, eventType, color, dates, recurrence);
    }

    private CustomCalendarEvent storedEvent(String eventType, String start, String end,
                                            List<String> dates, CustomEventRecurrence recurrence) {
        return CustomCalendarEvent.builder()
                .id(EVENT_ID)
                .clubId(CLUB_ID)
                .title("정기 모임")
                .start(start)
                .end(end)
                .eventType(eventType)
                .color("MINT")
                .dates(dates)
                .recurrence(recurrence)
                .build();
    }

    @Test
    @DisplayName("SINGLE 이벤트를 생성하면 source가 CUSTOM인 결과를 반환한다")
    void create_single() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();

        CustomCalendarEventResponse response = customCalendarEventService.create(
                user, request("2026-08-01", null, "SINGLE", "PINK", null, null));

        assertThat(response.source()).isEqualTo("CUSTOM");
        assertThat(response.eventType()).isEqualTo("SINGLE");
        assertThat(response.color()).isEqualTo("PINK");
        assertThat(response.start()).isEqualTo("2026-08-01");
    }

    @Test
    @DisplayName("eventType이 없으면 SINGLE로 저장하고 반환한다")
    void create_withoutEventType_defaultsToSingle() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();

        CustomCalendarEventResponse response = customCalendarEventService.create(
                user, request("2026-08-01", null, null, null, null, null));

        assertThat(response.eventType()).isEqualTo("SINGLE");
    }

    @Test
    @DisplayName("PERIOD 이벤트를 생성하면 start/end가 그대로 저장된다")
    void create_period() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();

        CustomCalendarEventResponse response = customCalendarEventService.create(
                user, request("2026-08-01", "2026-08-05", "PERIOD", "MINT", null, null));

        assertThat(response.eventType()).isEqualTo("PERIOD");
        assertThat(response.start()).isEqualTo("2026-08-01");
        assertThat(response.end()).isEqualTo("2026-08-05");
    }

    @Test
    @DisplayName("MULTI 이벤트를 생성하면 dates가 그대로 저장된다")
    void create_multi() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();
        List<String> dates = List.of("2026-08-01", "2026-08-10");

        CustomCalendarEventResponse response = customCalendarEventService.create(
                user, request("2026-08-01", null, "MULTI", "BLUE", dates, null));

        assertThat(response.eventType()).isEqualTo("MULTI");
        assertThat(response.dates()).containsExactlyElementsOf(dates);
    }

    @Test
    @DisplayName("RECURRING 이벤트를 생성하면 recurrence가 그대로 저장된다")
    void create_recurring() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();
        CustomEventRecurrence recurrence =
                new CustomEventRecurrence("WEEKLY", List.of(5, 6), "2026-09-30", List.of("2026-08-15"));

        CustomCalendarEventResponse response = customCalendarEventService.create(
                user, request("2026-08-01", null, "RECURRING", "PURPLE", null, recurrence));

        assertThat(response.eventType()).isEqualTo("RECURRING");
        assertThat(response.recurrence().frequency()).isEqualTo("WEEKLY");
        assertThat(response.recurrence().weekdays()).containsExactly(5, 6);
        assertThat(response.recurrence().end()).isEqualTo("2026-09-30");
        assertThat(response.recurrence().excludedDates()).containsExactly("2026-08-15");
    }

    @Test
    @DisplayName("허용되지 않은 eventType이면 예외가 발생한다")
    void create_invalidEventType_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "DAILY", null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("허용되지 않은 color면 예외가 발생한다")
    void create_invalidColor_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "SINGLE", "RED", null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("허용되지 않은 반복 주기면 예외가 발생한다")
    void create_invalidFrequency_throws() {
        givenAuthenticatedClub();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("DAILY", null, null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "RECURRING", null, null, recurrence)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("WEEKLY weekdays가 0에서 6 범위를 벗어나면 예외가 발생한다")
    void create_invalidWeekday_throws() {
        givenAuthenticatedClub();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("WEEKLY", List.of(7), null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "RECURRING", null, null, recurrence)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("RECURRING 이벤트에 recurrence가 없으면 예외가 발생한다")
    void create_recurringWithoutRecurrence_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "RECURRING", null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("반복 종료일이 시작일보다 앞이면 예외가 발생한다")
    void create_recurrenceEndBeforeStart_throws() {
        givenAuthenticatedClub();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("MONTHLY", null, "2026-07-31", null);

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "RECURRING", null, null, recurrence)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_RANGE);
    }

    @Test
    @DisplayName("MULTI 일정의 start는 dates 첫 날짜와 같아야 한다")
    void create_multiStartMustMatchFirstDate_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "MULTI", null, List.of("2026-08-02"), null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("MULTI 일정에 dates가 없으면 예외가 발생한다")
    void create_multiWithoutDates_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "MULTI", null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("위험한 URL 스킴은 예외가 발생한다")
    void create_unsafeUrl_throws() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026-08-01", null, "javascript:alert(1)", null,
                "SINGLE", null, null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(user, request))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("날짜 배열이 365개를 초과하면 예외가 발생한다")
    void create_tooManyDates_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "MULTI", null,
                        Collections.nCopies(366, "2026-08-01"), null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_FIELD_VALUE);
    }

    @Test
    @DisplayName("dates에 잘못된 날짜 형식이 있으면 예외가 발생한다")
    void create_invalidDatesFormat_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, "MULTI", null, List.of("2026/08/10"), null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
    }

    @Test
    @DisplayName("start가 YYYY-MM-DD 형식이 아니면 예외가 발생한다")
    void create_invalidStartFormat_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026/08/01", null, null, null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
    }

    @Test
    @DisplayName("start가 end보다 이후면 예외가 발생한다")
    void create_startAfterEnd_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-02", "2026-08-01", null, null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_RANGE);
    }

    @Test
    @DisplayName("관리자 목록 조회는 전개하지 않고 원형을 반환한다")
    void list_returnsRawEvents() {
        givenAuthenticatedClub();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("WEEKLY", null, "2026-03-31", null);
        when(customCalendarEventRepository.findByClubId(CLUB_ID))
                .thenReturn(List.of(storedEvent("RECURRING", "2026-03-06", null, null, recurrence)));

        List<CustomCalendarEventResponse> results = customCalendarEventService.list(user);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(EVENT_ID);
        assertThat(results.get(0).start()).isEqualTo("2026-03-06");
        assertThat(results.get(0).recurrence().frequency()).isEqualTo("WEEKLY");
    }

    @Test
    @DisplayName("이벤트를 수정하면 확장 필드까지 갱신된다")
    void update_updatesExtendedFields() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID))
                .thenReturn(Optional.of(storedEvent("SINGLE", "2026-08-01", null, null, null)));
        List<String> dates = List.of("2026-09-01", "2026-09-02");

        CustomCalendarEventResponse response = customCalendarEventService.update(
                user, EVENT_ID, request("2026-09-01", null, "MULTI", "ORANGE", dates, null));

        assertThat(response.eventType()).isEqualTo("MULTI");
        assertThat(response.color()).isEqualTo("ORANGE");
        assertThat(response.dates()).containsExactlyElementsOf(dates);
    }

    @Test
    @DisplayName("다른 동아리의 이벤트를 수정하면 예외가 발생한다")
    void update_otherClubEvent_throwsNotFound() {
        givenAuthenticatedClub();
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customCalendarEventService.update(
                user, EVENT_ID, request("2026-08-01", null, null, null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_NOT_FOUND);
    }

    @Test
    @DisplayName("scope가 없으면 이벤트를 삭제한다")
    void delete_withoutScope_deletesEvent() {
        givenAuthenticatedClub();
        CustomCalendarEvent event = storedEvent("SINGLE", "2026-08-01", null, null, null);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));

        customCalendarEventService.delete(user, EVENT_ID, null, null);

        verify(customCalendarEventRepository).delete(event);
    }

    @Test
    @DisplayName("THIS 스코프는 해당 발생일을 excludedDates에 추가한다")
    void delete_thisScope_addsExcludedDate() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("WEEKLY", null, "2026-03-31", null);
        CustomCalendarEvent event = storedEvent("RECURRING", "2026-03-06", null, null, recurrence);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));

        customCalendarEventService.delete(user, EVENT_ID, "THIS", "2026-03-13");

        ArgumentCaptor<CustomCalendarEvent> captor = ArgumentCaptor.forClass(CustomCalendarEvent.class);
        verify(customCalendarEventRepository).save(captor.capture());
        verify(customCalendarEventRepository, never()).delete(any(CustomCalendarEvent.class));
        assertThat(captor.getValue().getRecurrence().excludedDates()).containsExactly("2026-03-13");
    }

    @Test
    @DisplayName("THIS_AND_FOLLOWING 스코프는 반복 종료일을 기준일 하루 전으로 당긴다")
    void delete_thisAndFollowingScope_truncatesRecurrenceEnd() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("WEEKLY", null, "2026-03-31", null);
        CustomCalendarEvent event = storedEvent("RECURRING", "2026-03-06", null, null, recurrence);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));

        customCalendarEventService.delete(user, EVENT_ID, "THIS_AND_FOLLOWING", "2026-03-20");

        ArgumentCaptor<CustomCalendarEvent> captor = ArgumentCaptor.forClass(CustomCalendarEvent.class);
        verify(customCalendarEventRepository).save(captor.capture());
        assertThat(captor.getValue().getRecurrence().end()).isEqualTo("2026-03-19");
    }

    @Test
    @DisplayName("THIS_AND_FOLLOWING 기준일이 기존 종료일보다 뒤면 종료일을 연장하지 않는다")
    void delete_thisAndFollowingAfterRecurrenceEnd_keepsRecurrenceEnd() {
        givenAuthenticatedClub();
        givenSaveReturnsArgument();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("WEEKLY", null, "2026-03-31", null);
        CustomCalendarEvent event = storedEvent("RECURRING", "2026-03-06", null, null, recurrence);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));

        customCalendarEventService.delete(user, EVENT_ID, "THIS_AND_FOLLOWING", "2027-01-01");

        ArgumentCaptor<CustomCalendarEvent> captor = ArgumentCaptor.forClass(CustomCalendarEvent.class);
        verify(customCalendarEventRepository).save(captor.capture());
        assertThat(captor.getValue().getRecurrence().end()).isEqualTo("2026-03-31");
    }

    @Test
    @DisplayName("THIS_AND_FOLLOWING 기준일이 시작일이면 이벤트를 삭제한다")
    void delete_thisAndFollowingFromStart_deletesEvent() {
        givenAuthenticatedClub();
        CustomEventRecurrence recurrence = new CustomEventRecurrence("WEEKLY", null, "2026-03-31", null);
        CustomCalendarEvent event = storedEvent("RECURRING", "2026-03-06", null, null, recurrence);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));

        customCalendarEventService.delete(user, EVENT_ID, "THIS_AND_FOLLOWING", "2026-03-06");

        verify(customCalendarEventRepository).delete(event);
        verify(customCalendarEventRepository, never()).save(any(CustomCalendarEvent.class));
    }

    @Test
    @DisplayName("반복이 아닌 일정은 THIS 스코프여도 삭제한다")
    void delete_nonRecurringWithScope_deletesEvent() {
        givenAuthenticatedClub();
        CustomCalendarEvent event = storedEvent("PERIOD", "2026-08-01", "2026-08-05", null, null);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));

        customCalendarEventService.delete(user, EVENT_ID, "THIS", "2026-08-03");

        verify(customCalendarEventRepository).delete(event);
    }

    @Test
    @DisplayName("허용되지 않은 삭제 스코프면 예외가 발생한다")
    void delete_invalidScope_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> customCalendarEventService.delete(user, EVENT_ID, "ONLY_ONE", "2026-08-01"))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DELETE_SCOPE);
    }

    @Test
    @DisplayName("존재하지 않는 이벤트를 삭제하면 예외가 발생한다")
    void delete_notFound_throws() {
        givenAuthenticatedClub();
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customCalendarEventService.delete(user, EVENT_ID, null, null))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_NOT_FOUND);
    }

    @Test
    @DisplayName("공개 캘린더 조회는 발생일마다 하나씩 펼쳐서 반환한다")
    void getClubCalendarEvents_expandsOccurrences() {
        List<String> dates = List.of("2026-08-01", "2026-08-02", "2026-08-03");
        when(customCalendarEventRepository.findByClubId(CLUB_ID))
                .thenReturn(List.of(storedEvent("MULTI", "2026-08-01", null, dates, null)));

        List<ClubCalendarEventResult> results = customCalendarEventService.getClubCalendarEvents(CLUB_ID);

        assertThat(results).hasSize(3);
        assertThat(results).extracting(ClubCalendarEventResult::start)
                .containsExactlyElementsOf(dates);
        assertThat(results).extracting(ClubCalendarEventResult::id)
                .containsExactly(EVENT_ID + ":2026-08-01", EVENT_ID + ":2026-08-02", EVENT_ID + ":2026-08-03");
        assertThat(results).allSatisfy(result -> {
            assertThat(result.source()).isEqualTo("CUSTOM");
            assertThat(result.eventType()).isEqualTo("MULTI");
            assertThat(result.color()).isEqualTo("MINT");
        });
    }

    @Test
    @DisplayName("PERIOD는 전개하지 않고 start/end를 가진 한 건으로 반환한다")
    void getClubCalendarEvents_periodIsNotExpanded() {
        when(customCalendarEventRepository.findByClubId(CLUB_ID))
                .thenReturn(List.of(storedEvent("PERIOD", "2026-03-16", "2026-03-20", null, null)));

        List<ClubCalendarEventResult> results = customCalendarEventService.getClubCalendarEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(EVENT_ID);
        assertThat(results.get(0).start()).isEqualTo("2026-03-16");
        assertThat(results.get(0).end()).isEqualTo("2026-03-20");
        assertThat(results.get(0).eventType()).isEqualTo("PERIOD");
        assertThat(results.get(0).color()).isEqualTo("MINT");
    }

    @Test
    @DisplayName("eventType이 없는 이벤트는 SINGLE로 내려준다")
    void getClubCalendarEvents_nullEventTypeDefaultsToSingle() {
        when(customCalendarEventRepository.findByClubId(CLUB_ID))
                .thenReturn(List.of(storedEvent(null, "2026-08-01", null, null, null)));

        List<ClubCalendarEventResult> results = customCalendarEventService.getClubCalendarEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).eventType()).isEqualTo("SINGLE");
    }

    @Test
    @DisplayName("발생일이 하나면 원래 id와 end를 유지한다")
    void getClubCalendarEvents_singleOccurrenceKeepsId() {
        when(customCalendarEventRepository.findByClubId(CLUB_ID))
                .thenReturn(List.of(storedEvent("SINGLE", "2026-08-01", "2026-08-05", null, null)));

        List<ClubCalendarEventResult> results = customCalendarEventService.getClubCalendarEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(EVENT_ID);
        assertThat(results.get(0).end()).isEqualTo("2026-08-05");
    }

    @Test
    @DisplayName("clubId가 비어있으면 빈 리스트를 반환한다")
    void getClubCalendarEvents_blankClubId_returnsEmpty() {
        assertThat(customCalendarEventService.getClubCalendarEvents(" ")).isEmpty();
    }

    @Test
    @DisplayName("인증된 사용자에게 동아리가 없으면 예외가 발생한다")
    void create_noClub_throws() {
        when(user.getId()).thenReturn(USER_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customCalendarEventService.create(
                user, request("2026-08-01", null, null, null, null, null)))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_CLUB_NOT_FOUND);
    }

    @Test
    @DisplayName("이벤트가 존재하면 hasCalendarConnection이 true를 반환한다")
    void hasCalendarConnection_eventsExist_returnsTrue() {
        when(customCalendarEventRepository.existsByClubId(CLUB_ID)).thenReturn(true);

        assertThat(customCalendarEventService.hasCalendarConnection(CLUB_ID)).isTrue();
    }
}
