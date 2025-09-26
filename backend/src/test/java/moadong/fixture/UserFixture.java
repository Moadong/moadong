package moadong.fixture;

import moadong.user.entity.User;
import moadong.user.entity.UserInformation;
import moadong.user.payload.CustomUserDetails;
import moadong.user.payload.request.UserRegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserFixture {
    public static final String collectUserId = "test1112";
    public static final String collectPassword = "test1112@";
    public static final String collectName = "테스터";
    public static final String collectPhoneNumber = "010-1234-5678";

    public static User createUser(PasswordEncoder passwordEncoder, String userId, String password, String name, String phoneNumber) {
        return new UserRegisterRequest(userId, password, name, phoneNumber).toUserEntity(passwordEncoder);
    }

    public static User createUser(PasswordEncoder passwordEncoder){
        return new UserRegisterRequest(collectUserId,collectPassword,collectName,collectPhoneNumber).toUserEntity(passwordEncoder);
    }

    public static CustomUserDetails createUserDetails(String userId) {
        return new CustomUserDetails(
                User.builder()
                        .id(userId)
                        .userInformation(new UserInformation(collectUserId, collectPhoneNumber))
                        .password(collectPassword)
                        .build()
        );
    }

}
