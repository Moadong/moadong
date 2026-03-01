package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotBlank;

public record StudentFcmTokenRotateRequest(
        @NotBlank
        String fcmToken
) {
}
