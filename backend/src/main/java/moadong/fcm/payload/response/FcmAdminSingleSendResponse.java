package moadong.fcm.payload.response;

public record FcmAdminSingleSendResponse(
        String token,
        String messageId
) {
}
