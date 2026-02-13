package moadong.club.service;

import moadong.club.entity.Club;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubSearchRepository;
import moadong.club.util.RecruitmentStateCalculator;
import moadong.club.util.RecruitmentStateNotificationBuilder;
import moadong.fixture.ClubRequestFixture;
import moadong.fixture.UserFixture;
import moadong.fcm.model.PushPayload;
import moadong.fcm.port.PushNotificationPort;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.javers.core.Javers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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

    @Mock
    RecruitmentStateCalculator recruitmentStateCalculator;

    @Mock
    RecruitmentStateNotificationBuilder recruitmentStateNotificationBuilder;

    @Mock
    PushNotificationPort pushNotificationPort;

    @Mock
    Javers javers;

    @DisplayName("모집글 수정 시 최근 업데이트 일자를 보여준다")
    @Test
    void 모집글_수정_시_최근_업데이트_일자를_보여줘야한다(){
        //GIVEN
        ClubRecruitmentInfoUpdateRequest request = ClubRequestFixture.defaultRequest();
        CustomUserDetails customUserDetails = UserFixture.createUserDetails("test");
        Club club = new Club();
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.of(club));
        when(recruitmentStateCalculator.calculate(any(), any(), any())).thenReturn(false);

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

    @DisplayName("모집 상태 변경이 있어도 sendNotification=false면 알림을 보내지 않는다")
    @Test
    void 모집글_수정시_sendNotification_false이면_알림을_보내지_않는다() {
        ClubRecruitmentInfoUpdateRequest request = new ClubRecruitmentInfoUpdateRequest(
                Instant.now(),
                Instant.now().plusSeconds(3600),
                "테스트 대상",
                "https://fake-url.com",
                false
        );
        CustomUserDetails customUserDetails = UserFixture.createUserDetails("test");
        Club club = new Club();
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.of(club));
        when(recruitmentStateCalculator.calculate(any(), any(), any())).thenReturn(true);

        clubProfileService.updateClubRecruitmentInfo(request, customUserDetails);

        verify(pushNotificationPort, never()).send(any());
    }

    @DisplayName("모집 상태 변경이 있고 sendNotification=true면 알림을 보낸다")
    @Test
    void 모집글_수정시_sendNotification_true이면_알림을_보낸다() {
        ClubRecruitmentInfoUpdateRequest request = new ClubRecruitmentInfoUpdateRequest(
                Instant.now(),
                Instant.now().plusSeconds(3600),
                "테스트 대상",
                "https://fake-url.com",
                true
        );
        CustomUserDetails customUserDetails = UserFixture.createUserDetails("test");
        Club club = new Club();
        PushPayload payload = new PushPayload("title", "body", "topic", Map.of("clubId", "1"));
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.of(club));
        when(recruitmentStateCalculator.calculate(any(), any(), any())).thenReturn(true);
        when(recruitmentStateNotificationBuilder.build(any(), any())).thenReturn(payload);

        clubProfileService.updateClubRecruitmentInfo(request, customUserDetails);

        verify(pushNotificationPort).send(payload);
    }
}
