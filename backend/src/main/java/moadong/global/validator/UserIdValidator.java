package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import moadong.global.annotation.UserId;

import java.util.regex.Pattern;

public class UserIdValidator implements ConstraintValidator<UserId, String> {
    // 5 ~ 20자 사이의 최소 한 개의 소문자 영어, 최소 한 개의 숫자가 포함되도록 검사. 이때, !@#$~만 포함 가능
    private static final Pattern USER_ID_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*\\d)[a-zA-Z\\d!@#$~]{5,20}$");
    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null || s.isEmpty()) {
            return true;
        }
        return USER_ID_PATTERN.matcher(s).matches();
    }
}
