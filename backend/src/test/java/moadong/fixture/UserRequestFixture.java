package moadong.fixture;

import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.request.UserRegisterRequest;

public class UserRequestFixture {
    public static UserRegisterRequest createUserRegisterRequest(String userId, String password, String name, String phoneNumber) {
        return new UserRegisterRequest(userId, password, name, phoneNumber);
    }
    public static UserLoginRequest createUserLoginRequest(String userId, String password){
        return new UserLoginRequest(userId,password);
    }
}
