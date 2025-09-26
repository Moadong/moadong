package moadong.user.payload.response;

import jakarta.validation.constraints.NotNull;

public record TempPasswordResponse(
        @NotNull
        String tempPassword
){ }
