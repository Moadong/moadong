package moadong.club.service;

import moadong.club.entity.Club;
import moadong.club.enums.ClubState;
import moadong.club.payload.request.ClubStateUpdateRequest;
import moadong.club.repository.ClubRepository;
import moadong.fixture.UserFixture;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.bson.types.ObjectId;
import org.javers.core.Javers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@UnitTest
class ClubProfileServiceStateTest {

    @InjectMocks
    ClubProfileService clubProfileService;

    @Mock
    ClubRepository clubRepository;

    @Mock
    Javers javers;

    private final CustomUserDetails user = UserFixture.createUserDetails("developer");

    @Test
    void 동아리_상태를_요청한_값으로_바꾸고_감사로그를_남긴다() {
        String clubId = new ObjectId().toHexString();
        Club club = new Club(clubId, "owner");
        club.updateState(ClubState.AVAILABLE);
        when(clubRepository.findClubById(new ObjectId(clubId))).thenReturn(Optional.of(club));
        when(clubRepository.save(club)).thenReturn(club);

        clubProfileService.updateClubStateByClubId(
                clubId, new ClubStateUpdateRequest(ClubState.UNAVAILABLE), user);

        assertThat(club.getState()).isEqualTo(ClubState.UNAVAILABLE);
        verify(clubRepository).save(club);
        verify(javers).commit(user.getUsername(), club);
    }

    @Test
    void 없는_동아리면_CLUB_NOT_FOUND를_던지고_저장하지_않는다() {
        String clubId = new ObjectId().toHexString();
        when(clubRepository.findClubById(new ObjectId(clubId))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clubProfileService.updateClubStateByClubId(
                clubId, new ClubStateUpdateRequest(ClubState.AVAILABLE), user))
                .isInstanceOf(RestApiException.class)
                .extracting(e -> ((RestApiException) e).getErrorCode())
                .isEqualTo(ErrorCode.CLUB_NOT_FOUND);
        verify(clubRepository, never()).save(any());
    }
}
