package moadong.feedback.payload.response;

public record FeedbackReplyResponse(
        String letterId,
        boolean pushSent
) {
}
