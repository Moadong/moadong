package moadong.user.service;

import com.mongodb.MongoWriteException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import moadong.user.entity.User;
import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.request.UserRegisterRequest;
import moadong.user.payload.request.UserUpdateRequest;
import moadong.user.payload.response.AccessTokenResponse;
import moadong.user.repository.UserInformationRepository;
import moadong.user.repository.UserRepository;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserCommandService {
    private final UserRepository userRepository;
    private final UserInformationRepository userInformationRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(UserRegisterRequest userRegisterRequest) {
        try {
            String encodedPw = passwordEncoder.encode(userRegisterRequest.password());
            User user = userRepository.save(userRegisterRequest.toUserEntity(encodedPw));
            userInformationRepository.save(userRegisterRequest.toUserInformationEntity(user.getId()));
        } catch (MongoWriteException e) {
            throw new RestApiException(ErrorCode.USER_ALREADY_EXIST);
        }
    }

    public AccessTokenResponse loginUser(UserLoginRequest userLoginRequest, HttpServletResponse response) {
        try {
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userLoginRequest.userId(), userLoginRequest.password()));

            UserDetails userDetails = (UserDetails) authenticate.getPrincipal();
            String accessToken = jwtProvider.generateAccessToken(userDetails.getUsername());
            String refreshToken = jwtProvider.generateRefreshToken(userDetails.getUsername());

            ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .secure(true)
                    .build();
            response.addHeader("Set-Cookie", cookie.toString());

            return new AccessTokenResponse(accessToken);
        } catch (MongoWriteException e) {
            throw new RestApiException(ErrorCode.USER_ALREADY_EXIST);
        }
    }

    public AccessTokenResponse refreshAccessToken(String refreshToken) {
        if (refreshToken.isBlank() ||
                !jwtProvider.validateToken(refreshToken, jwtProvider.extractUsername(refreshToken))) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
        String userId = jwtProvider.extractUsername(refreshToken);
        String accessToken = jwtProvider.generateAccessToken(userId);
        return new AccessTokenResponse(accessToken);


    }

    public void update(String userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findUserByUserId(userId)
            .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));

        user.update(userUpdateRequest);

        userRepository.save(user);
    }
}
