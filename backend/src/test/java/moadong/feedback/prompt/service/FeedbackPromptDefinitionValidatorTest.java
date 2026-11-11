package moadong.feedback.prompt.service;

import java.util.List;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@UnitTest
class FeedbackPromptDefinitionValidatorTest {

    @InjectMocks
    private FeedbackPromptDefinitionValidator validator;

    @Test
    void 선택지가_8개를_넘으면_실패한다() {
        FeedbackPromptDefinition definition = baseDefinition(FeedbackPromptFollowUp.builder()
                .reasonQuestion("어떤 부분이 불편했나요?")
                .reasonOptions(List.of(
                        reason("A"), reason("B"), reason("C"), reason("D"), reason("E"),
                        reason("F"), reason("G"), reason("H"), reason("I")))
                .commentMaxLength(500)
                .build());

        RestApiException exception = assertThrows(RestApiException.class,
                () -> validator.validateForCreate(definition));

        assertEquals(ErrorCode.FEEDBACK_PROMPT_REASON_LIMIT_EXCEEDED, exception.getErrorCode());
    }

    @Test
    void 재노출_정책_범위를_벗어나면_실패한다() {
        FeedbackPromptDefinition definition = FeedbackPromptDefinition.builder()
                .triggerType(FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED)
                .audience(FeedbackPromptAudience.ADMIN)
                .title("정보 수정 과정은 어떠셨나요?")
                .ratingOptions(defaultRatings())
                .followUp(defaultFollowUp())
                .exposurePolicy(FeedbackPromptExposurePolicy.builder()
                        .answeredCooldownDays(366)
                        .dismissedCooldownDays(7)
                        .shownCooldownHours(24)
                        .dailyExposureLimit(0)
                        .build())
                .active(true)
                .build();

        RestApiException exception = assertThrows(RestApiException.class,
                () -> validator.validateForCreate(definition));

        assertEquals(ErrorCode.FEEDBACK_PROMPT_POLICY_INVALID, exception.getErrorCode());
    }

    @Test
    void 기존_reason_id를_업데이트에서_삭제하면_실패한다() {
        FeedbackPromptDefinition existing = baseDefinition(defaultFollowUp());
        FeedbackPromptDefinition next = baseDefinition(FeedbackPromptFollowUp.builder()
                .reasonQuestion("어떤 부분이 불편했나요?")
                .reasonOptions(List.of(reason("PHOTO_UPLOAD")))
                .commentMaxLength(500)
                .build());

        RestApiException exception = assertThrows(RestApiException.class,
                () -> validator.validateForUpdate(existing, next));

        assertEquals(ErrorCode.FEEDBACK_PROMPT_INVALID_REQUEST, exception.getErrorCode());
    }

    private FeedbackPromptDefinition baseDefinition(FeedbackPromptFollowUp followUp) {
        return FeedbackPromptDefinition.builder()
                .triggerType(FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED)
                .audience(FeedbackPromptAudience.ADMIN)
                .title("정보 수정 과정은 어떠셨나요?")
                .ratingOptions(defaultRatings())
                .followUp(followUp)
                .exposurePolicy(FeedbackPromptExposurePolicy.adminDefault())
                .active(true)
                .build();
    }

    private List<FeedbackPromptRatingOption> defaultRatings() {
        return List.of(
                FeedbackPromptRatingOption.builder()
                        .rating(FeedbackPromptRating.POSITIVE)
                        .label("편했어요")
                        .displayOrder(1)
                        .build(),
                FeedbackPromptRatingOption.builder()
                        .rating(FeedbackPromptRating.NEGATIVE)
                        .label("불편했어요")
                        .displayOrder(2)
                        .requiresFollowUp(true)
                        .build());
    }

    private FeedbackPromptFollowUp defaultFollowUp() {
        return FeedbackPromptFollowUp.builder()
                .reasonQuestion("어떤 부분이 불편했나요?")
                .reasonOptions(List.of(reason("PHOTO_UPLOAD"), reason("SAVE_FLOW")))
                .commentMaxLength(500)
                .build();
    }

    private FeedbackPromptReasonOption reason(String id) {
        return FeedbackPromptReasonOption.builder()
                .id(id)
                .label(id)
                .displayOrder(1)
                .active(true)
                .build();
    }
}
