package moadong.feedback.prompt.service;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptInteraction;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptIneligibleReason;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.payload.response.FeedbackPromptEligibilityResponse;
import moadong.feedback.prompt.repository.FeedbackPromptDefinitionRepository;
import moadong.feedback.prompt.repository.FeedbackPromptInteractionRepository;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class FeedbackPromptEligibilityService {

    private final FeedbackPromptDefinitionRepository definitionRepository;
    private final FeedbackPromptInteractionRepository interactionRepository;
    private final FeedbackPromptPolicyEvaluator policyEvaluator;

    public FeedbackPromptEligibilityResponse getEligibility(
            FeedbackPromptTriggerType triggerType,
            String clubId,
            String anonymousClientId,
            CustomUserDetails user
    ) {
        FeedbackPromptDefinition prompt = definitionRepository.findByTriggerTypeAndActiveTrueOrderByDisplayOrderAsc(triggerType)
                .stream()
                .findFirst()
                .orElse(null);
        if (prompt == null) {
            return FeedbackPromptEligibilityResponse.ineligible(FeedbackPromptIneligibleReason.PROMPT_NOT_FOUND);
        }
        FeedbackPromptIdentity identity = resolveIdentity(prompt, triggerType, clubId, anonymousClientId, user);
        if (identity == null) {
            return FeedbackPromptEligibilityResponse.ineligible(FeedbackPromptIneligibleReason.UNAUTHORIZED);
        }
        FeedbackPromptIneligibleReason reason = policyEvaluator.evaluate(prompt, identity, Instant.now());
        if (reason != null) {
            return FeedbackPromptEligibilityResponse.ineligible(reason);
        }
        saveInteraction(prompt, identity, FeedbackPromptInteractionType.SHOWN);
        return FeedbackPromptEligibilityResponse.eligible(prompt);
    }

    FeedbackPromptIdentity resolveIdentity(
            FeedbackPromptDefinition prompt,
            FeedbackPromptTriggerType triggerType,
            String clubId,
            String anonymousClientId,
            CustomUserDetails user
    ) {
        if (prompt.getAudience() == FeedbackPromptAudience.ADMIN || triggerType.isAdminTrigger()) {
            if (user == null || !StringUtils.hasText(user.getId()) || !StringUtils.hasText(clubId)
                    || !clubId.equals(user.getClubId())) {
                return null;
            }
            return new FeedbackPromptIdentity(FeedbackPromptAudience.ADMIN, user.getId(), null, clubId);
        }
        if (user != null && StringUtils.hasText(user.getId())) {
            return new FeedbackPromptIdentity(FeedbackPromptAudience.USER, user.getId(), null, clubId);
        }
        if (StringUtils.hasText(anonymousClientId)) {
            return new FeedbackPromptIdentity(FeedbackPromptAudience.USER, null, anonymousClientId, clubId);
        }
        return null;
    }

    void saveInteraction(
            FeedbackPromptDefinition prompt,
            FeedbackPromptIdentity identity,
            FeedbackPromptInteractionType type
    ) {
        interactionRepository.save(FeedbackPromptInteraction.builder()
                .promptId(prompt.getId())
                .triggerType(prompt.getTriggerType())
                .audience(identity.audience())
                .userId(identity.userId())
                .anonymousClientId(identity.anonymousClientId())
                .clubId(identity.clubId())
                .type(type)
                .build());
    }
}
