package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record FcmAdminSingleSendRequest(
        @NotBlank
        String token,
        @NotBlank
        String title,
        @NotBlank
        String body,
        Map<String, String> data
) {
}
