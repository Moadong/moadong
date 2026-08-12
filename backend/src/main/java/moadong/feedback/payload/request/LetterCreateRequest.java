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

        boolean sendPush
) {
}
