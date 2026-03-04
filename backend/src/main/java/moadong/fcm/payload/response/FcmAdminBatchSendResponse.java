package moadong.fcm.payload.response;

import java.util.List;

public record FcmAdminBatchSendResponse(
        int totalTokenCount,
        int batchCount,
        int successCount,
        int failureCount,
        List<String> failedTokens
) {
}
