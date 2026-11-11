package moadong.feedback.prompt.service;

import java.util.List;
import java.util.Optional;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.payload.request.FeedbackPromptDefinitionRequest;
import moadong.feedback.prompt.repository.FeedbackPromptDefinitionRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@UnitTest
class FeedbackPromptDefinitionAdminServiceTest {

    @Mock
    private FeedbackPromptDefinitionRepository definitionRepository;

    @Mock
    private FeedbackPromptDefinitionValidator validator;

    @InjectMocks
    private FeedbackPromptDefinitionAdminService definitionAdminService;

    @Test
    void 같은_triggerType에_다른_active_프롬프트가_있으면_수정_활성화에_실패한다() {
        FeedbackPromptDefinition existing = definition("target", false);
        FeedbackPromptDefinition otherActive = definition("other", true);
        FeedbackPromptDefinitionRequest request = request(true);

        when(definitionRepository.findById("target")).thenReturn(Optional.of(existing));
        when(definitionRepository.findByTriggerTypeAndActiveTrueOrderByDisplayOrderAsc(
                FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED))
                .thenReturn(List.of(otherActive));

        RestApiException exception = assertThrows(RestApiException.class,
                () -> definitionAdminService.updatePrompt("target", request));

        assertEquals(ErrorCode.FEEDBACK_PROMPT_ACTIVE_DUPLICATED, exception.getErrorCode());
    }

    private FeedbackPromptDefinition definition(String id, boolean active) {
        return FeedbackPromptDefinition.builder()
                .id(id)
                .triggerType(FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED)
                .audience(FeedbackPromptAudience.ADMIN)
                .title("정보 수정 과정은 어떠셨나요?")
                .ratingOptions(List.of(FeedbackPromptRatingOption.builder()
                        .rating(FeedbackPromptRating.POSITIVE)
                        .label("편했어요")
                        .displayOrder(1)
                        .build()))
                .followUp(FeedbackPromptFollowUp.builder()
                        .reasonOptions(List.of(FeedbackPromptReasonOption.builder()
                                .id("OTHER")
                                .label("기타")
                                .displayOrder(1)
                                .active(true)
                                .build()))
                        .commentMaxLength(500)
                        .build())
                .exposurePolicy(FeedbackPromptExposurePolicy.adminDefault())
                .displayOrder(1)
                .active(active)
                .build();
    }

    private FeedbackPromptDefinitionRequest request(boolean active) {
        return new FeedbackPromptDefinitionRequest(
                FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED,
                FeedbackPromptAudience.ADMIN,
                "정보 수정 과정은 어떠셨나요?",
                "더 나은 모아동을 위해 잠깐 시간을 내주세요",
                List.of(new FeedbackPromptDefinitionRequest.RatingOptionRequest(
                        FeedbackPromptRating.POSITIVE,
                        "편했어요",
                        1,
                        false)),
                new FeedbackPromptDefinitionRequest.FollowUpRequest(
                        "어떤 부분이 불편했나요?",
                        List.of(new FeedbackPromptDefinitionRequest.ReasonOptionRequest(
                                "OTHER",
                                "기타",
                                1,
                                true)),
                        "조금 더 알려주실 수 있나요?",
                        "상황을 알려주세요.",
                        500),
                new FeedbackPromptDefinitionRequest.ExposurePolicyRequest(
                        30,
                        7,
                        24,
                        false,
                        0),
                1,
                active);
    }
}
