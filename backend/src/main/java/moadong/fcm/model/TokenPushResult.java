package moadong.fcm.model;

public record TokenPushResult(
        boolean success,
        String messageId
) {
}
