package moadong.calendar.custom.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import moadong.calendar.custom.payload.request.CustomCalendarEventRequest;
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
        customCalendarEventService = new CustomCalendarEventService(customCalendarEventRepository, clubRepository);
    }

    private void givenAuthenticatedClub() {
        when(user.getId()).thenReturn(USER_ID);
        when(club.getId()).thenReturn(CLUB_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.of(club));
    }

    @Test
    @DisplayName("커스텀 이벤트를 생성하면 source가 CUSTOM인 결과를 반환한다")
    void create_returnsCustomResult() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026-08-01", "2026-08-02", "https://example.com", "설명");
        when(customCalendarEventRepository.save(any(CustomCalendarEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ClubCalendarEventResult result = customCalendarEventService.create(user, request);

        assertThat(result.source()).isEqualTo("CUSTOM");
        assertThat(result.title()).isEqualTo("정기 모임");
        assertThat(result.start()).isEqualTo("2026-08-01");
        assertThat(result.end()).isEqualTo("2026-08-02");
    }

    @Test
    @DisplayName("clubId로 커스텀 이벤트 목록을 CUSTOM 결과로 매핑한다")
    void getClubCalendarEvents_mapsToCustomResults() {
        CustomCalendarEvent event = CustomCalendarEvent.builder()
                .id(EVENT_ID)
                .clubId(CLUB_ID)
                .title("정기 모임")
                .start("2026-08-01")
                .build();
        when(customCalendarEventRepository.findByClubId(CLUB_ID)).thenReturn(List.of(event));

        List<ClubCalendarEventResult> results = customCalendarEventService.getClubCalendarEvents(CLUB_ID);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(EVENT_ID);
        assertThat(results.get(0).source()).isEqualTo("CUSTOM");
    }

    @Test
    @DisplayName("clubId가 비어있으면 빈 리스트를 반환한다")
    void getClubCalendarEvents_blankClubId_returnsEmpty() {
        List<ClubCalendarEventResult> results = customCalendarEventService.getClubCalendarEvents(" ");

        assertThat(results).isEmpty();
    }

    @Test
    @DisplayName("다른 동아리의 이벤트를 수정하면 예외가 발생한다")
    void update_otherClubEvent_throwsNotFound() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "수정", "2026-08-01", null, null, null);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customCalendarEventService.update(user, EVENT_ID, request))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_NOT_FOUND);
    }

    @Test
    @DisplayName("커스텀 이벤트를 수정하면 변경된 값이 반영된다")
    void update_updatesFields() {
        givenAuthenticatedClub();
        CustomCalendarEvent event = CustomCalendarEvent.builder()
                .id(EVENT_ID)
                .clubId(CLUB_ID)
                .title("이전 제목")
                .start("2026-08-01")
                .build();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "새 제목", "2026-09-01", null, null, null);
        when(customCalendarEventRepository.findByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(Optional.of(event));
        when(customCalendarEventRepository.save(any(CustomCalendarEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ClubCalendarEventResult result = customCalendarEventService.update(user, EVENT_ID, request);

        assertThat(result.title()).isEqualTo("새 제목");
        assertThat(result.start()).isEqualTo("2026-09-01");
        assertThat(result.source()).isEqualTo("CUSTOM");
    }

    @Test
    @DisplayName("존재하지 않는 이벤트를 삭제하면 예외가 발생한다")
    void delete_notFound_throws() {
        givenAuthenticatedClub();
        when(customCalendarEventRepository.deleteByIdAndClubId(EVENT_ID, CLUB_ID)).thenReturn(0L);

        assertThatThrownBy(() -> customCalendarEventService.delete(user, EVENT_ID))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_NOT_FOUND);
    }

    @Test
    @DisplayName("start가 YYYY-MM-DD 형식이 아니면 예외가 발생한다")
    void create_invalidStartFormat_throws() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026/08/01", null, null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(user, request))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
    }

    @Test
    @DisplayName("end가 YYYY-MM-DD 형식이 아니면 예외가 발생한다")
    void create_invalidEndFormat_throws() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026-08-01", "08-02", null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(user, request))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_FORMAT);
    }

    @Test
    @DisplayName("start가 end보다 이후면 예외가 발생한다")
    void create_startAfterEnd_throws() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026-08-02", "2026-08-01", null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(user, request))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CUSTOM_EVENT_INVALID_DATE_RANGE);
    }

    @Test
    @DisplayName("start와 end가 같은 날짜면 정상 생성된다")
    void create_sameStartAndEnd_succeeds() {
        givenAuthenticatedClub();
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026-08-01", "2026-08-01", null, null);
        when(customCalendarEventRepository.save(any(CustomCalendarEvent.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ClubCalendarEventResult result = customCalendarEventService.create(user, request);

        assertThat(result.start()).isEqualTo("2026-08-01");
        assertThat(result.end()).isEqualTo("2026-08-01");
    }

    @Test
    @DisplayName("인증된 사용자에게 동아리가 없으면 예외가 발생한다")
    void create_noClub_throws() {
        when(user.getId()).thenReturn(USER_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.empty());
        CustomCalendarEventRequest request = new CustomCalendarEventRequest(
                "정기 모임", "2026-08-01", null, null, null);

        assertThatThrownBy(() -> customCalendarEventService.create(user, request))
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
