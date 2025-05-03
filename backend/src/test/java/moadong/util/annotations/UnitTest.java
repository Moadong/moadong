package moadong.util.annotations;



import moadong.global.util.TestTypeConstants;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Tag(TestTypeConstants.UNIT_TEST)
@ExtendWith(MockitoExtension.class)
public @interface UnitTest {

}
