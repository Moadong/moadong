package moadong.club.service;

import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.repository.ClubRepository;
import moadong.fixture.ClubRequestFixture;
import moadong.fixture.UserFixture;
import moadong.user.entity.User;
import moadong.user.payload.CustomUserDetails;
import moadong.user.repository.UserRepository;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@IntegrationTest
public class ClubProfileServiceTest {
    @Autowired
    private ClubProfileService clubProfileService;
    @Autowired
    private UserRepository userRepository;
    private CustomUserDetails userDetails;

    @BeforeEach
    void setUp() {
        User user = userRepository.findUserByUserId(UserFixture.collectUserId).get();
        userDetails = new CustomUserDetails(user);
    }

    @Test
    @DisplayName("여러 스레드에서 동시에 수정 요청 시, 한 번만 성공하고 나머지는 실패해야 한다")
    void optimistic_lock_multi_thread_test() throws InterruptedException {
        // GIVEN: @BeforeEach에서 이미 데이터 준비가 완료됨
        int numberOfThreads = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        // WHEN: 여러 스레드에서 동시에 업데이트 시도
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    ClubInfoRequest request = ClubRequestFixture.createValidClubInfoRequest();
                    clubProfileService.updateClubInfo(request, userDetails);
                    successCount.incrementAndGet();
                } catch (OptimisticLockingFailureException e) {
                    conflictCount.incrementAndGet();
                } catch (DataAccessException e) {
                    // WriteConflict 후 재시도 끝에 OptimisticLock으로 변환되지 못한 경우
                    // 이 경우도 충돌로 간주할 수 있음
                    if (e.getMessage().contains("WriteConflict")) {
                        conflictCount.incrementAndGet();
                    } else {
                        e.printStackTrace();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        executorService.shutdown();

        // THEN: 정확히 하나의 스레드만 성공하고, 나머지는 모두 충돌 예외를 받아야 함
        assertEquals(1, successCount.get());
        assertEquals(numberOfThreads - 1, conflictCount.get());
    }
}
