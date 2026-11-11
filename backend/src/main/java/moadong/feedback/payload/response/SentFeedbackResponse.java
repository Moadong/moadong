package moadong.feedback.payload.response;

import moadong.feedback.entity.Feedback;
import moadong.feedback.enums.FeedbackType;
import moadong.feedback.enums.SentFeedbackStatus;

import java.time.Instant;
import java.util.List;

public record SentFeedbackResponse(
        String id,
        FeedbackType type,
        String content,
        List<String> images,
        SentFeedbackStatus status,
        Instant createdAt
) {

    public static SentFeedbackResponse from(Feedback feedback) {
        return new SentFeedbackResponse(
                feedback.getId(),
                feedback.getType(),
                feedback.getContent(),
                feedback.getImages() == null ? List.of() : feedback.getImages(),
                feedback.getStatus().toSentStatus(),
                feedback.getCreatedAt()
        );
    }
}
