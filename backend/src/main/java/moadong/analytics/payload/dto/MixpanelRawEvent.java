package moadong.analytics.payload.dto;

import java.util.Map;

public record MixpanelRawEvent(
        String event,
        Map<String, Object> properties
) {
}
