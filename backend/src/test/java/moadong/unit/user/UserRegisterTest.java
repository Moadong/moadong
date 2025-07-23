package moadong.unit.user;


import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.fixture.UserFixture;
import moadong.fixture.UserRequestFixture;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import moadong.user.entity.User;
import moadong.user.payload.request.UserRegisterRequest;
import moadong.user.repository.UserRepository;
import moadong.user.service.UserCommandService;
import moadong.user.util.CookieMaker;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.*;

@UnitTest
class UserRegisterTest {
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

    @BeforeAll
    public static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void 회원가입시_올바른_정보를_입력하면_성공한다() {
        // given
        String userId = UserFixture.collectUserId;
        String password = UserFixture.collectPassword;
        String name = UserFixture.collectName;
        String phoneNumber = UserFixture.collectPhoneNumber;

        doAnswer(invocation -> invocation.getArgument(0))
                .when(userRepository).save(any(User.class));
        doReturn(new Club(userId)).when(clubRepository).save(any(Club.class));

        UserRegisterRequest request = UserRequestFixture.createUserRegisterRequest(userId, password, name, phoneNumber);

        // when
        User userResponse = userCommandService.registerUser(request);

        // then
        assertThat(userResponse).isNotNull();
        assertThat(userResponse.getUserId()).isEqualTo(userId);
        assertThat(userResponse.getUserInformation().getName()).isEqualTo(name);
        assertThat(userResponse.getUserInformation().getPhoneNumber()).isEqualTo(phoneNumber);
        assertThat(passwordEncoder.matches(password, userResponse.getPassword())).isTrue();

        verify(userRepository, times(1)).save(any(User.class));
        verify(clubRepository, times(1)).save(any(Club.class));
    }

    /*
    아이디 규칙
    • 5자 ~ 20자
    • 적어도 하나의 소문자, 하나의 숫자가 포함
    • 소문자, 대문자, 숫자, 특수문자(!@#$~) 만 사용
     */
    @ParameterizedTest
    @ValueSource(strings = {
            "",                         // 빈 문자열
            "    ",                     // 공백만
            "abcde",                    // 숫자 없음
            "ABCDE",                    // 숫자, 소문자 없음
            "12345",                    // 소문자 없음
            "ab!@",                     // 5자 미만 + 숫자 없음
            "abc123%^",                // 허용되지 않은 특수문자 (`^`)
            "abc1234567890123456789",  // 21자 (초과)
            "ab12",                     // 4자 (부족)
            "ABC123",                   // 소문자 없음
            "abcd@",                    // 숫자 없음
            "1234@",                    // 소문자 없음
            "abc 123",                  // 공백 포함
            "abC!@#",                   // 숫자 없음
            "abc123*",                  // `*`은 허용되지 않음
            "a1@",                      // 길이 부족
            UserFixture.collectPassword // 비밀번호와 동일 (검증에 따라 실패할 수도 있음)
    })
    void 회원가입시_유저_아이디가_조건에_맞지_않으면_실패한다(String userId) {
        // given
        String password = UserFixture.collectPassword;
        String name = UserFixture.collectName;
        String phoneNumber = UserFixture.collectPhoneNumber;
        //  when
        try {
            UserRegisterRequest request = UserRequestFixture.createUserRegisterRequest(userId, password, name, phoneNumber);
            Set<ConstraintViolation<UserRegisterRequest>> violations = validator.validate(request);
            // then
            if (violations.isEmpty()) {
                fail("예외나 검증 실패가 발생하지 않았습니다. 유효하지 않은 userId: " + userId);
            }
        } catch (RestApiException e) {

        }
    }

    /*
    비밀번호 규칙
    • 8자 ~ 20자
    • 숫자랑 영어 대소문자 반드시 하나이상 포함
    • 특수문자는 반드시 하나가 필요하고 !@#$%^ 만 허용
    • 공백 포함 불가
    • 아이디와 동일한 비밀번호 불가
     */
    @ParameterizedTest
    @ValueSource(strings = {
            "short1!",              // 7자 (길이 부족)
            "longpassword1234567890!", // 21자 (길이 초과)
            "abcdefgh",             // 영문 소문자만 (숫자 없음)
            "ABCDEFGH",             // 영문 대문자만 (숫자 없음)
            "12345678",             // 숫자만 (영문 없음)
            "Abcdefgh",             // 영문만 (숫자 없음)
            "abcd1234*",            // 허용되지 않은 특수문자 `*`
            "abc def123!",          // 공백 포함
            UserFixture.collectUserId,      // 아이디와 동일하거나 포함
            "passWord!",            // 특수문자 있음, 숫자 없음
            "1234!@#$",             // 숫자 + 특수문자, 문자 없음
            "Abcdef12()",           // 괄호 포함 (허용되지 않은 특수문자)
            "ABCD1234~",            // `~` 특수문자 허용 안됨
    })
    void 회원가입시_유저_비밀번호가_조건에_맞지_않으면_실패한다(String password) {
        String userId = UserFixture.collectUserId;
        String name = UserFixture.collectName;
        String phoneNumber = UserFixture.collectPhoneNumber;

        //  when
        try {
            UserRegisterRequest request = UserRequestFixture.createUserRegisterRequest(userId, password, name, phoneNumber);
            Set<ConstraintViolation<UserRegisterRequest>> violations = validator.validate(request);
            // then
            if (violations.isEmpty()) {
                fail("예외나 검증 실패가 발생하지 않았습니다. 유효하지 않은 userId: " + userId);
            }
        } catch (RestApiException e) {

        }
    }
}