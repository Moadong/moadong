package moadong.user.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.global.annotation.Password;
import moadong.global.annotation.UserId;
import org.springframework.security.crypto.password.PasswordEncoder;

public record UserUpdateRequest(
    @NotNull
    @UserId
    String userId,
    @NotNull
    @Password
    String password
) {
    public UserUpdateRequest encryptPassword(PasswordEncoder passwordEncoder){
        return new UserUpdateRequest(userId, passwordEncoder.encode(this.password));
    }

}
