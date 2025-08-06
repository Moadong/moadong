package moadong.club.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.*;
import moadong.club.enums.ClubApplicationQuestionType;
import moadong.club.payload.dto.ClubApplicantsResult;
import moadong.club.payload.request.ClubApplicantEditRequest;
import moadong.club.payload.request.ClubApplicationCreateRequest;
import moadong.club.payload.request.ClubApplicationEditRequest;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.payload.response.ClubApplicationResponse;
import moadong.club.payload.response.ClubApplyInfoResponse;
import moadong.club.repository.ClubApplicationRepository;
import moadong.club.repository.ClubQuestionRepository;
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
public class ClubApplyService {
    private final ClubRepository clubRepository;
    private final ClubQuestionRepository clubQuestionRepository;
    private final ClubApplicationRepository clubApplicationRepository;
    private final AESCipher cipher;

    public void createClubApplication(String clubId, CustomUserDetails user, ClubApplicationCreateRequest request) {
        ClubQuestion clubQuestion = getClubQuestion(clubId, user);

        clubQuestionRepository.save(createQuestions(clubQuestion, request));
    }

    public void editClubApplication(String clubId, CustomUserDetails user, ClubApplicationEditRequest request) {
        ClubQuestion clubQuestion = getClubQuestion(clubId, user);

        clubQuestion.updateEditedAt();
        clubQuestionRepository.save(updateQuestions(clubQuestion, request));
    }

    public ResponseEntity<?> getClubApplication(String clubId) {
        ClubQuestion clubQuestion = clubQuestionRepository.findByClubId(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        ClubApplicationResponse clubApplicationResponse = ClubApplicationResponse.builder()
                .title(clubQuestion.getTitle())
                .description(Optional.ofNullable(clubQuestion.getDescription()).orElse(""))
                .questions(clubQuestion.getQuestions())
                .build();

        return Response.ok(clubApplicationResponse);
    }

    public void applyToClub(String clubId, ClubApplyRequest request) {
        ClubQuestion clubQuestion = clubQuestionRepository.findByClubId(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        validateAnswers(request.questions(), clubQuestion);

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

        ClubApplication application = ClubApplication.builder()
                .questionId(clubQuestion.getClubId())
                .answers(answers)
                .build();

        clubApplicationRepository.save(application);
    }

    public ClubApplyInfoResponse getClubApplyInfo(String clubId, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        List<ClubApplication> submittedApplications = clubApplicationRepository.findAllByQuestionId(clubId);

        List<ClubApplicantsResult> applications = new ArrayList<>();
        int reviewRequired = 0;
        int scheduledInterview = 0;
        int accepted = 0;

        for (ClubApplication app : submittedApplications) {
            applications.add(ClubApplicantsResult.of(app, cipher));

            switch (app.getStatus()) {
                case SUBMITTED, SCREENING -> reviewRequired++;
                case SCREENING_PASSED, INTERVIEW_SCHEDULED, INTERVIEW_IN_PROGRESS -> scheduledInterview++;
                case INTERVIEW_PASSED, OFFERED, ACCEPTED -> accepted++;
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

    @Transactional
    public void editApplicantDetail(String clubId, String appId, ClubApplicantEditRequest request, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        ClubApplication application = clubApplicationRepository.findByIdAndQuestionId(appId, clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICANT_NOT_FOUND));

        application.updateDetail(request.memo(), request.status());

        clubApplicationRepository.save(application);
    }

    @Transactional
    public void deleteApplicant(String clubId, String appId, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        ClubApplication application = clubApplicationRepository.findByIdAndQuestionId(appId, clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICANT_NOT_FOUND));

        clubApplicationRepository.delete(application);
    }

    private void validateAnswers(List<ClubApplyRequest.Answer> answers, ClubQuestion clubQuestion) {
        // 미리 질문과 응답 id 만들어두기
        Map<Long, ClubApplicationQuestion> questionMap = clubQuestion.getQuestions().stream()
                .collect(Collectors.toMap(ClubApplicationQuestion::getId, Function.identity()));

        Set<Long> answerIds = answers.stream()
                .map(ClubApplyRequest.Answer::id)
                .collect(Collectors.toSet());

        // 필수 질문이 누락되었는지 검증
        for (ClubApplicationQuestion question : clubQuestion.getQuestions()) {
            if (question.getOptions().getRequired() && !answerIds.contains(question.getId())) {
                throw new RestApiException(ErrorCode.REQUIRED_QUESTION_MISSING);
            }
        }

        // 답변 유효성 검증
        for (ClubApplyRequest.Answer answer : answers) {
            ClubApplicationQuestion question = questionMap.get(answer.id());

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

    private ClubQuestion createQuestions(ClubQuestion clubQuestion, ClubApplicationCreateRequest request) {
        List<ClubApplicationQuestion> newQuestions = new ArrayList<>();

        for (var question : request.questions()) {
            List<ClubQuestionItem> items = new ArrayList<>();

            for (var item : question.items()) {
                items.add(ClubQuestionItem.builder()
                        .value(item.value())
                        .build());
            }

            ClubQuestionOption options = ClubQuestionOption.builder()
                    .required(question.options().required())
                    .build();

            ClubApplicationQuestion clubApplicationQuestion = ClubApplicationQuestion.builder()
                    .id(question.id())
                    .title(question.title())
                    .description(question.description())
                    .type(question.type())
                    .options(options)
                    .items(items)
                    .build();

            newQuestions.add(clubApplicationQuestion);
        }

        clubQuestion.updateQuestions(newQuestions);
        clubQuestion.updateFormTitle(request.title());
        clubQuestion.updateFormDescription(request.description());

        return clubQuestion;
    }

    /**
     * update와 create 메서드는 추후 변경예정
     */
    private ClubQuestion updateQuestions(ClubQuestion clubQuestion, ClubApplicationEditRequest request) {
        List<ClubApplicationQuestion> newQuestions = new ArrayList<>();

        for (var question : request.questions()) {
            List<ClubQuestionItem> items = new ArrayList<>();

            for (var item : question.items()) {
                items.add(ClubQuestionItem.builder()
                        .value(item.value())
                        .build());
            }

            ClubQuestionOption options = ClubQuestionOption.builder()
                    .required(question.options().required())
                    .build();

            ClubApplicationQuestion clubApplicationQuestion = ClubApplicationQuestion.builder()
                    .id(question.id())
                    .title(question.title())
                    .description(question.description())
                    .type(question.type())
                    .options(options)
                    .items(items)
                    .build();

            newQuestions.add(clubApplicationQuestion);
        }

        clubQuestion.updateQuestions(newQuestions);
        clubQuestion.updateFormTitle(request.title());
        clubQuestion.updateFormDescription(request.description());

        return clubQuestion;
    }

    private ClubQuestion getClubQuestion(String clubId, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        return clubQuestionRepository.findByClubId(club.getId())
                .orElseGet(() -> ClubQuestion.builder()
                        .clubId(club.getId())
                        .build());
    }
}
