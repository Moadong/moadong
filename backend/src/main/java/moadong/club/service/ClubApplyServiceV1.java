package moadong.club.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.*;
import moadong.club.enums.ClubApplicationQuestionType;
import moadong.club.enums.SemesterTerm;
import moadong.club.payload.dto.*;
import moadong.club.payload.request.*;
import moadong.club.payload.response.ClubActiveFormsResponse;
import moadong.club.payload.response.ClubApplicationFormResponse;
import moadong.club.payload.response.ClubApplicationFormsResponse;
import moadong.club.payload.response.ClubApplyInfoResponse;
import moadong.club.repository.ClubApplicantsRepository;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.repository.ClubApplicationFormsRepositoryCustom;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import moadong.global.util.AESCipher;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ClubApplyServiceV1 {
    private final ClubRepository clubRepository;
    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final ClubApplicantsRepository clubApplicantsRepository;
    private final AESCipher cipher;

    public void applyToClub(String clubId, String applicationFormId, ClubApplyRequest request) {
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findByClubIdAndId(clubId, applicationFormId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        validateAnswers(request.questions(), clubApplicationForm);

        List<ClubQuestionAnswer> answers = new ArrayList<>();

        try {
            for (ClubApplyRequest.Answer answer : request.questions()) {
                String encryptedValue = cipher.encrypt(answer.value());
                answers.add(ClubQuestionAnswer.builder()
                        .id(answer.id())
                        .value(encryptedValue)
                        .build());
            }
        } catch (Exception e) {
            log.error("AES_CIPHER_ERROR", e);
            throw new RestApiException(ErrorCode.AES_CIPHER_ERROR);
        }

        ClubApplicant application = ClubApplicant.builder()
                .formId(applicationFormId)
                .answers(answers)
                .build();

        clubApplicantsRepository.save(application);
    }

    public ClubApplyInfoResponse getClubApplyInfo(String clubId, String applicationFormId, CustomUserDetails user) {
        validateClubOwner(clubId, user);

        ClubApplicationForm applicationForm = clubApplicationFormsRepository.findByClubIdAndId(clubId, applicationFormId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        List<ClubApplicant> submittedApplications = clubApplicantsRepository.findAllByFormId(applicationFormId);

        List<ClubApplicantsResult> applications = new ArrayList<>();
        int reviewRequired = 0;
        int scheduledInterview = 0;
        int accepted = 0;

        for (ClubApplicant app : submittedApplications) {
            ClubApplicant sortedApp = sortApplicationAnswers(applicationForm, app);
            applications.add(ClubApplicantsResult.of(sortedApp, cipher));

            switch (app.getStatus()) {
                case SUBMITTED -> reviewRequired++;
                case INTERVIEW_SCHEDULED -> scheduledInterview++;
                case ACCEPTED -> accepted++;
            }
        }

        return ClubApplyInfoResponse.builder()
                .total(applications.size())
                .reviewRequired(reviewRequired)
                .scheduledInterview(scheduledInterview)
                .accepted(accepted)
                .applicants(applications)
                .build();
    }

    private ClubApplicant sortApplicationAnswers(ClubApplicationForm application, ClubApplicant app) {
        Map<Long, ClubQuestionAnswer> answerMap = app.getAnswers().stream()
                .collect(Collectors.toMap(ClubQuestionAnswer::getId, answer -> answer));

        List<ClubQuestionAnswer> sortedAnswers = application.getQuestions().stream()
                .map(question -> answerMap.get(question.getId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        app.updateAnswers(sortedAnswers);
        return app;
    }

    @Transactional
    public void editApplicantDetail(String clubId, String applicationFormId, List<ClubApplicantEditRequest> request, CustomUserDetails user) {
        validateClubOwner(clubId, user);

        Map<String, ClubApplicantEditRequest> requestMap = request.stream()
                .collect(Collectors.toMap(ClubApplicantEditRequest::applicantId,
                        Function.identity(), (prev, next) -> next));

        List<String> applicationIds = new ArrayList<>(requestMap.keySet());
        List<ClubApplicant> application = clubApplicantsRepository.findAllByIdInAndFormId(applicationIds, applicationFormId);

        if (application.size() != applicationIds.size()) {
            throw new RestApiException(ErrorCode.APPLICANT_NOT_FOUND);
        }

        application.forEach(app -> {
            ClubApplicantEditRequest editRequest = requestMap.get(app.getId());
            app.updateMemo(editRequest.memo());
            app.updateStatus(editRequest.status());
        });

        clubApplicantsRepository.saveAll(application);
    }

    @Transactional
    public void deleteApplicant(String clubId, String applicationFormId, ClubApplicantDeleteRequest request, CustomUserDetails user) {
        validateClubOwner(clubId, user);

        List<ClubApplicant> applicants = clubApplicantsRepository.findAllByIdInAndFormId(request.applicantIds(), applicationFormId);

        if (applicants.size() != request.applicantIds().size()) {
            throw new RestApiException(ErrorCode.APPLICANT_NOT_FOUND);
        }

        clubApplicantsRepository.deleteAll(applicants);
    }

    private void validateAnswers(List<ClubApplyRequest.Answer> answers, ClubApplicationForm clubApplicationForm) {
        // 미리 질문과 응답 id 만들어두기
        Map<Long, ClubApplicationFormQuestion> questionMap = clubApplicationForm.getQuestions().stream()
                .collect(Collectors.toMap(ClubApplicationFormQuestion::getId, Function.identity()));

        Set<Long> answerIds = answers.stream()
                .map(ClubApplyRequest.Answer::id)
                .collect(Collectors.toSet());

        // 필수 질문이 누락되었는지 검증
        for (ClubApplicationFormQuestion question : clubApplicationForm.getQuestions()) {
            if (question.getOptions().getRequired() && !answerIds.contains(question.getId())) {
                throw new RestApiException(ErrorCode.REQUIRED_QUESTION_MISSING);
            }
        }

        // 답변 유효성 검증
        for (ClubApplyRequest.Answer answer : answers) {
            ClubApplicationFormQuestion question = questionMap.get(answer.id());

            // 질문이 없을 경우 예외 처리
            if (question == null) {
                throw new RestApiException(ErrorCode.QUESTION_NOT_FOUND);
            }

            validateAnswerLength(answer.value(), question.getType());
        }
    }

    private void validateAnswerLength(String value, ClubApplicationQuestionType type) {
        switch (type) {
            case SHORT_TEXT -> {
                if (value.length() > 100) {
                    throw new RestApiException(ErrorCode.SHORT_EXCEED_LENGTH);
                }
            }
            case LONG_TEXT -> {
                if (value.length() > 1000) {
                    throw new RestApiException(ErrorCode.LONG_EXCEED_LENGTH);
                }
            }
        }
    }
    private void validateClubOwner(String clubId, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
    }
}
