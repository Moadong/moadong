package moadong.fcm.model;

import java.util.Map;

public record PushPayload(
        String title,
        String body,
        String topic,
        Map<String, String> data
) {
}
