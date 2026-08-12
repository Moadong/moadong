package moadong.feedback.payload.request;

import jakarta.validation.constraints.NotBlank;

public record FeedbackReplyRequest(
        @NotBlank(message = "제목은 필수입니다.")
        String title,

        @NotBlank(message = "본문은 필수입니다.")
        String body,

        boolean sendPush
) {
}
