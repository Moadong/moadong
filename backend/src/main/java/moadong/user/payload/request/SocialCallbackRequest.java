package moadong.user.payload.request;

import jakarta.validation.constraints.NotBlank;

public record SocialCallbackRequest(
        @NotBlank String code,
        @NotBlank String redirectUri
) {
}
