package moadong.media.dto;

import jakarta.validation.constraints.NotBlank;

public record UploadCompleteRequest(
        @NotBlank
        String fileUrl
) {
}

