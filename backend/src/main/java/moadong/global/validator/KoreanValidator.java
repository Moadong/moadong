package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import moadong.global.annotation.Korean;

public class KoreanValidator implements ConstraintValidator<Korean, String> {
    // 1 ~ 10자 오직 한글만 가능, 단 자음 또는 모음만 있는 경우는 제외
    // TODO: 테스트 코드 작성
    private static final Pattern KOREAN_ONLY_PATTERN = Pattern.compile("^[가-힣]{1,10}$");

    @Override
    public boolean isValid(String string, ConstraintValidatorContext constraintValidatorContext) {
        if (string == null || string.isEmpty()) {
            return true;
        }
        return KOREAN_ONLY_PATTERN.matcher(string).matches();
    }
}
