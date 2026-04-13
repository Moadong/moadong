package moadong.unit.global.validator;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import moadong.global.validator.PhoneNumberValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class PhoneNumberValidatorTest {

    private PhoneNumberValidator phoneNumberValidator;

    @BeforeEach
    void setUp() {
        phoneNumberValidator = new PhoneNumberValidator();
    }

    @Test
    @DisplayName("빈 문자열이나 null은 유효하다")
    void 빈_문자열이나_null은_유효하다() {
        assertTrue(phoneNumberValidator.isValid(null, null));
        assertTrue(phoneNumberValidator.isValid("", null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "010-1234-5678", "01012345678",
            "02-123-4567", "021234567",
            "031-1234-5678", "03112345678",
            "011-123-4567"
    })
    @DisplayName("유효한 전화번호 입력은 성공한다")
    void 유효한_전화번호_입력은_성공한다(String input) {
        assertTrue(phoneNumberValidator.isValid(input, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "010-123-456", "010-12345-678",
            "abc-defg-hijk", "010-1234-567a",
            "050-1234-5678", "070-1234-5678"
    })
    @DisplayName("유효하지 않은 전화번호 입력은 실패한다")
    void 유효하지_않은_전화번호_입력은_실패한다(String input) {
        assertFalse(phoneNumberValidator.isValid(input, null));
    }
}
