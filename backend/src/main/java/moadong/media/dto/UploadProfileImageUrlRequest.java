package moadong.media.dto;

import jakarta.validation.constraints.NotBlank;

public record UploadProfileImageUrlRequest(
        @NotBlank String fileName,
        @NotBlank String contentType
) {}
