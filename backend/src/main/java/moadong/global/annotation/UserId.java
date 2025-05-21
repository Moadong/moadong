package moadong.global.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import moadong.global.validator.UserIdValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UserIdValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserId {
    String message() default "Invalid userId format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
