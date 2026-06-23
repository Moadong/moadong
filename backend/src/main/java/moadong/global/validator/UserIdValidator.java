package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import moadong.global.annotation.UserId;

public class UserIdValidator implements ConstraintValidator<UserId, String> {
    // 5~20자 길이에서 최소 한 개의 소문자 영어를 포함하고, 숫자/특수문자(!@#$~)는 선택적으로 포함 가능
    private static final Pattern USER_ID_PATTERN = Pattern.compile("^(?=.*[a-z])[a-zA-Z\\d!@#$~]{5,20}$");
    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null || s.isEmpty()) {
            return true;
        }
        return USER_ID_PATTERN.matcher(s).matches();
    }
}
