package moadong.feedback.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.LetterCategory;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminSentLetterResponse(
        String id,
        LetterCategory category,
        String title,
        String body,
        // REPLY 편지의 받는 사람. 학생 UUID 대신 피드백 목록과 같은 표시용 익명 식별자를 쓴다.
        // 전체 발행 편지(UPDATE / STORY)는 받는 사람이 없어 null이다.
        String recipient,
        // REPLY 편지가 답장한 원본 피드백. 그 외 카테고리는 null이다.
        String feedbackId,
        int pushSuccessCount,
        Instant createdAt
) {

    public static AdminSentLetterResponse of(Letter letter, String recipient) {
        return new AdminSentLetterResponse(
                letter.getId(),
                letter.getCategory(),
                letter.getTitle(),
                letter.getBody(),
                recipient,
                letter.getFeedbackId(),
                letter.getPushSuccessCount(),
                letter.getCreatedAt()
        );
    }
}
