package moadong.media.dto;

import java.util.Map;

public record PresignedUploadResponse(
    String presignedUrl, 
    String finalUrl,
    Map<String, String> requiredHeaders,
    boolean success,
    String failureReason
) {
}

