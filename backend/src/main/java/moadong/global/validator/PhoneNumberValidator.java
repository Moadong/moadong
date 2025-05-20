package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import moadong.global.annotation.PhoneNumber;

import java.util.regex.Pattern;

public class PhoneNumberValidator implements ConstraintValidator<PhoneNumber, String> {
    private static final Pattern PHONE_NUMBER_PATTERN =
            Pattern.compile("^(01[016789]-?\\d{3,4}-?\\d{4})|(0\\d{1,2}-?\\d{3,4}-?\\d{4})$");
    @Override
    public boolean isValid(String string, ConstraintValidatorContext constraintValidatorContext) {
        if (string == null || string.isEmpty()) {
            return true;
        }
        return PHONE_NUMBER_PATTERN.matcher(string).matches();
    }
}
