package moadong.user.payload.response;

import jakarta.validation.constraints.NotNull;
import moadong.global.annotation.Password;

public record TempPasswordResponse(
        @NotNull
        @Password
        String tempPassword
){ }
