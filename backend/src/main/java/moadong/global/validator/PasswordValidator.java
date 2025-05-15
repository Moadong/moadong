package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import moadong.global.annotation.Password;

import java.util.regex.Pattern;

public class PasswordValidator implements ConstraintValidator<Password, String> {
    // 8 ~ 20자이고, 반드시 한 개의 알파벳, 한 개의 숫자, !@#$%^ 중 한 개가 모두 들어 갔는지 확인
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("\"^(?=.*[a-zA-Z])(?=.*\\\\d)(?=.*[!@#$%^])[a-zA-Z\\\\d!@#$%^]{8,20}$\"\n");
    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null || s.isEmpty()) {
            return true;
        }
        return PASSWORD_PATTERN.matcher(s).matches();
    }
}
