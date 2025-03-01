package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import moadong.global.annotation.Korean;

import java.util.regex.Pattern;

public class KoreanValidator implements ConstraintValidator<Korean, String> {
    private static final Pattern KOREAN_ONLY_PATTERN = Pattern.compile("^[가-힣]{1,10}$");

    @Override
    public boolean isValid(String string, ConstraintValidatorContext constraintValidatorContext) {
        if (string == null || string.isEmpty()) {
            return true;
        }
        return KOREAN_ONLY_PATTERN.matcher(string).matches();
    }
}
