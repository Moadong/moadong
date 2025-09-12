package moadong.user.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.global.annotation.Password;
import moadong.global.annotation.UserId;
import org.springframework.security.crypto.password.PasswordEncoder;

public record UserUpdateRequest(
    @NotNull
    @Password
    String password
) {
    public UserUpdateRequest encryptPassword(PasswordEncoder passwordEncoder){
        return new UserUpdateRequest(passwordEncoder.encode(this.password));
    }

}
