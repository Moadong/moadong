package moadong.club.service;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubApplicant;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.entity.ClubApplicationFormQuestion;
import moadong.club.entity.ClubQuestionItem;
import moadong.club.entity.ClubQuestionOption;
import moadong.club.enums.ClubApplicationQuestionType;
import moadong.club.enums.SemesterTerm;
import moadong.club.payload.dto.ClubApplicantsResult;
import moadong.club.payload.dto.ClubApplicationFormSlim;
import moadong.club.payload.dto.ClubApplicationFormsResultItem;
import moadong.club.payload.dto.ClubApplicationFormsResult;
import moadong.club.payload.request.ClubApplicationFormCreateRequest;
import moadong.club.payload.request.ClubApplicationFormEditRequest;
import moadong.club.payload.request.ClubApplicantEditRequest;
import moadong.club.payload.request.ClubApplicantDeleteRequest;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.payload.response.ClubApplicationFormResponse;
import moadong.club.payload.response.ClubApplyInfoResponse;
import moadong.club.payload.response.ClubApplicationFormsResponse;
import moadong.club.payload.response.SemesterOptionResponse;
import moadong.club.repository.*;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import moadong.global.util.AESCipher;
import moadong.user.payload.CustomUserDetails;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class ClubApplyService {
    private final ClubRepository clubRepository;
    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final ClubApplicantsRepository clubApplicantsRepository;
    private final AESCipher cipher;
    private final ClubApplicationFormsRepositoryCustom clubApplicationFormsRepositoryCustom;

    private record OptionItem(int year, SemesterTerm term) {}
    private List<OptionItem> buildOptionItems(LocalDate baseDate, int count) {
        List<OptionItem> items = new ArrayList<>();

        int year = baseDate.getYear();
        int month = baseDate.getMonthValue();

        SemesterTerm startTerm = (month < 7) ? SemesterTerm.FIRST : SemesterTerm.SECOND;

        int semesterYear = year;
        SemesterTerm semesterTerm = startTerm;
        for (int i =0; i < count; i++) {
            items.add(new OptionItem(semesterYear, semesterTerm));
            if(semesterTerm == SemesterTerm.FIRST) {
                semesterTerm = SemesterTerm.SECOND;
            } else {
                semesterTerm = SemesterTerm.FIRST;
                semesterYear += 1;
            }
        }
        return items;
    }

    private void validateSemester(Integer semesterYear, SemesterTerm semesterTerm) {
        LocalDate baseDate = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate();
        List<OptionItem> items = buildOptionItems(baseDate, 3);
        boolean allowed = items.stream()
                .anyMatch(it -> it.year() == semesterYear && it.term() == semesterTerm);
        if (!allowed) {
            throw new IllegalArgumentException("Invalid semester selection");
        }

    }

    public void createClubApplicationForm(String clubId, CustomUserDetails user, ClubApplicationFormCreateRequest request) {
        validateClubOwner(clubId, user);
        validateSemester(request.semesterYear(), request.semesterTerm());

        ClubApplicationForm clubApplicationForm = createQuestions(
                ClubApplicationForm.builder()
                        .clubId(clubId)
                        .build(),
                request);
        clubApplicationFormsRepository.save(createQuestions(clubApplicationForm, request));
    }

    @Transactional
    public void editClubApplication(String clubId, String applicationFormId, CustomUserDetails user, ClubApplicationFormEditRequest request) {
        validateClubOwner(clubId, user);

        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findById(applicationFormId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        clubApplicationForm.updateEditedAt();
        clubApplicationFormsRepository.save(updateQuestions(clubApplicationForm, request));
    }
    @Transactional //test 사용
    public void editClubApplicationQuestion(String applicationFormId, CustomUserDetails user, ClubApplicationFormEditRequest request) {
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findById(applicationFormId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        updateQuestions(clubApplicationForm, request);
        clubApplicationForm.updateEditedAt();

        clubApplicationFormsRepository.save(clubApplicationForm);
    }

    public ResponseEntity<?> getClubApplicationForm(String clubId, String applicationFormId) {
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findByClubIdAndId(clubId, applicationFormId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));


        ClubApplicationFormResponse clubApplicationFormResponse = ClubApplicationFormResponse.builder()
                .title(clubApplicationForm.getTitle())
                .description(Optional.ofNullable(clubApplicationForm.getDescription()).orElse(""))
                .questions(clubApplicationForm.getQuestions())
                .semesterYear(clubApplicationForm.getSemesterYear())
                .semesterTerm(clubApplicationForm.getSemesterTerm())
                .status(clubApplicationForm.getStatus())
                .build();

        return Response.ok(clubApplicationFormResponse);
    }

    public ClubApplicationFormsResponse getClubApplicationForms(String clubId, CustomUserDetails user) {
        validateClubOwner(clubId, user);

        return ClubApplicationFormsResponse.builder()
                .forms(clubApplicationFormsRepositoryCustom.findClubApplicationFormsByClubId(clubId))
                .build();
    }
    public ClubApplicationFormsResponse getGroupedClubApplicationForms(String clubId, CustomUserDetails user) {
        validateClubOwner(clubId, user);

        Sort sort = Sort.by(Sort.Direction.DESC, "editedAt")
                .and(Sort.by(Sort.Direction.DESC, "id"));
        List<ClubApplicationFormSlim> questionSlims = clubApplicationFormsRepository.findClubApplicationFormsByClubId(clubId, sort);

        Map<SemesterKey, List<ClubApplicationFormsResultItem>> grouped = new LinkedHashMap<>();
        for (ClubApplicationFormSlim s : questionSlims) {
            Integer year = s.getSemesterYear();
            SemesterTerm term = s.getSemesterTerm();
            LocalDateTime editedAt = s.getEditedAt();

            grouped.computeIfAbsent(new SemesterKey(year, term), k -> new ArrayList<>())
                    .add(new ClubApplicationFormsResultItem(
                            s.getId(),
                            s.getTitle(),
                            editedAt
                    ));
        }

        //그룹 정렬 -> 연도 DESC, 학기순 DESC(SECOND > FIRST)
        Comparator<Map.Entry<SemesterKey, List<ClubApplicationFormsResultItem>>> groupComparator =
                Comparator.comparing(
                                (Map.Entry<SemesterKey, List<ClubApplicationFormsResultItem>> e) -> e.getKey().year(),
                                Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(
                                e -> termRank(e.getKey().term()),
                                Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(
                                e -> termName(e.getKey().term()),
                                Comparator.nullsLast(Comparator.reverseOrder()));

        return ClubApplicationFormsResponse.builder()
                .forms(grouped.entrySet().stream()
                        .sorted(groupComparator)
                        .map(e -> new ClubApplicationFormsResult(
                                e.getKey().year(),
                                e.getKey().term(),
                                e.getValue()
                        ))
                        .collect(Collectors.toList()))
                .build();
    }
    private static int termRank(SemesterTerm term) {
        if (term == null) return -1;
        return switch (term) {
            case SECOND -> 2;
            case FIRST  -> 1;
            default     -> 0;
        };
    }
    private static String termName(SemesterTerm term) {
        return term == null ? "" : term.name();
    }
    private record SemesterKey(Integer year, SemesterTerm term) {}



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

    private ClubApplicationForm createQuestions(ClubApplicationForm clubApplicationForm, ClubApplicationFormCreateRequest request) {
        List<ClubApplicationFormQuestion> newQuestions = new ArrayList<>();

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

            ClubApplicationFormQuestion clubApplicationFormQuestion = ClubApplicationFormQuestion.builder()
                    .id(question.id())
                    .title(question.title())
                    .description(question.description())
                    .type(question.type())
                    .options(options)
                    .items(items)
                    .build();

            newQuestions.add(clubApplicationFormQuestion);
        }

        clubApplicationForm.updateQuestions(newQuestions);
        clubApplicationForm.updateFormTitle(request.title());
        clubApplicationForm.updateFormDescription(request.description());
        clubApplicationForm.updateSemesterYear(request.semesterYear());
        clubApplicationForm.updateSemesterTerm(request.semesterTerm());

        return clubApplicationForm;
    }

    /**
     * update와 create 메서드는 추후 변경예정
     */
    private ClubApplicationForm updateQuestions(ClubApplicationForm clubApplicationForm, ClubApplicationFormEditRequest request) {
        List<ClubApplicationFormQuestion> newQuestions = new ArrayList<>();

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

            ClubApplicationFormQuestion clubApplicationFormQuestion = ClubApplicationFormQuestion.builder()
                    .id(question.id())
                    .title(question.title())
                    .description(question.description())
                    .type(question.type())
                    .options(options)
                    .items(items)
                    .build();

            newQuestions.add(clubApplicationFormQuestion);
        }

        clubApplicationForm.updateQuestions(newQuestions);
        clubApplicationForm.updateFormTitle(request.title());
        clubApplicationForm.updateFormDescription(request.description());
        clubApplicationForm.updateFormStatus(request.active());

        return clubApplicationForm;
    }

    private void validateClubOwner(String clubId, CustomUserDetails user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        if (!user.getId().equals(club.getUserId())) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
    }}