package moadong.club.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import moadong.club.entity.ClubApplicant;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.entity.ClubApplicationFormQuestion;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.payload.dto.ClubApplicantsResult;
import moadong.club.payload.response.ClubApplyInfoResponse;
import moadong.club.repository.ClubApplicantsRepository;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.global.util.AESCipher;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

@UnitTest
class ClubApplyAdminServiceUnitTest {

    private static final String CLUB_ID = "club-id";
    private static final String FORM_ID = "form-id";

    @InjectMocks
    private ClubApplyAdminService clubApplyAdminService;

    @Mock
    private ClubApplicationFormsRepository clubApplicationFormsRepository;
    @Mock
    private ClubApplicantsRepository clubApplicantsRepository;
    @Mock
    private AESCipher cipher;

    private CustomUserDetails user;

    @BeforeEach
    void setUp() throws Exception {
        user = mock(CustomUserDetails.class);
        when(user.getClubId()).thenReturn(CLUB_ID);
        when(cipher.decrypt(anyString())).thenAnswer(invocation -> invocation.getArgument(0));

        ClubApplicationForm form = ClubApplicationForm.builder()
                .clubId(CLUB_ID)
                .questions(new ArrayList<>(List.of(question(1L), question(2L), question(3L))))
                .build();
        when(clubApplicationFormsRepository.findByClubIdAndId(CLUB_ID, FORM_ID)).thenReturn(Optional.of(form));
    }

    @Test
    @DisplayName("다중 선택 질문에 같은 질문 id 답이 여러 개여도 예외 없이 질문 순서 자리에 저장 순서대로 모두 나온다")
    void getClubApplyInfo_keepsAllAnswersOfMultiChoiceQuestion() {
        ClubApplicant applicant = applicant(
                answer(3L, "C"),
                answer(2L, "B1"),
                answer(1L, "A"),
                answer(2L, "B2"));
        when(clubApplicantsRepository.findAllByFormId(FORM_ID)).thenReturn(List.of(applicant));

        ClubApplyInfoResponse response = clubApplyAdminService.getClubApplyInfo(FORM_ID, user);

        assertThat(answersOf(response))
                .extracting(ClubQuestionAnswer::getId, ClubQuestionAnswer::getValue)
                .containsExactly(
                        tuple(1L, "A"),
                        tuple(2L, "B1"),
                        tuple(2L, "B2"),
                        tuple(3L, "C"));
    }

    @Test
    @DisplayName("질문마다 답이 하나면 질문 순서로 정렬되고, 폼에 없는 질문 id의 답은 빠진다")
    void getClubApplyInfo_sortsSingleAnswersByQuestionOrder() {
        ClubApplicant applicant = applicant(
                answer(3L, "C"),
                answer(99L, "unknown"),
                answer(1L, "A"));
        when(clubApplicantsRepository.findAllByFormId(FORM_ID)).thenReturn(List.of(applicant));

        ClubApplyInfoResponse response = clubApplyAdminService.getClubApplyInfo(FORM_ID, user);

        assertThat(answersOf(response))
                .extracting(ClubQuestionAnswer::getId, ClubQuestionAnswer::getValue)
                .containsExactly(
                        tuple(1L, "A"),
                        tuple(3L, "C"));
    }

    @Test
    @DisplayName("질문 id가 없는 답은 예외 없이 빠진다")
    void getClubApplyInfo_dropsAnswerWithoutQuestionId() {
        ClubApplicant applicant = applicant(
                answer(null, "no-id"),
                answer(1L, "A"));
        when(clubApplicantsRepository.findAllByFormId(FORM_ID)).thenReturn(List.of(applicant));

        ClubApplyInfoResponse response = clubApplyAdminService.getClubApplyInfo(FORM_ID, user);

        assertThat(answersOf(response))
                .extracting(ClubQuestionAnswer::getId, ClubQuestionAnswer::getValue)
                .containsExactly(tuple(1L, "A"));
    }

    private static List<ClubQuestionAnswer> answersOf(ClubApplyInfoResponse response) {
        assertThat(response.applicants()).hasSize(1);
        ClubApplicantsResult result = response.applicants().get(0);
        return result.answers();
    }

    private static ClubApplicationFormQuestion question(Long id) {
        return ClubApplicationFormQuestion.builder()
                .id(id)
                .title("질문 " + id)
                .description("")
                .build();
    }

    private static ClubQuestionAnswer answer(Long questionId, String value) {
        return ClubQuestionAnswer.builder()
                .id(questionId)
                .value(value)
                .build();
    }

    private static ClubApplicant applicant(ClubQuestionAnswer... answers) {
        return ClubApplicant.builder()
                .id("applicant-id")
                .formId(FORM_ID)
                .answers(new ArrayList<>(List.of(answers)))
                .build();
    }
}
