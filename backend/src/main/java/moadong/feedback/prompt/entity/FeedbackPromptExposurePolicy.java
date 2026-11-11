package moadong.feedback.prompt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptExposurePolicy {

    private int answeredCooldownDays;
    private int dismissedCooldownDays;
    private int shownCooldownHours;
    private boolean oncePerClub;
    private int dailyExposureLimit;

    public static FeedbackPromptExposurePolicy adminDefault() {
        return FeedbackPromptExposurePolicy.builder()
                .answeredCooldownDays(30)
                .dismissedCooldownDays(7)
                .shownCooldownHours(24)
                .oncePerClub(false)
                .dailyExposureLimit(0)
                .build();
    }

    public static FeedbackPromptExposurePolicy userClubExitDefault() {
        return FeedbackPromptExposurePolicy.builder()
                .answeredCooldownDays(0)
                .dismissedCooldownDays(7)
                .shownCooldownHours(24)
                .oncePerClub(true)
                .dailyExposureLimit(1)
                .build();
    }
}
