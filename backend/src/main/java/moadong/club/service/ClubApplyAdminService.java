package moadong.club.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.*;
import moadong.club.enums.SemesterTerm;
import moadong.club.payload.dto.*;
import moadong.club.payload.request.*;
import moadong.club.payload.response.ClubApplicationFormsResponse;
import moadong.club.payload.response.ClubApplyInfoResponse;
import moadong.club.repository.ClubApplicantsRepository;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.repository.ClubApplicationFormsRepositoryCustom;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.AESCipher;
import moadong.sse.service.ApplicantsStatusShareSse;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ClubApplyAdminService {
    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final ClubApplicantsRepository clubApplicantsRepository;
    private final AESCipher cipher;
    private final ClubApplicationFormsRepositoryCustom clubApplicationFormsRepositoryCustom;
    private final ApplicantsStatusShareSse applicantsStatusShareSse;

    private record OptionItem(int year, SemesterTerm term) {
    }

    private List<OptionItem> buildOptionItems(LocalDate baseDate, int count) {
        List<OptionItem> items = new ArrayList<>();

        int year = baseDate.getYear();
        int month = baseDate.getMonthValue();

        SemesterTerm startTerm = (month < 7) ? SemesterTerm.FIRST : SemesterTerm.SECOND;

        int semesterYear = year;
        SemesterTerm semesterTerm = startTerm;
        for (int i = 0; i < count; i++) {
            items.add(new OptionItem(semesterYear, semesterTerm));
            if (semesterTerm == SemesterTerm.FIRST) {
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
        boolean allowed = items.stream().anyMatch(it -> it.year() == semesterYear && it.term() == semesterTerm);
        if (!allowed) {
            throw new RestApiException(ErrorCode.APPLICATION_SEMESTER_INVALID);
        }

    }

    public void createClubApplicationForm(CustomUserDetails user, ClubApplicationFormCreateRequest request) {
        validateSemester(request.semesterYear(), request.semesterTerm());

        ClubApplicationForm clubApplicationForm = createApplicationForm(ClubApplicationForm.builder().clubId(user.getClubId()).build(), request);
        clubApplicationFormsRepository.save(clubApplicationForm);
    }

    @Transactional
    public void editClubApplication(String applicationFormId, CustomUserDetails user, ClubApplicationFormEditRequest request) {

        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findByClubIdAndId(user.getClubId(), applicationFormId).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        clubApplicationForm.updateEditedAt();
        clubApplicationFormsRepository.save(updateApplicationForm(clubApplicationForm, request));
    }

    @Transactional //test 사용
    public void editClubApplicationQuestion(String applicationFormId, CustomUserDetails user, ClubApplicationFormEditRequest request) {
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findById(applicationFormId).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        updateApplicationForm(clubApplicationForm, request);
        clubApplicationForm.updateEditedAt();

        clubApplicationFormsRepository.save(clubApplicationForm);
    }

    public ClubApplicationFormsResponse getClubApplicationForms(CustomUserDetails user) {
        return ClubApplicationFormsResponse.builder().forms(clubApplicationFormsRepositoryCustom.findClubApplicationFormsByClubId(user.getClubId())).build();
    }

    @Transactional
    public void deleteClubApplicationForm(String applicationFormId, CustomUserDetails user) {
        ClubApplicationForm applicationForm = clubApplicationFormsRepository.findByClubIdAndId(user.getClubId(), applicationFormId).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        clubApplicantsRepository.deleteAllByFormId(applicationForm.getId());
        clubApplicationFormsRepository.delete(applicationForm);
    }

    public ClubApplyInfoResponse getClubApplyInfo(String applicationFormId, CustomUserDetails user) {
        ClubApplicationForm applicationForm = clubApplicationFormsRepository.findByClubIdAndId(user.getClubId(), applicationFormId).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

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

        return ClubApplyInfoResponse.builder().total(applications.size()).reviewRequired(reviewRequired).scheduledInterview(scheduledInterview).accepted(accepted).applicants(applications).build();
    }

    private ClubApplicant sortApplicationAnswers(ClubApplicationForm application, ClubApplicant app) {
        Map<Long, ClubQuestionAnswer> answerMap = app.getAnswers().stream().collect(Collectors.toMap(ClubQuestionAnswer::getId, answer -> answer));

        List<ClubQuestionAnswer> sortedAnswers = application.getQuestions().stream().map(question -> answerMap.get(question.getId())).filter(Objects::nonNull).collect(Collectors.toList());

        app.updateAnswers(sortedAnswers);
        return app;
    }

    @Transactional
    public void editApplicantDetail(String applicationFormId, List<ClubApplicantEditRequest> request, CustomUserDetails user) {
        String clubId = user.getClubId();

        Map<String, ClubApplicantEditRequest> requestMap = request.stream().collect(Collectors.toMap(ClubApplicantEditRequest::applicantId, Function.identity(), (prev, next) -> next));

        List<String> applicationIds = new ArrayList<>(requestMap.keySet());
        List<ClubApplicant> application = clubApplicantsRepository.findAllByIdInAndFormId(applicationIds, applicationFormId);

        if (application.size() != applicationIds.size()) {
            throw new RestApiException(ErrorCode.APPLICANT_NOT_FOUND);
        }

        List<ApplicantStatusEvent> events = new ArrayList<>();

        application.forEach(app -> {
            ClubApplicantEditRequest editRequest = requestMap.get(app.getId());
            app.updateMemo(editRequest.memo());
            app.updateStatus(editRequest.status());

            events.add(new ApplicantStatusEvent(app.getId(), editRequest.status(), editRequest.memo(), ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime(), clubId, applicationFormId));
        });

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                events.forEach(event -> {
                    try {
                        applicantsStatusShareSse.publishStatusChangeEvent(clubId, applicationFormId, event);
                    } catch (Exception e) {
                        log.error("SSE publish failed. clubId={}, formId={}, applicantId={}", clubId, applicationFormId, event.applicantId(), e);
                    }
                });
            }
        });

        clubApplicantsRepository.saveAll(application);
    }

    @Transactional
    public void deleteApplicant(String applicationFormId, ClubApplicantDeleteRequest request, CustomUserDetails user) {
        List<ClubApplicant> applicants = clubApplicantsRepository.findAllByIdInAndFormId(request.applicantIds(), applicationFormId);

        if (applicants.size() != request.applicantIds().size()) {
            throw new RestApiException(ErrorCode.APPLICANT_NOT_FOUND);
        }

        clubApplicantsRepository.deleteAll(applicants);
    }

    private ClubApplicationForm createApplicationForm(ClubApplicationForm clubApplicationForm, ClubApplicationFormCreateRequest request) {
        if (request.questions() != null)
            clubApplicationForm.updateQuestions(buildClubFormQuestions(request.questions()));
        if (request.externalApplicationUrl() != null)
            clubApplicationForm.updateExternalApplicationUrl(request.externalApplicationUrl());
        clubApplicationForm.updateFormTitle(request.title());
        clubApplicationForm.updateFormDescription(request.description());
        clubApplicationForm.updateSemesterYear(request.semesterYear());
        clubApplicationForm.updateSemesterTerm(request.semesterTerm());
        clubApplicationForm.updateFormMode(request.formMode());

        return clubApplicationForm;
    }

    private ClubApplicationForm updateApplicationForm(ClubApplicationForm clubApplicationForm, ClubApplicationFormEditRequest request) {
        if (request.questions() != null)
            clubApplicationForm.updateQuestions(buildClubFormQuestions(request.questions()));
        if (request.title() != null) clubApplicationForm.updateFormTitle(request.title());
        if (request.description() != null) clubApplicationForm.updateFormDescription(request.description());
        if (request.active() != null) clubApplicationForm.updateFormStatus(request.active());
        if (request.formMode() != null) clubApplicationForm.updateFormMode(request.formMode());
        if (request.externalApplicationUrl() != null)
            clubApplicationForm.updateExternalApplicationUrl(request.externalApplicationUrl());

        if (request.semesterYear() != null || request.semesterTerm() != null) {
            Integer semesterYear = Optional.ofNullable(request.semesterYear()).orElse(clubApplicationForm.getSemesterYear());
            SemesterTerm semesterTerm = Optional.ofNullable(request.semesterTerm()).orElse(clubApplicationForm.getSemesterTerm());
            validateSemester(semesterYear, semesterTerm);

            clubApplicationForm.updateSemesterYear(semesterYear);
            clubApplicationForm.updateSemesterTerm(semesterTerm);
        }

        return clubApplicationForm;
    }

    private List<ClubApplicationFormQuestion> buildClubFormQuestions(List<ClubApplyQuestion> questions) {
        List<ClubApplicationFormQuestion> formQuestions = new ArrayList<>();

        for (var question : questions) {
            List<ClubQuestionItem> items = new ArrayList<>();

            Set<ClubApplyQuestion.QuestionItem> distinctQuestionItemList = new HashSet<>(question.items());
            if (distinctQuestionItemList.size() != question.items().size())
                throw new RestApiException(ErrorCode.DUPLICATE_QUESTIONS_ITEMS);

            for (var item : question.items()) {
                items.add(ClubQuestionItem.builder().value(item.value()).build());
            }

            ClubQuestionOption options = ClubQuestionOption.builder().required(question.options().required()).build();

            ClubApplicationFormQuestion clubApplicationFormQuestion = ClubApplicationFormQuestion.builder().id(question.id()).title(question.title()).description(question.description()).type(question.type()).options(options).items(items).build();

            formQuestions.add(clubApplicationFormQuestion);
        }

        return formQuestions;
    }
}