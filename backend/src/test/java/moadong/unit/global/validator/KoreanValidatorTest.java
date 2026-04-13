package moadong.unit.global.validator;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import moadong.global.validator.KoreanValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class KoreanValidatorTest {

    private KoreanValidator koreanValidator;

    @BeforeEach
    void setUp() {
        koreanValidator = new KoreanValidator();
    }

    @Test
    @DisplayName("빈 문자열이나 null은 유효하다")
    void 빈_문자열이나_null은_유효하다() {
        assertTrue(koreanValidator.isValid(null, null));
        assertTrue(koreanValidator.isValid("", null));
    }

    @ParameterizedTest
    @ValueSource(strings = {"한글", "홍길동", "가나다라마바사아자차"})
    @DisplayName("유효한 한글 입력은 성공한다")
    void 유효한_한글_입력은_성공한다(String input) {
        assertTrue(koreanValidator.isValid(input, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {"abc", "123", "한글1", "ㄱㄴㄷ", "ㅏㅑㅓ", "가나다라마바사아자차카"})
    @DisplayName("유효하지 않은 한글 입력은 실패한다")
    void 유효하지_않은_한글_입력은_실패한다(String input) {
        assertFalse(koreanValidator.isValid(input, null));
    }
}
