package moadong.unit.user;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import moadong.user.entity.RefreshToken;
import moadong.user.entity.User;
import moadong.user.payload.CustomUserDetails;
import moadong.user.payload.request.UserLoginRequest;
import moadong.user.payload.response.LoginResponse;
import moadong.user.repository.UserRepository;
import moadong.user.service.UserCommandService;
import moadong.user.util.CookieMaker;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import static com.mongodb.assertions.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@UnitTest
public class UserLoginTest {
    private static Validator validator;
    @Spy
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Mock
    private UserRepository userRepository;
    @Mock
    private ClubRepository clubRepository;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtProvider jwtProvider;
    @Mock
    private CookieMaker cookieMaker;
    @InjectMocks
    private UserCommandService userCommandService;
    private MockHttpServletResponse realHttpServletResponse = new MockHttpServletResponse();

    @BeforeAll
    public static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void 정상적으로_로그인_시도를_할_경우_작동한다(){
        // Given
        UserLoginRequest request = new UserLoginRequest("testUser", "password");
        String mockClubId = "clubId";
        Club mockClub = mock(Club.class);
        User mockUser = new User();
        CustomUserDetails userDetails = new CustomUserDetails(mockUser);
        long refreshTokenExpiredTime = 1123L;

        // When
        when(authenticationManager.authenticate(any()))
                .thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null));
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.of(mockClub));
        when(mockClub.getId()).thenReturn(mockClubId);
        when(userRepository.findUserByUserId(any())).thenReturn(Optional.of(mockUser));
        when(jwtProvider.generateAccessToken(any())).thenReturn("accessToken123");
        when(jwtProvider.generateRefreshToken(any()))
                .thenReturn(new RefreshToken("refreshToken123", Date.from(Instant.now().plusSeconds(refreshTokenExpiredTime))));
        when(cookieMaker.makeRefreshTokenCookie(any())).thenReturn(ResponseCookie.from("refreshToken", "refreshToken123").build());


        LoginResponse result = userCommandService.loginUser(request, realHttpServletResponse);

        // Then
        assertEquals("accessToken123", result.accessToken());
        assertEquals(mockClubId, result.clubId());

        verify(userRepository).save(any(User.class));
        assertTrue(realHttpServletResponse.getHeader("Set-Cookie").contains("refreshToken=refreshToken123"));
    }

    @Test
    void 없는_아이디와_비밀번호를_입력_시에_실패한다(){
        UserLoginRequest request = new UserLoginRequest("testUser", "password");
        User mockUser = new User();
        CustomUserDetails userDetails = new CustomUserDetails(mockUser);

        // When
        when(authenticationManager.authenticate(any()))
                .thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null));
        when(clubRepository.findClubByUserId(any())).thenReturn(Optional.empty());

        assertThrows(RestApiException.class, ()->{
            LoginResponse result = userCommandService.loginUser(request, realHttpServletResponse);
        });
    }
}
