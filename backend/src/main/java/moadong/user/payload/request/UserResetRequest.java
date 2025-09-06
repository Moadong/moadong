package moadong.user.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.global.annotation.UserId;

public record UserResetRequest (
        @NotNull
        @UserId
        String userId
) {
}
