package moadong.fcm.model;

import java.util.Map;

public record TokenPushPayload(
        String token,
        String title,
        String body,
        Map<String, String> data
) {
}
