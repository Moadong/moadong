package moadong.feedback.prompt.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.feedback.prompt.entity.FeedbackPromptDefinition;
import moadong.feedback.prompt.entity.FeedbackPromptExposurePolicy;
import moadong.feedback.prompt.entity.FeedbackPromptFollowUp;
import moadong.feedback.prompt.entity.FeedbackPromptRatingOption;
import moadong.feedback.prompt.entity.FeedbackPromptReasonOption;
import moadong.feedback.prompt.enums.FeedbackPromptAudience;
import moadong.feedback.prompt.enums.FeedbackPromptRating;
import moadong.feedback.prompt.enums.FeedbackPromptTriggerType;
import moadong.feedback.prompt.repository.FeedbackPromptDefinitionRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FeedbackPromptSeedService implements ApplicationRunner {

    private final FeedbackPromptDefinitionRepository definitionRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedAdminPrompt(
                FeedbackPromptTriggerType.ADMIN_CLUB_BASIC_INFO_CREATED,
                "동아리 기본정보 등록 과정은 어떠셨나요?");
        seedAdminPrompt(
                FeedbackPromptTriggerType.ADMIN_CLUB_INFO_UPDATED,
                "동아리 정보 수정 과정은 어떠셨나요?");
        seedAdminPrompt(
                FeedbackPromptTriggerType.ADMIN_RECRUITMENT_INFO_SAVED,
                "모집 정보 등록/수정 과정은 어떠셨나요?");
        seedUserPrompt();
    }

    private void seedAdminPrompt(FeedbackPromptTriggerType triggerType, String title) {
        if (definitionRepository.existsByTriggerType(triggerType)) {
            return;
        }
        definitionRepository.save(baseBuilder(triggerType, FeedbackPromptAudience.ADMIN, title)
                .exposurePolicy(FeedbackPromptExposurePolicy.adminDefault())
                .build());
    }

    private void seedUserPrompt() {
        FeedbackPromptTriggerType triggerType = FeedbackPromptTriggerType.USER_CLUB_DETAIL_EXIT;
        if (definitionRepository.existsByTriggerType(triggerType)) {
            return;
        }
        definitionRepository.save(baseBuilder(
                        triggerType,
                        FeedbackPromptAudience.USER,
                        "동아리 상세정보는 도움이 되었나요?")
                .exposurePolicy(FeedbackPromptExposurePolicy.userClubExitDefault())
                .build());
    }

    private FeedbackPromptDefinition.FeedbackPromptDefinitionBuilder baseBuilder(
            FeedbackPromptTriggerType triggerType,
            FeedbackPromptAudience audience,
            String title
    ) {
        return FeedbackPromptDefinition.builder()
                .triggerType(triggerType)
                .audience(audience)
                .title(title)
                .description("더 나은 모아동을 위해 잠깐 시간을 내주세요")
                .ratingOptions(defaultRatingOptions())
                .followUp(defaultFollowUp())
                .displayOrder(1)
                .active(true);
    }

    private List<FeedbackPromptRatingOption> defaultRatingOptions() {
        return List.of(
                FeedbackPromptRatingOption.builder()
                        .rating(FeedbackPromptRating.POSITIVE)
                        .label("편했어요")
                        .displayOrder(1)
                        .requiresFollowUp(false)
                        .build(),
                FeedbackPromptRatingOption.builder()
                        .rating(FeedbackPromptRating.NEUTRAL)
                        .label("보통이에요")
                        .displayOrder(2)
                        .requiresFollowUp(false)
                        .build(),
                FeedbackPromptRatingOption.builder()
                        .rating(FeedbackPromptRating.NEGATIVE)
                        .label("불편했어요")
                        .displayOrder(3)
                        .requiresFollowUp(true)
                        .build());
    }

    private FeedbackPromptFollowUp defaultFollowUp() {
        return FeedbackPromptFollowUp.builder()
                .reasonQuestion("어떤 부분이 가장 불편했나요?")
                .reasonOptions(defaultReasonOptions())
                .commentQuestion("조금 더 알려주실 수 있나요?")
                .commentPlaceholder("어떤 상황에서 불편했는지 알려주시면 개선에 큰 도움이 돼요.")
                .commentMaxLength(500)
                .build();
    }

    private List<FeedbackPromptReasonOption> defaultReasonOptions() {
        return List.of(
                reason("TOO_MANY_FIELDS", "입력해야 할 정보가 많아요", 1),
                reason("HARD_TO_FIND_ITEM", "원하는 항목을 찾기 어려워요", 2),
                reason("PHOTO_UPLOAD", "사진 등록이 불편해요", 3),
                reason("MOBILE_USABILITY", "모바일에서 사용하기 불편해요", 4),
                reason("SAVE_FLOW", "저장/수정 과정이 불편해요", 5),
                reason("ERROR_OCCURRED", "오류가 있었어요", 6),
                reason("OTHER", "기타", 7));
    }

    private FeedbackPromptReasonOption reason(String id, String label, int displayOrder) {
        return FeedbackPromptReasonOption.builder()
                .id(id)
                .label(label)
                .displayOrder(displayOrder)
                .active(true)
                .build();
    }
}
