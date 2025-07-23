package moadong.unit.club;

import static moadong.fixture.UserFixture.createUserDetails;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.repository.ClubRepository;
import moadong.club.service.ClubProfileService;
import moadong.fixture.ClubRequestFixture;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

@UnitTest
public class ClubProfileServiceTest {

    private final String clubId = "club_123";
    private final String userId = "user_456";
    @Mock
    private ClubRepository clubRepository;
    @InjectMocks
    private ClubProfileService clubProfileService;

    @Test
    void 정상적으로_클럽_약력을_업데이트한다() {
        // Given
        ClubInfoRequest request = ClubRequestFixture.createValidClubInfoRequest();
        CustomUserDetails user = createUserDetails(userId);
        Club mockClub = mock(Club.class);

        when(clubRepository.findClubByUserId(userId)).thenReturn(Optional.of(mockClub));

        // When
        clubProfileService.updateClubInfo(request, user);

        // Then
        verify(mockClub).update(request);
        verify(clubRepository).save(mockClub);
    }

    @Test
    void 계정의_클럽이_없을_땐_클럽_약력_업데이트가_실패한다() {
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.empty());
        assertThrows(RestApiException.class,
            () -> clubProfileService.updateClubInfo(ClubRequestFixture.createValidClubInfoRequest(),
                createUserDetails(userId)));
    }

//    ToDo: 시간 계산법을 LocalDateTime에서 Instant로 변경 후에 활성화할 것
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
