package moadong.feedback.prompt.service;

import java.util.List;
import java.util.Optional;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptInteraction;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.entity.FeedbackPromptResponse;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.payload.request.FeedbackPromptResponseCreateRequest;
import moadong.feedback.prompt.repository.FeedbackPromptDefinitionRepository;
import moadong.feedback.prompt.repository.FeedbackPromptInteractionRepository;
import moadong.feedback.prompt.repository.FeedbackPromptResponseRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FeedbackPromptResponseServiceTest {

    @Mock
    private FeedbackPromptDefinitionRepository definitionRepository;

    @Mock
    private FeedbackPromptResponseRepository responseRepository;

    @Mock
    private FeedbackPromptInteractionRepository interactionRepository;

    @Mock
    private FeedbackPromptPolicyEvaluator policyEvaluator;

    private FeedbackPromptEligibilityService eligibilityService;

    private FeedbackPromptResponseService responseService;

    @BeforeEach
    void setUp() {
        eligibilityService = new FeedbackPromptEligibilityService(
                definitionRepository,
                interactionRepository,
                policyEvaluator);
        responseService = new FeedbackPromptResponseService(
                definitionRepository,
                responseRepository,
                eligibilityService);
    }

    @Test
    void 부정_응답은_스냅샷과_ANSWERED_이력을_함께_저장한다() {
        FeedbackPromptDefinition prompt = prompt();
        CustomUserDetails user = org.mockito.Mockito.mock(CustomUserDetails.class);
        when(user.getId()).thenReturn("user-id");
        when(user.getClubId()).thenReturn("club-id");
        when(definitionRepository.findById("prompt-id")).thenReturn(Optional.of(prompt));
        when(responseRepository.save(any(FeedbackPromptResponse.class))).thenAnswer(invocation -> invocation.getArgument(0));

        responseService.createResponse("prompt-id",
                new FeedbackPromptResponseCreateRequest(
                        FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED,
                        "club-id",
                        null,
                        FeedbackPromptRating.NEGATIVE,
                        List.of("PHOTO_UPLOAD"),
                        "사진 등록이 불편했어요.",
                        null),
                user);

        ArgumentCaptor<FeedbackPromptResponse> responseCaptor = ArgumentCaptor.forClass(FeedbackPromptResponse.class);
        verify(responseRepository).save(responseCaptor.capture());
        assertEquals("정보 수정 과정은 어떠셨나요?", responseCaptor.getValue().getSnapshot().getTitle());
        assertEquals("사진 등록이 불편해요", responseCaptor.getValue().getSnapshot().getSelectedReasons().get(0).getLabel());

        ArgumentCaptor<FeedbackPromptInteraction> interactionCaptor = ArgumentCaptor.forClass(FeedbackPromptInteraction.class);
        verify(interactionRepository).save(interactionCaptor.capture());
        assertEquals(FeedbackPromptInteractionType.ANSWERED, interactionCaptor.getValue().getType());
    }

    @Test
    void 긍정_응답에_reason이_있으면_실패한다() {
        FeedbackPromptDefinition prompt = prompt();
        CustomUserDetails user = org.mockito.Mockito.mock(CustomUserDetails.class);
        when(user.getId()).thenReturn("user-id");
        when(user.getClubId()).thenReturn("club-id");
        when(definitionRepository.findById("prompt-id")).thenReturn(Optional.of(prompt));

        RestApiException exception = assertThrows(RestApiException.class,
                () -> responseService.createResponse("prompt-id",
                        new FeedbackPromptResponseCreateRequest(
                                FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED,
                                "club-id",
                                null,
                                FeedbackPromptRating.POSITIVE,
                                List.of("PHOTO_UPLOAD"),
                                null,
                                null),
                        user));

        assertEquals(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST, exception.getErrorCode());
    }

    private FeedbackPromptDefinition prompt() {
        return FeedbackPromptDefinition.builder()
                .id("prompt-id")
                .triggerType(FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED)
                .audience(FeedbackPromptAudience.ADMIN)
                .title("정보 수정 과정은 어떠셨나요?")
                .description("더 나은 모아동을 위해 잠깐 시간을 내주세요")
                .ratingOptions(List.of(
                        FeedbackPromptRatingOption.builder()
                                .rating(FeedbackPromptRating.POSITIVE)
                                .label("편했어요")
                                .displayOrder(1)
                                .requiresFollowUp(false)
                                .build(),
                        FeedbackPromptRatingOption.builder()
                                .rating(FeedbackPromptRating.NEGATIVE)
                                .label("불편했어요")
                                .displayOrder(2)
                                .requiresFollowUp(true)
                                .build()))
                .followUp(FeedbackPromptFollowUp.builder()
                        .reasonQuestion("어떤 부분이 가장 불편했나요?")
                        .reasonOptions(List.of(FeedbackPromptReasonOption.builder()
                                .id("PHOTO_UPLOAD")
                                .label("사진 등록이 불편해요")
                                .displayOrder(1)
                                .active(true)
                                .build()))
                        .commentQuestion("조금 더 알려주실 수 있나요?")
                        .commentMaxLength(500)
                        .build())
                .exposurePolicy(FeedbackPromptExposurePolicy.adminDefault())
                .active(true)
                .build();
    }
}
