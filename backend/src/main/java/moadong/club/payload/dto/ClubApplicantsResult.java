package moadong.club.payload.dto;

import lombok.Builder;
import moadong.club.entity.ClubApplication;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.enums.ApplicationStatus;

import java.util.List;

@Builder
public record ClubApplicantsResult(
        String questionId,
        ApplicationStatus status,
        List<ClubQuestionAnswer> answers
) {
    public static ClubApplicantsResult of(ClubApplication application) {
        return ClubApplicantsResult.builder()
                .questionId(application.getQuestionId())
                .status(application.getStatus())
                .answers(application.getAnswers())
                .build();
    }
}
