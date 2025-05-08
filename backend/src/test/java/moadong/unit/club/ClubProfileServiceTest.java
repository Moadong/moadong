package moadong.unit.club;

import moadong.club.entity.Club;
import moadong.club.payload.request.ClubCreateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.repository.ClubRepository;
import moadong.club.service.ClubProfileService;
import moadong.club.service.RecruitmentScheduler;
import moadong.fixture.ClubFixture;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.Optional;

import static moadong.fixture.UserFixture.createUserDetails;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@UnitTest
public class ClubProfileServiceTest {
    private final String clubId = "club_123";
    private final String userId = "user_456";
    @Mock
    private ClubRepository clubRepository;
    @Mock
    private RecruitmentScheduler recruitmentScheduler;
    @InjectMocks
    private ClubProfileService clubProfileService;

    @Test
    public void 정상적으로_클럽을_생성한다() {
        // Given
        ClubCreateRequest request = new ClubCreateRequest("테스트", "카테고리", "분과");
        when(clubRepository.save(any())).thenReturn(mock(Club.class));

        // When
        clubProfileService.createClub(request);

        // Then
        verify(clubRepository, times(1)).save(any(Club.class));
    }

    @Test
    void 정상적으로_클럽_약력을_업데이트한다() {
        // Given
        ClubInfoRequest request = ClubFixture.createValidClubInfoRequest();
        CustomUserDetails user = createUserDetails(userId);
        Club mockClub = mock(Club.class);

        when(clubRepository.findById(clubId)).thenReturn(Optional.of(mockClub));
        when(mockClub.getUserId()).thenReturn(userId);

        // When
        clubProfileService.updateClubInfo(request, user);

        // Then
        verify(mockClub).update(request);
        verify(clubRepository).save(mockClub);
    }

    @Test
    void 클럽이_없을_땐_클럽_약력_업데이트가_실패한다() {
        when(clubRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(RestApiException.class,
                () -> clubProfileService.updateClubInfo(ClubFixture.createValidClubInfoRequest(), createUserDetails(userId)));
    }

    @Test
    void 권한이_없는_클럽은_클럽_약력_업데이트_할_수_없다() {
        Club mockClub = mock(Club.class);
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(mockClub));
        when(mockClub.getUserId()).thenReturn("different_user");

        assertThrows(RestApiException.class,
                () -> clubProfileService.updateClubInfo(ClubFixture.createValidClubInfoRequest(), createUserDetails(userId)));
    }


    //ToDo: 시간 계산법을 LocalDateTime에서 Instant로 변경 후에 활성화할 것
//    @Test
//    void updateClubRecruitmentInfo_WithDates_SchedulesRecruitment() {
//        // Given
//        Instant start = Instant.now().plus(1, ChronoUnit.DAYS);
//        Instant end = Instant.now().plus(7,ChronoUnit.DAYS);
//        ClubRecruitmentInfoUpdateRequest request = new ClubRecruitmentInfoUpdateRequest(
//               "testId",start,end,"모집대상테스트","테스트용 설명" );
//        Club mockClub = mock(Club.class);
//
//        when(clubRepository.findById(clubId)).thenReturn(Optional.of(mockClub));
//        when(mockClub.getUserId()).thenReturn(userId);
//
//        // When
//        clubProfileService.updateClubRecruitmentInfo(request, createUserDetails(userId));
//
//        // Then
//        verify(recruitmentScheduler).scheduleRecruitment(clubId, start, end);
//        verify(mockClub).update(request);
//    }
//
//    @Test
//    void updateClubRecruitmentInfo_NoDates_NoScheduling() {
//        // Given
//        ClubRecruitmentInfoUpdateRequest request = new ClubRecruitmentInfoUpdateRequest(
//                clubId, null, null, /* other fields */);
//
//        // When
//        clubProfileService.updateClubRecruitmentInfo(request, createUserDetails(userId));
//
//        // Then
//        verifyNoInteractions(recruitmentScheduler);
//    }

}
