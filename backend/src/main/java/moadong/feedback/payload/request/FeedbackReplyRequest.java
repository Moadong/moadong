package moadong.feedback.payload.request;

import jakarta.validation.constraints.NotBlank;

public record FeedbackReplyRequest(
        @NotBlank(message = "제목은 필수입니다.")
        String title,

        @NotBlank(message = "본문은 필수입니다.")
        String body,

        boolean sendPush,

        // 재시도 식별용. 같은 답장에 대해 같은 값을 보내면 중복 발행과 중복 푸시를 막는다.
        // 이미 답장한 피드백에도 답장할 수 있어서, 키가 없으면 중복을 막을 장치가 없으므로 필수다.
        @NotBlank(message = "requestId는 필수입니다.")
        String requestId,

        // 운영자가 화면에서 본 마지막 답장 id. 아직 답장이 없던 피드백이면 null이다.
        // 서버 값과 다르면 그 사이 다른 답장이 나간 것이라 이 답장을 거절한다.
        String lastReplyLetterId
) {
}
