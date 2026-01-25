package moadong.global.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;
import moadong.global.annotation.PhoneNumber;

public class PhoneNumberValidator implements ConstraintValidator<PhoneNumber, String> {
    /*
        두 개의 검사가 결합되어 있음.
        (1) 010-1234-5678 또는 01012345678 인지 검사
        (2) 02-123-4567 또는 031-1234-5678 인지 검사
        TODO: 테스트 코드 작성
     */
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
