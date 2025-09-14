package moadong.club.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.*;
import moadong.club.enums.ClubApplicationQuestionType;
import moadong.club.enums.SemesterTerm;
import moadong.club.payload.dto.ClubApplicantsResult;
import moadong.club.payload.request.*;
import moadong.club.payload.response.ClubApplicationResponse;
import moadong.club.payload.response.ClubApplyInfoResponse;
import moadong.club.payload.response.SemesterOptionResponse;
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

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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

    public List<SemesterOptionResponse> getSemesterOption(String clubId, int count) {
        LocalDate baseDate = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        List<OptionItem> items = buildOptionItems(baseDate, count);

        //TODO: cludId랑 semester로 각 학기 지원서의 exist
        return items.stream()
                .map(it -> SemesterOptionResponse.builder()
                        .semesterYear(it.year())
                        .term(it.term())
                        .build())
                .toList();
        
    }
    private record OptionItem(int year, SemesterTerm term) {}
    private List<OptionItem> buildOptionItems(LocalDate baseDate, int count) {
        List<OptionItem> items = new ArrayList<>();

        int year = baseDate.getYear();
        int month = baseDate.getMonthValue();

        SemesterTerm startTerm = (month >= 3 && month <=6) ? SemesterTerm.FIRST
                : (month >= 7 && month <= 8) ? SemesterTerm.SUMMER
                : (month >= 9 && month <= 12) ? SemesterTerm.SECOND : SemesterTerm.WINTER;

        int semesterYear = year;
        SemesterTerm semesterTerm = startTerm;
        for (int i =0; i < count; i++) {
            items.add(new OptionItem(semesterYear, semesterTerm));
            switch (semesterTerm) {
                case FIRST:
                    semesterTerm = SemesterTerm.SUMMER;
                    break;
                case SUMMER:
                    semesterTerm = SemesterTerm.SECOND;
                    break;
                case SECOND:
                    semesterTerm = SemesterTerm.WINTER;
                    break;
                case WINTER:
                    semesterTerm = SemesterTerm.FIRST;
                    semesterYear += 1;
                    break;
            }
        }
        return items;
    }

    public void createClubApplication(String clubId, CustomUserDetails user, ClubApplicationCreateRequest request) {
        ClubQuestion clubQuestion = getClubQuestion(clubId, user);

        clubQuestionRepository.save(createQuestions(clubQuestion, request));
    }
    @Transactional
    public void editClubApplication(String clubId, CustomUserDetails user, ClubApplicationEditRequest request) {
        ClubQuestion clubQuestion = getClubQuestion(clubId, user);

        clubQuestion.updateEditedAt();
        clubQuestionRepository.save(updateQuestions(clubQuestion, request));
    }
    @Transactional
    public void editClubApplicationQuestion(String questionId, CustomUserDetails user, ClubApplicationEditRequest request) {
        ClubQuestion clubQuestion = clubQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RestApiException(ErrorCode.QUESTION_NOT_FOUND));

        updateQuestions(clubQuestion, request);
        clubQuestion.updateEditedAt();

        clubQuestionRepository.save(clubQuestion);
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

        ClubQuestion clubApplication = clubQuestionRepository.findByClubId(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));
        List<ClubApplication> submittedApplications = clubApplicationRepository.findAllByQuestionId(clubId);

        List<ClubApplicantsResult> applications = new ArrayList<>();
        int reviewRequired = 0;
        int scheduledInterview = 0;
        int accepted = 0;

        for (ClubApplication app : submittedApplications) {
            ClubApplication sortedApp = sortApplicationAnswers(clubApplication, app);
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

    private ClubApplication sortApplicationAnswers(ClubQuestion application, ClubApplication app) {
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
    public void editApplicantDetail(String clubId, List<ClubApplicantEditRequest> request, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        Map<String, ClubApplicantEditRequest> requestMap = request.stream()
                .collect(Collectors.toMap(ClubApplicantEditRequest::applicantId,
                        Function.identity(), (prev, next) -> next));

        List<String> applicationIds = new ArrayList<>(requestMap.keySet());
        List<ClubApplication> application = clubApplicationRepository.findAllByIdInAndQuestionId(applicationIds, clubId);

        if (application.size() != applicationIds.size()) {
            throw new RestApiException(ErrorCode.APPLICANT_NOT_FOUND);
        }

        application.forEach(app -> {
            ClubApplicantEditRequest editRequest = requestMap.get(app.getId());
            app.updateMemo(editRequest.memo());
            app.updateStatus(editRequest.status());
        });

        clubApplicationRepository.saveAll(application);
    }

    @Transactional
    public void deleteApplicant(String clubId, ClubApplicantDeleteRequest request, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        List<ClubApplication> applicants = clubApplicationRepository.findAllByIdInAndQuestionId(request.applicantIds(), clubId);

        if (applicants.size() != request.applicantIds().size()) {
            throw new RestApiException(ErrorCode.APPLICANT_NOT_FOUND);
        }

        clubApplicationRepository.deleteAll(applicants);
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