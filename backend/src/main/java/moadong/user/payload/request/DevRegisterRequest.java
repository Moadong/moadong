package moadong.user.payload.request;

import jakarta.validation.constraints.NotBlank;
import moadong.global.annotation.Korean;
import moadong.global.annotation.Password;
import moadong.global.annotation.PhoneNumber;
import moadong.global.annotation.UserId;

public record DevRegisterRequest(
        @NotBlank
        @UserId
        String userId,
        @NotBlank
        @Password
        String password,
        @NotBlank
        @Korean
        String name,
        @PhoneNumber
        String phoneNumber,
        @NotBlank
        String secret
) {
}
