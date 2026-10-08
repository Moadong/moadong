package moadong.user.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateNicknameRequest(
        @NotBlank
        @Size(max = 20)
        String nickname
) {}
