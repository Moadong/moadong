package moadong.club.service;

import moadong.club.payload.request.ClubInfoRequest;
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

import java.util.concurrent.*;
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
        // GIVEN
        int numberOfThreads = 4;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads); // 모든 스레드의 종료를 기다리기 위함
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads); // 모든 스레드의 동시 시작을 위함 [11][12]

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        // WHEN: 여러 스레드에서 동시에 업데이트 시도
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    ClubInfoRequest request = ClubRequestFixture.createValidClubInfoRequest();

                    // --- 핵심 변경점 ---
                    // 모든 스레드가 이 지점에서 대기.
                    // 마지막 스레드가 barrier.await()을 호출하면 모든 스레드가 동시에 다음 코드를 실행.
                    barrier.await();

                    // 모든 스레드가 거의 동시에 이 메서드를 호출하게 되어 충돌 가능성이 극대화됨
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
    }
}
