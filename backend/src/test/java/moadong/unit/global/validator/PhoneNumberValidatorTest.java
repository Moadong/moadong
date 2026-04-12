package moadong.unit.global.validator;

import moadong.global.validator.PhoneNumberValidator;
import moadong.util.annotations.UnitTest;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@UnitTest
public class PhoneNumberValidatorTest {
    private final PhoneNumberValidator phoneNumberValidator = new PhoneNumberValidator();

    @ParameterizedTest
    @ValueSource(strings = {
            "010-1234-5678",
            "01012345678",
            "02-123-4567",
            "031-1234-5678",
            "011-123-4567",
            "010-0000-0000",
            "0511234567"
    })
    void 유효한_전화번호는_유효하다(String phoneNumber) {
        boolean isValid = phoneNumberValidator.isValid(phoneNumber, null);
        Assertions.assertThat(isValid).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "010123456789",       // 너무 긴 번호
            "010-123-456",        // 너무 짧은 번호
            "123-4567-8901",      // 잘못된 시작 번호
            "010-ABCD-5678",      // 문자 포함
            "010 1234 5678",      // 공백 포함
            "010-1234-567!",      // 특수문자
            ""                    // 빈 문자열
    })
    void 유효하지_않은_전화번호는_실패한다(String phoneNumber) {
        if (phoneNumber.isEmpty()) {
            Assertions.assertThat(phoneNumberValidator.isValid(phoneNumber, null)).isTrue();
            return;
        }
        boolean isValid = phoneNumberValidator.isValid(phoneNumber, null);
        Assertions.assertThat(isValid).isFalse();
    }
}
