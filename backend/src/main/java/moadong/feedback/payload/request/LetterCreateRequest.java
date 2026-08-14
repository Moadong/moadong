package moadong.feedback.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import moadong.feedback.enums.LetterCategory;

public record LetterCreateRequest(
        @NotNull(message = "편지 분류는 필수입니다.")
        LetterCategory category,

        @NotBlank(message = "제목은 필수입니다.")
        String title,

        @NotBlank(message = "본문은 필수입니다.")
        String body,

        boolean sendPush,

        // 재시도 식별용. 같은 편지에 대해 같은 값을 보내면 중복 발행과 중복 푸시를 막는다.
        String requestId
) {
}
