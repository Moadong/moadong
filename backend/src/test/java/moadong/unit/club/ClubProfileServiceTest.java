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

}
