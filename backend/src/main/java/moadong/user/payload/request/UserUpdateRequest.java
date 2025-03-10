package moadong.user.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.global.annotation.Password;
import moadong.global.annotation.UserId;

public record UserUpdateRequest(
    @NotNull
    @UserId
    String userId,
    @NotNull
    @Password
    String password
) {

}
