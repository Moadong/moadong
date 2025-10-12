package moadong.fcm.service;

import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.global.AsyncTest;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@IntegrationTest
@Import(AsyncTest.class)
class FcmServiceTest {

    @Autowired
    private FcmService fcmService;

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private ClubRepository clubRepository;

    private Club club1, club2, club3;

    @BeforeEach
    void setUp() {
        club1 = clubRepository.save(Club.builder().name("club1").build());
        club2 = clubRepository.save(Club.builder().name("club2").build());
        club3 = clubRepository.save(Club.builder().name("club3").build());
    }

    @AfterEach
    void tearDown() {
        fcmTokenRepository.deleteAll();
        clubRepository.deleteAll(List.of(club1, club2, club3));
    }

    @Test
    @DisplayName("새로운 Fcm 토큰을 저장한다.")
    void saveFcmToken_whenNewToken_thenSaveNewToken() {
        // given
        String token = "new_token";

        // when
        fcmService.saveFcmToken(token);

        // then
        FcmToken savedToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow();
        assertThat(savedToken.getToken()).isEqualTo(token);
    }

    @Test
    @DisplayName("기존 Fcm 토큰의 타임스탬프를 업데이트한다.")
    void saveFcmToken_whenExistingToken_thenUpdateTimestamp() {
        // given
        String token = "existing_token";
        FcmToken existingToken = fcmTokenRepository.save(FcmToken.builder().token(token).build());
        LocalDateTime initialUpdatedAt = existingToken.getTimestamp();

        // when
        fcmService.saveFcmToken(token);

        // then
        FcmToken updatedToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow();
        assertThat(updatedToken.getTimestamp()).isAfter(initialUpdatedAt);
    }

    @Test
    @DisplayName("구독 동아리 목록 업데이트 시 Fcm 토큰이 없으면 예외가 발생한다.")
    void subscribeClubs_whenTokenNotFound_thenThrowException() {
        // given
        String token = "non_existing_token";
        ArrayList<String> clubIds = new ArrayList<>();

        // when, then
        assertThatThrownBy(() -> fcmService.subscribeClubs(token, clubIds))
                .isInstanceOf(RestApiException.class);
    }

    @Test
    @DisplayName("구독 동아리 목록 업데이트 시 동아리가 없으면 예외가 발생한다.")
    void subscribeClubs_whenClubNotFound_thenThrowException() {
        // given
        String token = "existing_token";
        fcmTokenRepository.save(FcmToken.builder()
                .token(token)
                .clubIds(List.of(club1.getId(), club2.getId()))
                .build());
        ArrayList<String> newClubIds = new ArrayList<>(List.of(club1.getId(), "non_existing_club"));

        // when, then
        assertThatThrownBy(() -> fcmService.subscribeClubs(token, newClubIds))
                .isInstanceOf(RestApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.CLUB_NOT_FOUND);
    }

    @Test
    @DisplayName("구독 동아리 목록을 성공적으로 업데이트한다.")
    void subscribeClubs_success() {
        // given
        String token = "existing_token";
        List<String> oldClubIds = List.of(club1.getId(), club2.getId());
        ArrayList<String> newClubIds = new ArrayList<>(List.of(club2.getId(), club3.getId()));

        fcmTokenRepository.save(FcmToken.builder()
                .token(token)
                .clubIds(oldClubIds)
                .build());

        // when
        fcmService.subscribeClubs(token, newClubIds);

        // then
        FcmToken updatedToken = fcmTokenRepository.findFcmTokenByToken(token).orElseThrow();
        assertThat(updatedToken.getClubIds()).containsExactlyInAnyOrderElementsOf(newClubIds);
    }

    @Test
    @DisplayName("구독 동아리 목록 조회 시 Fcm 토큰이 없으면 예외가 발생한다.")
    void getSubscribeClubs_whenTokenNotFound_thenThrowException() {
        // given
        String token = "non_existing_token";

        // when, then
        assertThatThrownBy(() -> fcmService.getSubscribeClubs(token))
                .isInstanceOf(RestApiException.class);
    }

    @Test
    @DisplayName("구독 동아리 목록을 성공적으로 조회한다.")
    void getSubscribeClubs_success() {
        // given
        String token = "existing_token";
        List<String> clubIds = List.of(club1.getId(), club2.getId());
        fcmTokenRepository.save(FcmToken.builder()
                .token(token)
                .clubIds(clubIds)
                .build());

        // when
        ClubSubscribeListResponse response = fcmService.getSubscribeClubs(token);

        // then
        assertThat(response.clubIds()).isEqualTo(clubIds);
    }
}