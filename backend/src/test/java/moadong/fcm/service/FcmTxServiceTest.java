package moadong.fcm.service;

import moadong.fcm.entity.FcmToken;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@IntegrationTest
@Transactional
class FcmTxServiceTest {

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private FcmTxService fcmTxService;
    
    FcmToken token;

    @BeforeEach
    void setUp() {
        token = FcmToken.builder()
                .token("token1")
                .build();
        fcmTokenRepository.save(token);
    }

    @Test
    @DisplayName("등록되지않은 토큰을 삭제한다.")
    void deleteUnregisteredToken_success() {
        // when
        fcmTxService.deleteUnregisteredFcmToken(token.getToken());

        // then
        assertThat(fcmTokenRepository.findFcmTokenByToken(token.getToken())).isEmpty();
    }
}