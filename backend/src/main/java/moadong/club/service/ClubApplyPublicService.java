package moadong.club.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.ClubApplicant;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.entity.ClubApplicationFormQuestion;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ClubApplicationQuestionType;
import moadong.club.payload.dto.ClubActiveFormResult;
import moadong.club.payload.dto.ClubActiveFormSlim;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.payload.response.ClubActiveFormsResponse;
import moadong.club.payload.response.ClubApplicationFormResponse;
import moadong.club.repository.ClubApplicantsRepository;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.summary.ApplicantIdMessagePublisher;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import moadong.global.util.AESCipher;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ClubApplyPublicService {
    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final ClubApplicantsRepository clubApplicantsRepository;
    private final AESCipher cipher;
    private final ApplicantIdMessagePublisher applicantIdMessagePublisher;

    public ClubActiveFormsResponse getActiveApplicationForms(String clubId) {
        List<ClubActiveFormSlim> forms = clubApplicationFormsRepository.findClubActiveFormsByClubId(clubId);

        if (forms == null || forms.isEmpty()) throw new RestApiException(ErrorCode.ACTIVE_APPLICATION_NOT_FOUND);

        List<ClubActiveFormResult> results = new ArrayList<>();
        for (ClubActiveFormSlim form : forms) {
            ClubActiveFormResult result = ClubActiveFormResult.builder().id(form.getId()).title(form.getTitle()).build();
            results.add(result);
        }

        return ClubActiveFormsResponse.builder().forms(results).build();

    }

    public ResponseEntity<?> getClubApplicationForm(String clubId, String applicationFormId) {
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findByClubIdAndId(clubId, applicationFormId).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));


        ClubApplicationFormResponse clubApplicationFormResponse = ClubApplicationFormResponse.builder().title(clubApplicationForm.getTitle()).description(Optional.ofNullable(clubApplicationForm.getDescription()).orElse("")).questions(clubApplicationForm.getQuestions()).semesterYear(clubApplicationForm.getSemesterYear()).semesterTerm(clubApplicationForm.getSemesterTerm()).status(clubApplicationForm.getStatus()).build();

        return Response.ok(clubApplicationFormResponse);
    }

    @Transactional
    public void applyToClub(String clubId, String applicationFormId, ClubApplyRequest request) {
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findByClubIdAndId(clubId, applicationFormId).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        if (clubApplicationForm.getFormMode() == ApplicationFormMode.EXTERNAL) throw new RestApiException(ErrorCode.APPLICATION_NOT_FOUND);
        validateAnswers(request.questions(), clubApplicationForm);

        List<ClubQuestionAnswer> answers = new ArrayList<>();

        try {
            for (ClubApplyRequest.Answer answer : request.questions()) {
                String encryptedValue = cipher.encrypt(answer.value());
                answers.add(ClubQuestionAnswer.builder().id(answer.id()).value(encryptedValue).build());
            }
        } catch (Exception e) {
            log.error("AES_CIPHER_ERROR", e);
            throw new RestApiException(ErrorCode.AES_CIPHER_ERROR);
        }

        ClubApplicant applicant = ClubApplicant.builder().formId(applicationFormId).answers(answers).build();

        clubApplicantsRepository.save(applicant);

        applicantIdMessagePublisher.addApplicantIdToQueue(applicationFormId, applicant.getId());
    }

    private void validateAnswers(List<ClubApplyRequest.Answer> answers, ClubApplicationForm clubApplicationForm) {
        // 미리 질문과 응답 id 만들어두기
        Map<Long, ClubApplicationFormQuestion> questionMap = clubApplicationForm.getQuestions().stream().collect(Collectors.toMap(ClubApplicationFormQuestion::getId, Function.identity()));

        Set<Long> answerIds = answers.stream().map(ClubApplyRequest.Answer::id).collect(Collectors.toSet());

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
}
