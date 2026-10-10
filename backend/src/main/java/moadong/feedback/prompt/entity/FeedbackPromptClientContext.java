package moadong.feedback.prompt.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackPromptClientContext {

    private String path;
    private String deviceType;
    private String userAgent;
    private boolean appWebView;
}
