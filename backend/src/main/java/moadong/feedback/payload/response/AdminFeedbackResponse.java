package moadong.feedback.payload.response;

import moadong.feedback.entity.Feedback;
import moadong.feedback.enums.FeedbackStatus;
import moadong.feedback.enums.FeedbackType;

import java.time.Instant;
import java.util.List;

public record AdminFeedbackResponse(
        String id,
        FeedbackType type,
        String content,
        List<String> images,
        // 학생 UUID를 그대로 노출하지 않기 위한 표시용 익명 식별자 (예: user_8842)
        String sender,
        FeedbackStatus status,
        Instant createdAt,
        // 답장할 때 그대로 돌려보내, 그 사이 다른 운영자가 답장했는지 서버가 알아볼 수 있게 한다.
        String replyLetterId
) {

    public static AdminFeedbackResponse of(Feedback feedback, String sender) {
        return new AdminFeedbackResponse(
                feedback.getId(),
                feedback.getType(),
                feedback.getContent(),
                feedback.getImages() == null ? List.of() : feedback.getImages(),
                sender,
                feedback.getStatus(),
                feedback.getCreatedAt(),
                feedback.getReplyLetterId()
        );
    }
}
