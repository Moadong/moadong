package moadong.club.service;

import io.github.artsok.RepeatedIfExceptionsTest;
import moadong.club.entity.Club;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.repository.ClubRepository;
import moadong.fixture.ClubRequestFixture;
import moadong.fixture.UserFixture;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.User;
import moadong.user.payload.CustomUserDetails;
import moadong.user.repository.UserRepository;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@IntegrationTest
@AutoConfigureMockMvc
public class ClubProfileServiceTest {
    @Autowired
    private ClubProfileService clubProfileService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private CustomUserDetails userDetails;
    private String clubId;

    @BeforeEach
    void setUp() {
        if (userRepository.findUserByUserId(UserFixture.collectUserId).isEmpty()) {
            userRepository.save(UserFixture.createUser(passwordEncoder));
        }
        User user = userRepository.findUserByUserId(UserFixture.collectUserId).get();
        this.userDetails = new CustomUserDetails(user);

        // Club이 없으면 생성
        if (clubRepository.findClubByUserId(user.getId()).isEmpty()) {
            Club club = new Club(user.getId());
            clubRepository.save(club);
            this.clubId = club.getId();
        } else {
            Club club = clubRepository.findClubByUserId(user.getId()).get();
            this.clubId = club.getId();
        }
    }

    @AfterEach
    void tearDown() {
        // 테스트용 Club 삭제
        if (clubId != null) {
            clubRepository.deleteById(clubId);
        }
    }

    @DisplayName("여러 스레드에서 동시에 수정 요청 시, 한 번만 성공하고 나머지는 실패해야 한다")
    @RepeatedIfExceptionsTest(repeats = 3, exceptions = org.opentest4j.AssertionFailedError.class)
    void 낙관적_락_테스트_시에_1개만_동작해야한다() throws InterruptedException {
        // GIVEN
        int numberOfThreads = 4;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads); // 모든 스레드의 종료를 기다리기 위함
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads); // 모든 스레드의 동시 시작을 위함 [11][12]

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);
        AtomicInteger notFoundCount = new AtomicInteger(0);

        // WHEN: 여러 스레드에서 동시에 업데이트 시도
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    ClubInfoRequest request = ClubRequestFixture.createValidClubInfoRequest();
                    barrier.await();

                    clubProfileService.updateClubInfo(request, userDetails);
                    successCount.incrementAndGet();
                } catch (OptimisticLockingFailureException e) {
                    // 버전 충돌 발생 시
                    conflictCount.incrementAndGet();
                } catch (DataAccessException e) {
                    if (e.getMessage() != null && e.getMessage().contains("WriteConflict")) {
                        conflictCount.incrementAndGet();
                    } else {
                        e.printStackTrace();
                    }
                } catch (RestApiException e) {
                    if (e.getErrorCode() == ErrorCode.CLUB_NOT_FOUND) {
                        notFoundCount.incrementAndGet();
                    } else {
                        e.printStackTrace();
                    }
                } catch (InterruptedException | BrokenBarrierException e) {
                    Thread.currentThread().interrupt();
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await(); // 모든 스레드가 작업을 마칠 때까지 대기
        executorService.shutdown();

        // THEN: 정확히 하나의 스레드만 성공하고, 나머지는 모두 충돌 예외를 받아야 함
        assertEquals(1, successCount.get(), "성공한 요청은 1개여야 합니다.");
        assertEquals(numberOfThreads - 1, conflictCount.get(), "실패(충돌)한 요청은 " + (numberOfThreads - 1) + "개여야 합니다.");
        assertEquals(0, notFoundCount.get(), "CLUB_NOT_FOUND 예외는 발생하지 않아야 합니다.");
    }
}
