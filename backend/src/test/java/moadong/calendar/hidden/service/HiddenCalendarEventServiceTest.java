package moadong.calendar.hidden.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import moadong.calendar.hidden.entity.HiddenCalendarEvent;
import moadong.calendar.hidden.payload.dto.HiddenCalendarEventResult;
import moadong.calendar.hidden.repository.HiddenCalendarEventRepository;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.dao.DuplicateKeyException;

@UnitTest
class HiddenCalendarEventServiceTest {

    @Mock
    private HiddenCalendarEventRepository hiddenCalendarEventRepository;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private CustomUserDetails user;

    @Mock
    private Club club;

    private HiddenCalendarEventService hiddenCalendarEventService;

    private static final String USER_ID = "test-user-id";
    private static final String CLUB_ID = "test-club-id";
    private static final String EVENT_ID = "google-event-1";

    @BeforeEach
    void setUp() {
        hiddenCalendarEventService = new HiddenCalendarEventService(hiddenCalendarEventRepository, clubRepository);
    }

    private void givenAuthenticatedClub() {
        when(user.getId()).thenReturn(USER_ID);
        when(club.getId()).thenReturn(CLUB_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.of(club));
    }

    @Test
    @DisplayName("GOOGLE 이벤트를 숨김 처리하면 저장된다")
    void hide_savesHiddenEvent() {
        givenAuthenticatedClub();
        when(hiddenCalendarEventRepository.existsByClubIdAndSourceAndEventId(CLUB_ID, "GOOGLE", EVENT_ID))
                .thenReturn(false);

        hiddenCalendarEventService.hide(user, "GOOGLE", EVENT_ID);

        verify(hiddenCalendarEventRepository).save(any(HiddenCalendarEvent.class));
    }

    @Test
    @DisplayName("이미 숨김 처리된 이벤트는 다시 저장하지 않는다")
    void hide_alreadyHidden_isIdempotent() {
        givenAuthenticatedClub();
        when(hiddenCalendarEventRepository.existsByClubIdAndSourceAndEventId(CLUB_ID, "GOOGLE", EVENT_ID))
                .thenReturn(true);

        hiddenCalendarEventService.hide(user, "GOOGLE", EVENT_ID);

        verify(hiddenCalendarEventRepository, never()).save(any(HiddenCalendarEvent.class));
    }

    @Test
    @DisplayName("동시 요청으로 인한 중복 저장은 멱등적으로 처리한다")
    void hide_duplicateKey_isIdempotent() {
        givenAuthenticatedClub();
        when(hiddenCalendarEventRepository.existsByClubIdAndSourceAndEventId(CLUB_ID, "GOOGLE", EVENT_ID))
                .thenReturn(false);
        when(hiddenCalendarEventRepository.save(any(HiddenCalendarEvent.class)))
                .thenThrow(new DuplicateKeyException("duplicate"));

        hiddenCalendarEventService.hide(user, "GOOGLE", EVENT_ID);

        verify(hiddenCalendarEventRepository).save(any(HiddenCalendarEvent.class));
    }

    @Test
    @DisplayName("GOOGLE/NOTION이 아닌 source는 예외가 발생한다")
    void hide_invalidSource_throws() {
        givenAuthenticatedClub();

        assertThatThrownBy(() -> hiddenCalendarEventService.hide(user, "CUSTOM", EVENT_ID))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.HIDDEN_EVENT_INVALID_SOURCE);
    }

    @Test
    @DisplayName("숨김 해제 시 삭제를 호출한다")
    void unhide_deletesHiddenEvent() {
        givenAuthenticatedClub();

        hiddenCalendarEventService.unhide(user, "NOTION", EVENT_ID);

        verify(hiddenCalendarEventRepository).deleteByClubIdAndSourceAndEventId(CLUB_ID, "NOTION", EVENT_ID);
    }

    @Test
    @DisplayName("숨김 목록을 source:eventId 키 집합으로 반환한다")
    void getHiddenKeys_returnsKeySet() {
        HiddenCalendarEvent hidden = HiddenCalendarEvent.builder()
                .clubId(CLUB_ID)
                .source("GOOGLE")
                .eventId(EVENT_ID)
                .build();
        when(hiddenCalendarEventRepository.findByClubId(CLUB_ID)).thenReturn(List.of(hidden));

        Set<String> keys = hiddenCalendarEventService.getHiddenKeys(CLUB_ID);

        assertThat(keys).containsExactly("GOOGLE:" + EVENT_ID);
    }

    @Test
    @DisplayName("clubId가 비어있으면 빈 집합을 반환한다")
    void getHiddenKeys_blankClubId_returnsEmpty() {
        assertThat(hiddenCalendarEventService.getHiddenKeys(" ")).isEmpty();
    }

    @Test
    @DisplayName("숨김 목록 조회는 source/eventId 형태로 매핑된다")
    void list_mapsToResults() {
        givenAuthenticatedClub();
        HiddenCalendarEvent hidden = HiddenCalendarEvent.builder()
                .clubId(CLUB_ID)
                .source("NOTION")
                .eventId(EVENT_ID)
                .build();
        when(hiddenCalendarEventRepository.findByClubId(CLUB_ID)).thenReturn(List.of(hidden));

        List<HiddenCalendarEventResult> results = hiddenCalendarEventService.list(user);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).source()).isEqualTo("NOTION");
        assertThat(results.get(0).eventId()).isEqualTo(EVENT_ID);
    }

    @Test
    @DisplayName("인증된 사용자에게 동아리가 없으면 예외가 발생한다")
    void hide_noClub_throws() {
        when(user.getId()).thenReturn(USER_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> hiddenCalendarEventService.hide(user, "GOOGLE", EVENT_ID))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.HIDDEN_EVENT_CLUB_NOT_FOUND);
    }
}
