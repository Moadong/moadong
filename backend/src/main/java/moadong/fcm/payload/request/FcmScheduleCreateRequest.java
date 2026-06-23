package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import moadong.fcm.enums.FcmScheduleTargetType;

import java.time.OffsetDateTime;
import java.util.Map;

public record FcmScheduleCreateRequest(
        @NotNull
        FcmScheduleTargetType targetType,
        String token,
        @NotBlank
        String title,
        @NotBlank
        String body,
        Map<String, String> data,
        @NotNull
        OffsetDateTime scheduledAt
) {
}
