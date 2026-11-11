package moadong.feedback.prompt.service;

import java.time.Instant;
import java.util.Optional;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptInteraction;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptIneligibleReason;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.repository.FeedbackPromptInteractionQueryRepository;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@UnitTest
class FeedbackPromptPolicyEvaluatorTest {

    private static final Instant NOW = Instant.parse("2026-09-01T03:00:00Z");

    @Mock
    private FeedbackPromptInteractionQueryRepository interactionQueryRepository;

    @InjectMocks
    private FeedbackPromptPolicyEvaluator policyEvaluator;

    @Test
    void 응답_쿨다운_기간_안이면_노출하지_않는다() {
        FeedbackPromptDefinition prompt = prompt(FeedbackPromptExposurePolicy.adminDefault());
        when(interactionQueryRepository.findLatest(
                eq(FeedbackPromptAudience.ADMIN), eq("user-id"), eq(null),
                eq(FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED), eq("club-id"),
                eq(FeedbackPromptInteractionType.ANSWERED)))
                .thenReturn(Optional.of(FeedbackPromptInteraction.builder()
                        .createdAt(NOW.minusSeconds(60))
                        .build()));

        FeedbackPromptIneligibleReason reason = policyEvaluator.evaluate(
                prompt,
                new FeedbackPromptIdentity(FeedbackPromptAudience.ADMIN, "user-id", null, "club-id"),
                NOW);

        assertEquals(FeedbackPromptIneligibleReason.ANSWERED_COOLDOWN, reason);
    }

    @Test
    void 하루_노출_제한을_넘으면_노출하지_않는다() {
        FeedbackPromptExposurePolicy policy = FeedbackPromptExposurePolicy.builder()
                .answeredCooldownDays(0)
                .dismissedCooldownDays(0)
                .shownCooldownHours(0)
                .dailyExposureLimit(1)
                .build();
        FeedbackPromptDefinition prompt = prompt(policy);
        when(interactionQueryRepository.countShownBetween(
                eq(FeedbackPromptAudience.ADMIN), eq("user-id"), eq(null), any(), any()))
                .thenReturn(1L);

        FeedbackPromptIneligibleReason reason = policyEvaluator.evaluate(
                prompt,
                new FeedbackPromptIdentity(FeedbackPromptAudience.ADMIN, "user-id", null, "club-id"),
                NOW);

        assertEquals(FeedbackPromptIneligibleReason.USER_DAILY_LIMIT, reason);
    }

    @Test
    void 제한에_걸리지_않으면_null을_반환한다() {
        FeedbackPromptExposurePolicy policy = FeedbackPromptExposurePolicy.builder()
                .answeredCooldownDays(0)
                .dismissedCooldownDays(0)
                .shownCooldownHours(0)
                .dailyExposureLimit(0)
                .build();

        FeedbackPromptIneligibleReason reason = policyEvaluator.evaluate(
                prompt(policy),
                new FeedbackPromptIdentity(FeedbackPromptAudience.ADMIN, "user-id", null, "club-id"),
                NOW);

        assertNull(reason);
    }

    private FeedbackPromptDefinition prompt(FeedbackPromptExposurePolicy policy) {
        return FeedbackPromptDefinition.builder()
                .id("prompt-id")
                .triggerType(FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED)
                .audience(FeedbackPromptAudience.ADMIN)
                .exposurePolicy(policy)
                .build();
    }
}
