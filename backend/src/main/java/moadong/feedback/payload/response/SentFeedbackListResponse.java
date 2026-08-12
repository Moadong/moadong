package moadong.feedback.payload.response;

import java.util.List;

public record SentFeedbackListResponse(
        List<SentFeedbackResponse> feedbacks
) {
}
