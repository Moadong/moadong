package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record FcmAdminBatchSendRequest(
        @NotBlank
        String title,
        @NotBlank
        String body,
        Map<String, String> data
) {
}
