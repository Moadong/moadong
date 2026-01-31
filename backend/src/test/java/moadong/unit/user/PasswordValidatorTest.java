package moadong.unit.user;

import moadong.fixture.UserFixture;
import moadong.global.validator.PasswordValidator;
import moadong.util.annotations.UnitTest;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@UnitTest
public class PasswordValidatorTest {
    private final PasswordValidator passwordValidator = new PasswordValidator();

    @Test
    void 유효한_비밀번호는_유효하다() {
        boolean isValid = passwordValidator.isValid(UserFixture.collectPassword, null);
        Assertions.assertThat(isValid).isTrue();
    }

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
            "passWord!",            // 특수문자 있음, 숫자 없음
            "1234!@#$",             // 숫자 + 특수문자, 문자 없음
            "Abcdef12()",           // 괄호 포함 (허용되지 않은 특수문자)
            "ABCD1234~",            // `~` 특수문자 허용 안됨
    })
    void 유효하지_않은_비밀번호는_실패한다(String password) {
        boolean isValid = passwordValidator.isValid(password, null);
        Assertions.assertThat(isValid).isFalse();
    }
}
