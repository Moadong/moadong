package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
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
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;

@IntegrationTest
public class ClubApplyAdminServiceTest {
    @Autowired
    private ClubApplyAdminService clubApplyAdminService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private ClubApplicationFormsRepository clubApplicationFormsRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private CustomUserDetails userDetails;
    private String clubId;
    private String clubApplicationFormId;

    @BeforeEach
    void setUp() {
        if (userRepository.findUserByUserId(UserFixture.collectUserId).isEmpty()) {
            userRepository.save(UserFixture.createUser(passwordEncoder));
        }
        User user = userRepository.findUserByUserId(UserFixture.collectUserId).get();
        userDetails = new CustomUserDetails(user);

        // Club이 없으면 생성
        if (clubRepository.findClubByUserId(user.getId()).isEmpty()) {
            Club club = new Club(user.getId());
            clubRepository.save(club);
            this.clubId = club.getId();
        } else {
            Club club = clubRepository.findClubByUserId(user.getId()).get();
            this.clubId = club.getId();
        }

        // ClubApplicationForm이 없으면 생성
        if (clubApplicationFormsRepository.findByClubId(clubId).isEmpty()) {
            ClubApplicationForm clubApplicationForm = ClubApplicationForm.builder()
                    .clubId(clubId)
                    .build();
            clubApplicationFormsRepository.save(clubApplicationForm);
            this.clubApplicationFormId = clubApplicationForm.getId();
        } else {
            ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findByClubId(clubId).get(0);
            this.clubApplicationFormId = clubApplicationForm.getId();
        }
    }

    @AfterEach
    void tearDown() {
        // 테스트용 ClubApplicationForm 삭제
        if (clubApplicationFormId != null) {
            clubApplicationFormsRepository.deleteById(clubApplicationFormId);
        }
        // 테스트용 Club 삭제
        if (clubId != null) {
            clubRepository.deleteById(clubId);
        }
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
        // GIVEN
        int numberOfThreads = 3;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        // --- 핵심 추가: CyclicBarrier ---
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        // WHEN: 여러 스레드가 각자 데이터를 조회한 후, 동시에 수정을 시도
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    // 1. 각 스레드가 DB에서 데이터를 직접 조회 (모두 같은 버전을 읽음)
                    ClubApplicationForm formToUpdate = clubApplicationFormsRepository.findById(this.clubApplicationFormId).get();

                    // 2. 모든 스레드가 조회를 마칠 때까지 대기
                    barrier.await();

                    // 3. 동시에 업데이트 로직 호출
                    // 서비스 메서드를 직접 호출하는 대신, 테스트에서 로직을 제어
                    ClubApplicationFormEditRequest clubApplicationEditRequest = ClubApplicationEditFixture.createClubApplicationEditRequest();
                    formToUpdate.updateFormTitle(clubApplicationEditRequest.title()); // 엔티티 수정
                    clubApplicationFormsRepository.save(formToUpdate); // 저장 (충돌 발생 지점)

                    successCount.incrementAndGet();

                } catch (DataAccessException e) {
                    // DataAccessException은 WriteConflict 등을 포함
                    conflictCount.incrementAndGet();
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
        latch.await();
        executorService.shutdown();

        // THEN: 정확히 하나의 스레드만 성공하고, 나머지는 모두 충돌 예외를 받아야 함
        assertEquals(1, successCount.get(), "성공한 요청은 1개여야 합니다.");
        assertEquals(numberOfThreads - 1, conflictCount.get(), "실패(충돌)한 요청은 " + (numberOfThreads - 1) + "개여야 합니다.");
    }
}