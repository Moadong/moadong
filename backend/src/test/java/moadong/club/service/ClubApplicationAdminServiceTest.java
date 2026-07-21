package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.payload.request.AdminExternalFormConnectRequest;
import moadong.club.payload.response.AdminClubApplicationFormResponse;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class ClubApplicationAdminServiceTest {

    @Autowired
    private ClubApplyAdminService clubApplyAdminService;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private ClubApplicationFormsRepository clubApplicationFormsRepository;

    private String clubId;

    private int currentSemesterYear() {
        return java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Seoul")).toLocalDate().getYear();
    }

    @BeforeEach
    void setUp() {
        Club club = new Club("dev-portal-test-user");
        clubRepository.save(club);
        this.clubId = club.getId();
    }

    @AfterEach
    void tearDown() {
        clubApplicationFormsRepository.findByClubId(clubId)
                .forEach(clubApplicationFormsRepository::delete);
        clubRepository.deleteById(clubId);
    }

    @Test
    @DisplayName("외부폼 연결 시 EXTERNAL + ACTIVE 상태로 생성된다")
    void connectExternalForm_createsActiveExternalForm() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear());

        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);

        List<ClubApplicationForm> forms = clubApplicationFormsRepository.findByClubId(clubId);
        assertEquals(1, forms.size());
        assertEquals(ApplicationFormMode.EXTERNAL, forms.get(0).getFormMode());
        assertEquals(ApplicationFormStatus.ACTIVE, forms.get(0).getStatus());
        assertEquals("https://forms.gle/abcd", forms.get(0).getExternalApplicationUrl());
    }

    @Test
    @DisplayName("허용되지 않은 외부 URL이면 예외가 발생한다")
    void connectExternalForm_rejectsNotAllowedUrl() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "잘못된폼", "https://evil.example.com/form", currentSemesterYear());

        assertThrows(RestApiException.class,
                () -> clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request));
    }

    @Test
    @DisplayName("상태 토글: active=false면 ACTIVE에서 INACTIVE로 내려가 지원 목록에서 빠진다")
    void setStatus_deactivatesActiveForm() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear());
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);
        String formId = clubApplicationFormsRepository.findByClubId(clubId).get(0).getId();

        clubApplyAdminService.setApplicationFormStatusForClub(clubId, formId, false);

        ClubApplicationForm form = clubApplicationFormsRepository.findByClubIdAndId(clubId, formId).orElseThrow();
        assertEquals(ApplicationFormStatus.INACTIVE, form.getStatus());
    }

    @Test
    @DisplayName("목록 조회는 해당 동아리 폼을 반환한다")
    void getForms_returnsClubForms() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear());
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);

        List<AdminClubApplicationFormResponse> forms = clubApplyAdminService.getApplicationFormsForClub(clubId);
        assertEquals(1, forms.size());
        assertEquals("구글폼", forms.get(0).title());
    }

    @Test
    @DisplayName("삭제하면 폼이 사라진다")
    void deleteForm_removesForm() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear());
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);
        String formId = clubApplicationFormsRepository.findByClubId(clubId).get(0).getId();

        clubApplyAdminService.deleteApplicationFormForClub(clubId, formId);

        assertTrue(clubApplicationFormsRepository.findByClubId(clubId).isEmpty());
    }
}
