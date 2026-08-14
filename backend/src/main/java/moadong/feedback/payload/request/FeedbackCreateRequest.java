package moadong.feedback.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moadong.feedback.enums.FeedbackType;

import java.util.List;

public record FeedbackCreateRequest(
        @NotNull(message = "피드백 유형은 필수입니다.")
        FeedbackType type,

        @NotBlank(message = "내용은 필수입니다.")
        @Size(min = 10, max = 300, message = "내용은 10자 이상 300자 이하로 입력해주세요.")
        String content,

        // 미리 업로드한 사진의 최종 URL. 장수 · 소유 경로 · 실제 업로드 여부는 서버가 다시 검증한다.
        List<String> images
) {
}
