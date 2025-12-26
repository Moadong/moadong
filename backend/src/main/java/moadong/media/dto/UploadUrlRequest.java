package moadong.media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UploadUrlRequest(
        @NotBlank
        String fileName,
        @NotBlank
        @Pattern(regexp = "^image/(jpeg|jpg|png|gif|bmp|webp)$", message = "지원되지 않는 MIME 타입입니다.")
        String contentType
) {
}

