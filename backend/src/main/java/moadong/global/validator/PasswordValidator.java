package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import moadong.global.annotation.Password;

import java.util.regex.Pattern;

public class PasswordValidator implements ConstraintValidator<Password, String> {
    private static final String REGEX = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^])(?!.*\\s).{8,20}$";
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(REGEX);

    @Override
    public boolean isValid(String s, ConstraintValidatorContext context) {
        if (s == null || s.isEmpty()) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(s).matches();
    }

}

