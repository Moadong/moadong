package moadong.club.service;

import moadong.club.entity.Club;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.payload.request.ClubApplicationFormEditRequest;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.repository.ClubRepository;
import moadong.fixture.ClubApplicationEditFixture;
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

import java.util.NoSuchElementException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@IntegrationTest
public class ClubApplyServiceTest {
    @Autowired
    private ClubApplyService clubApplyService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private ClubApplicationFormsRepository clubApplicationFormsRepository;

    private CustomUserDetails userDetails;
    private ClubApplicationForm clubApplicationForm;

    @BeforeEach
    void setUp() {
        // 1. 기본 유저 정보 설정
        User user = userRepository.findUserByUserId(UserFixture.collectUserId).get();
        userDetails = new CustomUserDetails(user);
        Club club = clubRepository.findClubByUserId(user.getId()).get();

        this.clubApplicationForm = clubApplicationFormsRepository.findByClubId(club.getId())
                .orElseThrow(() -> new NoSuchElementException("테스트를 위한 ClubQuestion 문서가 DB에 존재하지 않습니다. 먼저 문서를 생성해주세요."));
    }


//   TODO: OptionItem private 삭제
    
//    @Test
//    void 현재학기_SECOND이면_내년_FIRST까지() {
//        LocalDate base = LocalDate.of(2025,11,12);
//
//        List<ClubApplyService.OptionItem> items = clubApplyService.buildOptionItems(base, 3);
//
//        List<ClubApplyService.OptionItem> expected = List.of(
//                new ClubApplyService.OptionItem(2025, SemesterTerm.SECOND),
//                new ClubApplyService.OptionItem(2025, SemesterTerm.WINTER),
//                new ClubApplyService.OptionItem(2026, SemesterTerm.FIRST)
//        );
//        assertEquals(expected, items);
//    }
//
//    @Test
//    void 현재학기_SUMMER이면_내년_WINTTER까지() {
//        LocalDate base = LocalDate.of(2025,7,12);
//
//        List<ClubApplyService.OptionItem> items = clubApplyService.buildOptionItems(base, 3);
//
//        List<ClubApplyService.OptionItem> expected = List.of(
//                new ClubApplyService.OptionItem(2025, SemesterTerm.SUMMER),
//                new ClubApplyService.OptionItem(2025, SemesterTerm.SECOND),
//                new ClubApplyService.OptionItem(2025, SemesterTerm.WINTER)
//        );
//        assertEquals(expected, items);
//    }

    @Test
    @DisplayName("DB에 이미 존재하는 문서에 대해 동시 수정 시, 한 스레드만 성공하고 나머지는 실패해야 한다")
    void concurrentUpdateOnExistingDocumentTest() throws InterruptedException {
        // GIVEN: @BeforeEach에서 DB에 존재하는 문서를 성공적으로 조회한 상태
        int numberOfThreads = 1;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        // WHEN: 여러 스레드가 조회된 문서의 ID를 가지고 수정을 시도
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    ClubApplicationFormEditRequest request = ClubApplicationEditFixture.createClubApplicationEditRequest();

                    // 3. 조회해 둔 clubQuestion의 ID를 명확히 전달
                    clubApplyService.editClubApplicationQuestion(this.clubApplicationForm.getId(), userDetails, request);
                    successCount.incrementAndGet();
                } catch (OptimisticLockingFailureException e) {
                    conflictCount.incrementAndGet();
                } catch (DataAccessException e) {
                    if (e.getMessage() != null && e.getMessage().contains("WriteConflict")) {
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