// 발행한 편지의 제목·본문을 고칠 때 받는 요청
package moadong.feedback.payload.request;

import jakarta.validation.constraints.NotBlank;

public record LetterUpdateRequest(
        @NotBlank(message = "제목은 필수입니다.")
        String title,

        @NotBlank(message = "본문은 필수입니다.")
        String body
) {
}
