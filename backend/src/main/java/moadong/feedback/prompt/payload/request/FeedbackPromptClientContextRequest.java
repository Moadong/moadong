package moadong.feedback.prompt.payload.request;

import moadong.feedback.prompt.entity.FeedbackPromptClientContext;

public record FeedbackPromptClientContextRequest(
        String path,
        String deviceType,
        String userAgent,
        boolean appWebView
) {

    public FeedbackPromptClientContext toEntity() {
        return FeedbackPromptClientContext.builder()
                .path(path)
                .deviceType(deviceType)
                .userAgent(userAgent)
                .appWebView(appWebView)
                .build();
    }
}
