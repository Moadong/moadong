package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import moadong.global.annotation.Password;

import java.util.regex.Pattern;

public class PasswordValidator implements ConstraintValidator<Password, String> {
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("\"^(?=.*[a-zA-Z])(?=.*\\\\d)(?=.*[!@#$%^])[a-zA-Z\\\\d!@#$%^]{8,20}$\"\n");
    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null || s.isEmpty()) {
            return true;
        }
        return PASSWORD_PATTERN.matcher(s).matches();
    }
}
