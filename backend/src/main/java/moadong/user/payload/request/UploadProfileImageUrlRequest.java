package moadong.user.payload.request;

import jakarta.validation.constraints.NotBlank;

public record UploadProfileImageUrlRequest(
        @NotBlank String fileName,
        @NotBlank String contentType
) {}
