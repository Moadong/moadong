package moadong.analytics.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "mixpanel")
public record MixpanelProperties(
        boolean enabled,
        String server,
        String projectId,
        ServiceAccount serviceAccount,
        Backfill backfill
) {
    public record ServiceAccount(String username, String secret) {}

    public record Backfill(Integer requestLimit, Integer maxRangeDays) {
        public int effectiveRequestLimit() {
            return requestLimit == null || requestLimit <= 0 ? 100000 : requestLimit;
        }

        public int effectiveMaxRangeDays() {
            return maxRangeDays == null || maxRangeDays <= 0 ? 31 : maxRangeDays;
        }
    }

    public String effectiveServer() {
        return server == null || server.isBlank() ? "data.mixpanel.com" : server;
    }
}
