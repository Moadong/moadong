package moadong.unit.global.validator;

import moadong.global.validator.KoreanValidator;
import moadong.util.annotations.UnitTest;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

@UnitTest
public class KoreanValidatorTest {
    private final KoreanValidator koreanValidator = new KoreanValidator();

    @ParameterizedTest
    @ValueSource(strings = {
            "한글",
            "가나다라마바사아자차",
            "김이박",
            "모아동"
    })
    void 유효한_한글_입력은_유효하다(String text) {
        boolean isValid = koreanValidator.isValid(text, null);
        Assertions.assertThat(isValid).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "ㄱㄴㄷ",             // 자음만
            "ㅏㅑㅓ",             // 모음만
            "한글123",            // 숫자 포함
            "Eng한글",            // 영어 포함
            "한 글",              // 공백 포함
            "너무긴한글입력입니다열자초과", // 10자 초과
            "!",                  // 특수문자
            ""                    // 빈 문자열은 isValid에서 true 반환 (nullable)
    })
    void 유효하지_않은_한글_입력은_실패한다(String text) {
        // 빈 문자열은 true로 처리되므로 테스트에서 제외하거나 별도 처리 필요
        if (text.isEmpty()) {
            Assertions.assertThat(koreanValidator.isValid(text, null)).isTrue();
            return;
        }
        boolean isValid = koreanValidator.isValid(text, null);
        Assertions.assertThat(isValid).isFalse();
    }
}
