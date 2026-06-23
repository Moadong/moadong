package moadong.fcm.model;

import java.util.List;
import java.util.Map;

public record MulticastPushPayload(
        List<String> tokens,
        String title,
        String body,
        Map<String, String> data
) {
}
