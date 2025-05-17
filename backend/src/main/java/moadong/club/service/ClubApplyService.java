package moadong.club.service;

import lombok.AllArgsConstructor;
import moadong.club.entity.*;
import moadong.club.payload.request.ClubApplicationCreateRequest;
import moadong.club.payload.request.ClubApplicationEditRequest;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.repository.ClubApplicationRepository;
import moadong.club.repository.ClubQuestionRepository;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClubApplyService {

    private final ClubRepository clubRepository;
    private final ClubQuestionRepository clubQuestionRepository;
    private final ClubApplicationRepository clubApplicationRepository;

    public void createClubApplication(String clubId, CustomUserDetails user, ClubApplicationCreateRequest request) {
        ClubQuestion clubQuestion = validateClubApplicationRequest(clubId, user);

        clubQuestionRepository.save(createQuestions(clubQuestion, request));
    }

    public void editClubApplication(String clubId, CustomUserDetails user, ClubApplicationEditRequest request) {
        ClubQuestion clubQuestion = validateClubApplicationRequest(clubId, user);

        clubQuestionRepository.save(updateQuestions(clubQuestion, request));
    }

    public ResponseEntity<?> getClubApplication(String clubId) {
        ClubQuestion clubQuestion = clubQuestionRepository.findByClubId(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        return ResponseEntity.ok(clubQuestion);
    }

    public ResponseEntity<?> applyToClub(String clubId, ClubApplyRequest request) {
        ClubQuestion clubQuestion = clubQuestionRepository.findByClubId(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        //질문자의 응답에대해 따로 검증 진행하지 않음, 프론트에서 제한하는것만으로도 충분하다 생각
        List<ClubQuestionAnswer> answers = request.questions()
                .stream().map(answer -> ClubQuestionAnswer.builder()
                        .id(answer.id())
                        .value(answer.value())
                        .build()
                ).toList();

        ClubApplication application = ClubApplication.builder()
                .questionId(clubQuestion.getClubId())
                .answers(answers).build();

        clubApplicationRepository.save(application);

        return ResponseEntity.ok("success apply");
    }

    private ClubQuestion createQuestions(ClubQuestion clubQuestion, ClubApplicationCreateRequest request) {
        //지금은 지원서 하나만
        List<ClubApplicationQuestion> newQuestions = request.questions().stream()
                .map(question -> ClubApplicationQuestion.builder()
                        .id(question.id())
                        .title(question.title())
                        .description(question.description())
                        .type(question.type())
                        .options(
                                ClubQuestionOption.builder()
                                        .required(question.options().required())
                                        .build()
                        )
                        .items(question.items().stream()
                                .map(item ->
                                        ClubQuestionItem.builder()
                                                .value(item.value())
                                                .build())
                                .toList())
                        .build())
                .toList();

        clubQuestion.updateQuestions(newQuestions);
        clubQuestion.updateFormTitle(request.title());

        return clubQuestion;
    }

    private ClubQuestion updateQuestions(ClubQuestion clubQuestion, ClubApplicationEditRequest request) {
        //지금은 지원서 하나만
        List<ClubApplicationQuestion> newQuestions = request.questions().stream()
                .map(question -> ClubApplicationQuestion.builder()
                        .id(question.id())
                        .title(question.title())
                        .description(question.description())
                        .type(question.type())
                        .options(
                                ClubQuestionOption.builder()
                                        .required(question.options().required())
                                        .build()
                        )
                        .items(question.items().stream()
                                .map(item ->
                                        ClubQuestionItem.builder()
                                                .value(item.value())
                                                .build())
                                .toList())
                        .build())
                .toList();

        clubQuestion.updateQuestions(newQuestions);
        clubQuestion.updateFormTitle(request.title());

        return clubQuestion;
    }

    private ClubQuestion validateClubApplicationRequest(String clubId, CustomUserDetails user){
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        if (!user.getId().equals(club.getUserId())){
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }

        return clubQuestionRepository.findByClubId(club.getId())
                        .orElseGet(() -> ClubQuestion.builder()
                        .clubId(club.getId())
                        .build());
    }
}
