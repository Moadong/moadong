package moadong.feedback.enums;

/**
 * 운영자에게 노출되는 3단계 상태. 사용자에게는 {@link SentFeedbackStatus}로 축약해 내려간다.
 */
public enum FeedbackStatus {
    WAITING,
    IN_PROGRESS,
    REPLIED;

    public SentFeedbackStatus toSentStatus() {
        return this == REPLIED ? SentFeedbackStatus.REPLIED : SentFeedbackStatus.PENDING;
    }
}
