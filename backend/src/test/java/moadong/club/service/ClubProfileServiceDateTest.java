package moadong.club.service;

import moadong.club.entity.Club;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubSearchRepository;
import moadong.club.util.RecruitmentStateCalculator;
import moadong.fixture.ClubRequestFixture;
import moadong.fixture.UserFixture;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;


import java.time.LocalDateTime;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@UnitTest
public class ClubProfileServiceDateTest {

    @InjectMocks
    ClubProfileService clubProfileService;

    @Mock
    ClubRepository clubRepository;

    @Mock
    ClubSearchRepository clubSearchRepository;

    @DisplayName("모집글 수정 시 최근 업데이트 일자를 보여준다")
    @Test
    void 모집글_수정_시_최근_업데이트_일자를_보여줘야한다(){
        //GIVEN
        ClubRecruitmentInfoUpdateRequest request = ClubRequestFixture.defaultRequest();
        CustomUserDetails customUserDetails = UserFixture.createUserDetails("test");
        Club club = new Club();
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.of(club));
        //updateClubRecruitmentInfo의 RecruitmentStateCalculator 무시
        try (var mocked = Mockito.mockStatic(RecruitmentStateCalculator.class)) {
            mocked.when(() ->
                    RecruitmentStateCalculator.calculate(
                            Mockito.any(moadong.club.entity.Club.class),
                            Mockito.any(java.time.ZonedDateTime.class),
                            Mockito.any(java.time.ZonedDateTime.class)
                    )
            ).thenAnswer(inv -> null);

            //WHEN
            clubProfileService.updateClubRecruitmentInfo(request, customUserDetails);

            //THEN
            assertNotNull(club.getClubRecruitmentInformation().getLastModifiedDate());
            //1초 전후 차이로 살펴보기
            LocalDateTime now = LocalDateTime.now();
            assertTrue(club.getClubRecruitmentInformation().
                    getLastModifiedDate().isAfter(now.minusSeconds(1)));
            assertTrue(club.getClubRecruitmentInformation().
                    getLastModifiedDate().isBefore(now.plusSeconds(1)));
        }
    }
}
