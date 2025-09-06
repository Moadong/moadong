package moadong.user.service;

import com.mongodb.MongoWriteException;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Date;
import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import moadong.global.util.SecurePasswordGenerator;
import moadong.user.entity.RefreshToken;
import moadong.user.entity.User;
import moadong.user.payload.CustomUserDetails;
import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.request.UserRegisterRequest;
import moadong.user.payload.request.UserUpdateRequest;
import moadong.user.payload.response.LoginResponse;
import moadong.user.payload.response.RefreshResponse;
import moadong.user.payload.response.TempPasswordResponse;
import moadong.user.repository.UserRepository;
import moadong.user.util.CookieMaker;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserCommandService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final ClubRepository clubRepository;
    private final CookieMaker cookieMaker;
    private final SecurePasswordGenerator securePasswordGenerator;

    public User registerUser(UserRegisterRequest userRegisterRequest) {
        try {
            User user = userRepository.save(userRegisterRequest.toUserEntity(passwordEncoder));
            createClub(user.getId());
            return user;
        } catch (MongoWriteException e) {
            throw new RestApiException(ErrorCode.USER_ALREADY_EXIST);
        }
    }

    public LoginResponse loginUser(UserLoginRequest userLoginRequest,
        HttpServletResponse response) {
        try {
            Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginRequest.userId(),
                    userLoginRequest.password()));
            CustomUserDetails userDetails = (CustomUserDetails) authenticate.getPrincipal();
            Club club = clubRepository.findClubByUserId(userDetails.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
            User user = userRepository.findUserByUserId(userDetails.getUserId())
                .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));

            String accessToken = jwtProvider.generateAccessToken(userDetails.getUsername());
            RefreshToken refreshToken = jwtProvider.generateRefreshToken(userDetails.getUsername());

            ResponseCookie cookie = cookieMaker.makeRefreshTokenCookie(refreshToken.getToken());
            response.addHeader("Set-Cookie", cookie.toString());

            user.updateRefreshToken(refreshToken);
            userRepository.save(user);
            return new LoginResponse(accessToken, club.getId());
        } catch (MongoWriteException e) {
            throw new RestApiException(ErrorCode.USER_ALREADY_EXIST);
        }
    }

    public void logoutUser(String refreshToken) {
        User user = userRepository.findUserByRefreshToken_Token(refreshToken)
            .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));

        user.updateRefreshToken(null);
        userRepository.save(user);
    }

    public RefreshResponse refreshAccessToken(String refreshToken,
        HttpServletResponse response) {
        if (refreshToken.isBlank() ||
            !jwtProvider.validateToken(refreshToken, jwtProvider.extractUsername(refreshToken))) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
        String userId = jwtProvider.extractUsername(refreshToken);
        User user = userRepository.findUserByUserId(userId)
            .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));

        if (!user.getRefreshToken().getToken().equals(refreshToken)
            || jwtProvider.isTokenExpired(refreshToken)) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
        String accessToken = jwtProvider.generateAccessToken(userId);
        String newRefreshToken = jwtProvider.generateRefreshToken(userId).getToken();

        user.updateRefreshToken(new RefreshToken(newRefreshToken, new Date()));
        userRepository.save(user);

        ResponseCookie cookie = cookieMaker.makeRefreshTokenCookie(newRefreshToken);
        response.addHeader("Set-Cookie", cookie.toString());
        return new RefreshResponse(accessToken);
    }

    public void update(String userId,
        UserUpdateRequest userUpdateRequest,
        HttpServletResponse response) {
        User user = userRepository.findUserByUserId(userId)
            .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));

        //아이디와 동일한지
        if (userId.equals(userUpdateRequest.password())) {
            throw new RestApiException(ErrorCode.PASSWORD_SAME_AS_USERID);
        }
        //기존 비밀번호와 동일한지
        if (passwordEncoder.matches(userUpdateRequest.password(), user.getPassword())) {
            throw new RestApiException(ErrorCode.PASSWORD_SAME_AS_OLD);
        }

        user.updateUserProfile(userUpdateRequest.encryptPassword(passwordEncoder));

        userRepository.save(user);

        String newRefreshToken = jwtProvider.generateRefreshToken(user.getUsername()).getToken();
        ResponseCookie cookie = cookieMaker.makeRefreshTokenCookie(newRefreshToken);
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public TempPasswordResponse reset(String userId) {
        User user = userRepository.findUserByUserId(userId)
                .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));

        //랜덤 임시 비밀번호 생성
        TempPasswordResponse tempPwdResponse = new TempPasswordResponse(
                securePasswordGenerator.generate(8));

        //암호화
        user.resetPassword(passwordEncoder.encode(tempPwdResponse.tempPassword()));

        user.updateRefreshToken(null);
        userRepository.save(user);

        return tempPwdResponse;
    }

    public String findClubIdByUserId(String userID) {
        Club club = clubRepository.findClubByUserId(userID)
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        return club.getId();
    }

    private void createClub(String userId) {
        Club club = new Club(userId);
        clubRepository.save(club);
    }

}
