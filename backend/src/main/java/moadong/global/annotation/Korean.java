package moadong.global.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import moadong.global.validator.KoreanValidator;

@Constraint(validatedBy = KoreanValidator.class)
@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface Korean {
    String message() default "Invalid korean format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
