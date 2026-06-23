package moadong.fcm.model;

import java.util.List;

public record MulticastPushResult(
        int batchCount,
        int successCount,
        int failureCount,
        List<String> failedTokens
) {
}
