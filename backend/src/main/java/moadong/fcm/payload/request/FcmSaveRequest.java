package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotNull;

public record FcmSaveRequest(
        @NotNull
        String fcmToken
) {
}
