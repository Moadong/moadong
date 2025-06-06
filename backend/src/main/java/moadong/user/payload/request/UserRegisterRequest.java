package moadong.user.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moadong.global.annotation.Korean;
import moadong.global.annotation.Password;
import moadong.global.annotation.PhoneNumber;
import moadong.global.annotation.UserId;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.User;
import moadong.user.entity.UserInformation;
import org.springframework.security.crypto.password.PasswordEncoder;

public record UserRegisterRequest(
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
        String phoneNumber
) {
    public UserRegisterRequest{
        if (userId.equals(password)) {
            throw new RestApiException(ErrorCode.USER_INVALID_FORMAT);
        }
    }

    public User toUserEntity(PasswordEncoder passwordEncoder) {
        return User.builder()
                .userId(userId)
                .password(passwordEncoder.encode(password))
                .userInformation(new UserInformation(name,phoneNumber))
                .build();
    }

    public UserInformation toUserInformationEntity(String userId) {
        return UserInformation.builder()
                .name(name)
                .phoneNumber(phoneNumber)
                .build();
    }
}
