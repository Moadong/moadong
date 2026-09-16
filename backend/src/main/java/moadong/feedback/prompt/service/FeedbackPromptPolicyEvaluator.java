package moadong.feedback.prompt.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.enums.FeedbackPromptIneligibleReason;
import moadong.feedback.prompt.enums.FeedbackPromptInteractionType;
import moadong.feedback.prompt.repository.FeedbackPromptInteractionQueryRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class FeedbackPromptPolicyEvaluator {

    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    private final FeedbackPromptInteractionQueryRepository interactionQueryRepository;

    public FeedbackPromptIneligibleReason evaluate(
            FeedbackPromptDefinition prompt,
            FeedbackPromptIdentity identity,
            Instant now
    ) {
        FeedbackPromptExposurePolicy policy = prompt.getExposurePolicy();
        if (policy.isOncePerClub()) {
            if (!StringUtils.hasText(identity.clubId())) {
                return FeedbackPromptIneligibleReason.UNAUTHORIZED;
            }
            if (interactionQueryRepository.existsAnsweredForClub(
                    prompt.getAudience(), identity.userId(), identity.anonymousClientId(),
                    prompt.getTriggerType(), identity.clubId())) {
                return FeedbackPromptIneligibleReason.USER_CLUB_ALREADY_ANSWERED;
            }
        }
        if (isWithinCooldown(prompt, identity, FeedbackPromptInteractionType.ANSWERED,
                Duration.ofDays(policy.getAnsweredCooldownDays()), now)) {
            return FeedbackPromptIneligibleReason.ANSWERED_COOLDOWN;
        }
        if (isWithinCooldown(prompt, identity, FeedbackPromptInteractionType.DISMISSED,
                Duration.ofDays(policy.getDismissedCooldownDays()), now)) {
            return FeedbackPromptIneligibleReason.DISMISSED_COOLDOWN;
        }
        if (isWithinCooldown(prompt, identity, FeedbackPromptInteractionType.SHOWN,
                Duration.ofHours(policy.getShownCooldownHours()), now)) {
            return FeedbackPromptIneligibleReason.SHOWN_COOLDOWN;
        }
        if (policy.getDailyExposureLimit() > 0 && shownToday(prompt, identity, now) >= policy.getDailyExposureLimit()) {
            return FeedbackPromptIneligibleReason.USER_DAILY_LIMIT;
        }
        return null;
    }

    private boolean isWithinCooldown(
            FeedbackPromptDefinition prompt,
            FeedbackPromptIdentity identity,
            FeedbackPromptInteractionType type,
            Duration cooldown,
            Instant now
    ) {
        if (cooldown.isZero() || cooldown.isNegative()) {
            return false;
        }
        return interactionQueryRepository.findLatest(
                        prompt.getAudience(),
                        identity.userId(),
                        identity.anonymousClientId(),
                        prompt.getTriggerType(),
                        identity.clubId(),
                        type)
                .map(interaction -> interaction.getCreatedAt().plus(cooldown).isAfter(now))
                .orElse(false);
    }

    private long shownToday(FeedbackPromptDefinition prompt, FeedbackPromptIdentity identity, Instant now) {
        LocalDate today = LocalDate.ofInstant(now, SEOUL_ZONE);
        Instant from = today.atStartOfDay(SEOUL_ZONE).toInstant();
        Instant to = today.plusDays(1).atStartOfDay(SEOUL_ZONE).toInstant();
        return interactionQueryRepository.countShownBetween(
                prompt.getAudience(), identity.userId(), identity.anonymousClientId(), from, to);
    }
}
